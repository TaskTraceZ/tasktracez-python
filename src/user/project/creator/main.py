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
        user_project_creator_query = text(
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
                RETURNING
                    id
            """
        )

        user_project_creation_result = sqlalchemy_engine_connection.execute(
            user_project_creator_query,
            {
                "title": title,
                "description": description if description else "",
                "user_id": user_id,
            },
        )

        project_id = user_project_creation_result.fetchone()[0]

        sqlalchemy_engine_connection.commit()

        project_fetcher_query = text(
            """
                SELECT
                    id,
                    title,
                    description,
                    to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
                    to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at
                FROM
                    projects
                WHERE
                    id = :project_id;
            """
        )

        project_result = sqlalchemy_engine_connection.execute(
            project_fetcher_query, {"project_id": project_id}
        )

        project_result_dict = dict(project_result.mappings().fetchone())

        return {"statusCode": 201, "body": json.dumps(project_result_dict)}
