import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    start_date = event["queryStringParameters"]["start_date"]
    end_date = event["queryStringParameters"]["end_date"]

    sqlalchemy_engine = create_engine(
        f"postgresql+pg8000://{os.environ['DATABASE_USERNAME']}:{os.environ['DATABASE_PASSWORD']}@{os.environ['DATABASE_URL']}/{os.environ['DATABASE_NAME']}",
        echo=True,
    )

    with sqlalchemy_engine.connect() as sqlalchemy_engine_connection:
        task_instances_fetcher_query = text(
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
                    DATE(task_instances.created_at) BETWEEN :start_date AND :end_date
                AND
                    projects.user_id = :user_id;
            """
        )

        task_instances_result_set = sqlalchemy_engine_connection.execute(
            task_instances_fetcher_query,
            {"start_date": start_date, "end_date": end_date, "user_id": user_id},
        )

        task_instances_result = [
            dict(row) for row in task_instances_result_set.mappings().all()
        ]

        return {"statusCode": 200, "body": json.dumps(task_instances_result)}
