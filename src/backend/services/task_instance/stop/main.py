from datetime import datetime, timedelta
import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    task_instance_id = event["pathParameters"]["task-instance"]
    stopped_at = event["queryStringParameters"]["stopped_at"]

    stopped_at_time = datetime.strptime(stopped_at, "%H:%M:%S")

    sqlalchemy_engine = create_engine(
        f"postgresql+pg8000://{os.environ['DATABASE_USERNAME']}:{os.environ['DATABASE_PASSWORD']}@{os.environ['DATABASE_URL']}/{os.environ['DATABASE_NAME']}",
        echo=True,
    )

    with sqlalchemy_engine.connect() as sqlalchemy_engine_connection:
        task_instance_fetcher_query = text(
            """
                SELECT
                    started_at,
                    stopped_at,
                    duration_worked
                FROM
                    task_instances
                WHERE
                    id = :task_instance_id
            """
        )

        task_instance_result = sqlalchemy_engine_connection.execute(
            task_instance_fetcher_query, {"task_instance_id": task_instance_id}
        )

        task_instance_result_dict = dict(task_instance_result.mappings().fetchone())

        started_at_to_seconds = (
            task_instance_result_dict["started_at"].hour * 3600
            + task_instance_result_dict["started_at"].minute * 60
            + task_instance_result_dict["started_at"].second
        )

        stopped_at_to_seconds = (
            stopped_at_time.hour * 3600
            + stopped_at_time.minute * 60
            + stopped_at_time.second
        )

        duration_worked = task_instance_result_dict["duration_worked"] + (
            stopped_at_to_seconds - started_at_to_seconds
        )

        task_instance_updater_query = text(
            f"""
                UPDATE
                    task_instances
                SET
                    stopped_at = :stopped_at,
                    duration_worked = :duration_worked,
                    in_progress = :in_progress

                WHERE
                    id = :task_instance_id;
            """
        )

        sqlalchemy_engine_connection.execute(
            task_instance_updater_query,
            {
                "stopped_at": stopped_at,
                "duration_worked": duration_worked,
                "in_progress": False,
                "task_instance_id": task_instance_id,
            },
        )

        sqlalchemy_engine_connection.commit()

        task_instance_fetcher_query = text(
            """
                SELECT
                    task_instances.id,
                    task_instances.billable,
                    TO_CHAR(task_instances.started_at, 'HH24:MI:SS') AS started_at,
                    TO_CHAR(task_instances.stopped_at, 'HH24:MI:SS') AS stopped_at,
                    task_instances.duration_worked,
                    task_instances.in_progress,
                    to_char(task_instances.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
                    to_char(task_instances.updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at,
                    tasks.title AS task_title,
                    projects.title AS project_title
                FROM
                    task_instances
                JOIN
                    tasks ON task_instances.task_id = tasks.id
                JOIN
                    projects ON tasks.project_id = projects.id
                WHERE
                    task_instances.id = :task_instance_id
            """
        )

        task_instance_result = sqlalchemy_engine_connection.execute(
            task_instance_fetcher_query, {"task_instance_id": task_instance_id}
        )

        task_instance_result_dict = dict(task_instance_result.mappings().fetchone())

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json",
            },
            "body": json.dumps(task_instance_result_dict),
        }
