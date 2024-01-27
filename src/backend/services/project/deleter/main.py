import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    project_id = event["pathParameters"]["project"]

    sqlalchemy_engine = create_engine(
        f"postgresql+pg8000://{os.environ['DATABASE_USERNAME']}:{os.environ['DATABASE_PASSWORD']}@{os.environ['DATABASE_URL']}/{os.environ['DATABASE_NAME']}",
        echo=True,
    )

    with sqlalchemy_engine.connect() as sqlalchemy_engine_connection:
        project_deleter_query = text(
            """
                DELETE
                FROM
                    projects
                WHERE
                    id = :project_id
            """
        )

        sqlalchemy_engine_connection.execute(
            project_deleter_query, {"project_id": project_id}
        )

        sqlalchemy_engine_connection.commit()

        return {"statusCode": 204}
