import os
import json
import logging

import numpy as np
import azure.cosmos as cosmos
import azure.functions as func


def moving_average(data, window_size):
    return np.convolve(data, np.ones(window_size), "valid") / window_size


def main(req: func.HttpRequest) -> func.HttpResponse:
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.ERROR)

    try:
        COSMOS_CONNECTION_STRING = os.environ["COSMOS_CONNECTION_STRING"]
        COSMOS_DATABASE_NAME = os.environ["COSMOS_DATABASE_NAME"]
        COSMOS_CONTAINER_NAME = os.environ["COSMOS_CONTAINER_NAME"]

        cosmos_client = cosmos.CosmosClient.from_connection_string(COSMOS_CONNECTION_STRING)
        cosmos_database = cosmos_client.get_database_client(COSMOS_DATABASE_NAME)
        cosmos_container = cosmos_database.get_container_client(COSMOS_CONTAINER_NAME)

        item = cosmos_container.read_item(item="main-id", partition_key="main-ItemName")

        body_dict = {}
        WINDOW_SIZE = 10
        body_dict["room_temperature"] = moving_average(item["room_temperature"], WINDOW_SIZE)
        body_dict["cpu_temperature"] = moving_average(item["cpu_temperature"], WINDOW_SIZE)
        body_dict["timestamp"] = moving_average(item["timestamp"], WINDOW_SIZE)
        body_json = json.dumps(body_dict)

        return func.HttpResponse(body=body_json, status_code=200, mimetype="application/json")

    except Exception as e:
        logger.error(e)
        return func.HttpResponse(body="Internal Server Error", status_code=500)
