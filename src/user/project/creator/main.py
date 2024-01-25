import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    body = json.loads(event["body"])

    title = body["title"]
    description = body["description"]

    sqlalchemy_engine = create_engine(
        f"postgresql+pg8000://{os.environ['DATABASE_USERNAME']}:{os.environ['DATABASE_PASSWORD']}@{os.environ['DATABASE_URL']}/{os.environ['DATABASE_NAME']}",
        echo=True,
    )

    with sqlalchemy_engine.connect() as sqlalchemy_engine_connection:
        query = text(
            """
                INSERT INTO projects
                    (
                        title,
                        description,
                        user_id
                    )
                VALUES
                    (
                        :title,
                        :description,
                        :user_id
                    )
            """
        )

        new_project = sqlalchemy_engine_connection.execute(
            query,
            {
                "title": title,
                "description": description if description else "",
                "user_id": user_id,
            },
        )

        sqlalchemy_engine_connection.commit()

        new_project_row_id = new_project.lastrowid

        return {"statusCode": 201}
