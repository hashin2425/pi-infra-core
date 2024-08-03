import os
import json
import time
import logging

import numpy as np
import azure.cosmos as cosmos
import azure.functions as func


def moving_average(data, window_size) -> list:
    np_array = np.convolve(data, np.ones(window_size), "valid") / window_size
    return np_array.tolist()


def truncate_to_second_decimal(numbers):
    return [int(num * 100) / 100 for num in numbers]


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

        WINDOW_SIZE = 10
        temp_room_temperature = moving_average(item["room_temperature"], WINDOW_SIZE)
        temp_cpu_temperature = moving_average(item["cpu_temperature"], WINDOW_SIZE)
        temp_timestamp = moving_average(item["timestamp"], WINDOW_SIZE)
        temp_last_updated = item["timestamp"][-1]

        body_dict = {
            "server_time": time.time(),
            "machine_time": temp_last_updated,
            "endpoint_name": "get_info_v2",
            "machine_status": [
                {
                    "name": "room_temperature",
                    "display_name": "Room Temperature",
                    "value": item["room_temperature"][-1],
                    "x": truncate_to_second_decimal(temp_room_temperature),
                    "y": truncate_to_second_decimal(temp_timestamp),
                },
                {
                    "name": "cpu_temperature",
                    "display_name": "CPU Temperature",
                    "value": item["cpu_temperature"][-1],
                    "x": truncate_to_second_decimal(temp_cpu_temperature),
                    "y": truncate_to_second_decimal(temp_timestamp),
                },
            ],
            "running_jobs": [
                {
                    "name": "test_job_1",
                    "display_name": "TestJob 1",
                    "status": "running",
                    "start_time": time.time(),
                },
            ],
        }
        body_json = json.dumps(body_dict)

        return func.HttpResponse(body=body_json, status_code=200, mimetype="application/json")

    except Exception as e:
        logger.error(e)
        return func.HttpResponse(body="Internal Server Error", status_code=500)
