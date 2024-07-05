import os
import json

import azure.cosmos as cosmos
import azure.functions as func

DATA_LIMIT = 256


def main(req: func.HttpRequest) -> func.HttpResponse:
    # connect to Cosmos DB
    COSMOS_CONNECTION_STRING = os.environ["COSMOS_CONNECTION_STRING"]
    COSMOS_DATABASE_NAME = os.environ["COSMOS_DATABASE_NAME"]
    COSMOS_CONTAINER_NAME = os.environ["COSMOS_CONTAINER_NAME"]

    cosmos_client = cosmos.CosmosClient.from_connection_string(COSMOS_CONNECTION_STRING)
    cosmos_database = cosmos_client.get_database_client(COSMOS_DATABASE_NAME)
    cosmos_container = cosmos_database.get_container_client(COSMOS_CONTAINER_NAME)

    item = cosmos_container.read_item(item="main-id", partition_key="main-ItemName")

    # validate the item
    for key in ["room_temperature", "cpu_temperature", "timestamp"]:
        if key not in item:
            item[key] = []

    # validate the length of the item
    while len(item["timestamp"]) >= DATA_LIMIT:
        item["timestamp"].pop()

    while len(item["room_temperature"]) >= DATA_LIMIT:
        item["room_temperature"].pop()

    while len(item["cpu_temperature"]) >= DATA_LIMIT:
        item["cpu_temperature"].pop()

    # update the item
    request_body = req.get_json()
    item["timestamp"].append(validate_number(request_body["timestamp"]))
    item["room_temperature"].append(validate_number(request_body["room_temperature"]))
    item["cpu_temperature"].append(validate_number(request_body["cpu_temperature"]))

    # write the item
    body_json = json.dumps(item)
    cosmos_container.upsert_item(body=item)

    return func.HttpResponse(body=body_json, status_code=200, mimetype="application/json")


def validate_number(raw):
    try:
        return float(raw)
    except ValueError:
        return None
