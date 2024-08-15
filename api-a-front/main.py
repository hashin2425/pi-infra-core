# https://api-a.hashin.net/get-status/

import os
import json
import time
import traceback

from decimal import Decimal
from datetime import datetime as dt

import boto3

TABLE_NAME = os.environ.get("TABLE_NAME")
ITEM_NAME = "main-item"

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def default(obj) -> object:
    if isinstance(obj, Decimal):
        if int(obj) == obj:
            return int(obj)
        else:
            return float(obj)
    elif isinstance(obj, set):
        return list(obj)
    try:
        return str(obj)
    except Exception:
        return None


def moving_average(data, window_size) -> list:
    if window_size <= 0 or window_size > len(data) or len(data) == 0:
        return []

    result = []
    for i in range(len(data) - window_size + 1):
        window = data[i : i + window_size]
        average = sum(window) / window_size
        result.append(average)

    return result


def truncate_to_second_decimal(numbers):
    return [int(num * 100) / 100 for num in numbers]


def fetch_item():
    response = table.get_item(Key={"id": ITEM_NAME})
    item = response.get("Item")
    if item:
        return item
    else:
        return {}


def lambda_handler(event, context):
    try:
        item = fetch_item()
        temp_last_updated = item.get("timestamp", [0])[-1]
        temp_room_temperature = item.get("room_temperature", [])
        temp_cpu_temperature = item.get("cpu_temperature", [])
        temp_timestamp = item.get("timestamp", [])

        response_body = {
            "server_time": time.time(),
            "machine_time": temp_last_updated,
            "endpoint_name": "get_info_v2a",
            "machine_status": [
                {
                    "name": "room_temperature",
                    "display_name": "Room Temperature",
                    "value": item.get("room_temperature", [0])[-1],
                    "x": truncate_to_second_decimal(reversed(temp_timestamp)),
                    "y": truncate_to_second_decimal(reversed(temp_room_temperature)),
                },
                {
                    "name": "cpu_temperature",
                    "display_name": "CPU Temperature",
                    "value": item.get("cpu_temperature", [0])[-1],
                    "x": truncate_to_second_decimal(reversed(temp_timestamp)),
                    "y": truncate_to_second_decimal(reversed(temp_cpu_temperature)),
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

        return {
            "statusCode": 200,
            # プロキシー統合しているので、以下のヘッダーは必要
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            "body": json.dumps(response_body, default=default),
        }
    except (Exception, BaseException) as e:
        print(e)
        return {"statusCode": 500, "body": json.dumps(f"Internal Server Error: {e}")}
