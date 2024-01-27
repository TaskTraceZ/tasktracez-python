import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    task_id = event["pathParameters"]["task"]

    sqlalchemy_engine = create_engine(
        f"postgresql+pg8000://{os.environ['DATABASE_USERNAME']}:{os.environ['DATABASE_PASSWORD']}@{os.environ['DATABASE_URL']}/{os.environ['DATABASE_NAME']}",
        echo=True,
    )

    with sqlalchemy_engine.connect() as sqlalchemy_engine_connection:
        task_fetcher_query = text(
            """
                SELECT
                    id,
                    title,
                    description,
                    to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
                    to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at
                FROM
                    tasks
                WHERE
                    id = :task_id
            """
        )

        task_result = sqlalchemy_engine_connection.execute(
            task_fetcher_query, {"task_id": task_id}
        )

        task_result_dict = dict(task_result.mappings().fetchone())

        return {"statusCode": 200, "body": json.dumps(task_result_dict)}
