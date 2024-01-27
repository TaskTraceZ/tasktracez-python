import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    task_instance_id = event["pathParameters"]["task-instance"]
    started_at = event["queryStringParameters"]["started_at"]

    sqlalchemy_engine = create_engine(
        f"postgresql+pg8000://{os.environ['DATABASE_USERNAME']}:{os.environ['DATABASE_PASSWORD']}@{os.environ['DATABASE_URL']}/{os.environ['DATABASE_NAME']}",
        echo=True,
    )

    with sqlalchemy_engine.connect() as sqlalchemy_engine_connection:
        task_instance_updater_query = text(
            f"""
                UPDATE
                    task_instances
                SET
                    started_at = :started_at,
                    in_progress = :in_progress

                WHERE
                    id = :task_instance_id;
            """
        )

        sqlalchemy_engine_connection.execute(
            task_instance_updater_query,
            {
                "started_at": started_at,
                "in_progress": True,
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

        return {"statusCode": 200, "body": json.dumps(task_instance_result_dict)}
