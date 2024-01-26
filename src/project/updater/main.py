import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    project_id = event["pathParameters"]["project"]

    body = json.loads(event["body"])

    set_clauses_list = []
    parameters = {}

    for key in body:
        set_clauses_list.append(f"{key} = :{key}")

        parameters[key] = body[key]

    parameters["project_id"] = project_id

    set_clauses = ",\n\t\t\t".join(set_clauses_list)

    sqlalchemy_engine = create_engine(
        f"postgresql+pg8000://{os.environ['DATABASE_USERNAME']}:{os.environ['DATABASE_PASSWORD']}@{os.environ['DATABASE_URL']}/{os.environ['DATABASE_NAME']}",
        echo=True,
    )

    with sqlalchemy_engine.connect() as sqlalchemy_engine_connection:
        project_updater_query = text(
            f"""
                UPDATE
                    projects
                SET
                    {set_clauses}
                WHERE
                    id = :project_id
            """
        )

        sqlalchemy_engine_connection.execute(project_updater_query, parameters)

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
                    id = :project_id
            """
        )

        project_result = sqlalchemy_engine_connection.execute(
            project_fetcher_query, {"project_id": project_id}
        )

        project_result_dict = dict(project_result.mappings().fetchone())

        return {"statusCode": 200, "body": json.dumps(project_result_dict)}
