import os
import json
import time
import traceback

from decimal import Decimal
from datetime import datetime as dt

import boto3

TABLE_NAME = os.environ.get("TABLE_NAME")
ITEM_NAME = "main-item"
DATA_LIMIT = 4096


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


def save_value(value: dict, table):
    item = value.copy()
    item["id"] = ITEM_NAME
    # floatがサポートされていないので、decimal.Decimal
    serialized_data = json.loads(json.dumps(item, default=default), parse_float=Decimal)
    table.put_item(Item=serialized_data)


def fetch_item(table) -> dict:
    response = table.get_item(Key={"id": ITEM_NAME})
    item = response.get("Item")
    if item:
        return item
    else:
        return {}


def validate_number(raw) -> float:
    try:
        num_float = float(raw)
        truncated_num = round(int(num_float * 100) / 100, 2)
        return truncated_num
    except ValueError:
        return -1


def process_data(item: dict, request_body: dict):
    # Dequeなどで高速化するコードも試したが、結局これが一番速かった。キャストするのに余計に時間がかかる。

    # validate the item
    for key in ["room_temperature", "cpu_temperature", "timestamp"]:
        if key not in item:
            item[key] = []

    # validate the length of the item
    while len(item["timestamp"]) >= DATA_LIMIT:
        item["timestamp"].pop(0)

    while len(item["room_temperature"]) >= DATA_LIMIT:
        item["room_temperature"].pop(0)

    while len(item["cpu_temperature"]) >= DATA_LIMIT:
        item["cpu_temperature"].pop(0)

    # update the item
    item["timestamp"].append(validate_number(request_body["timestamp"]))
    item["room_temperature"].append(validate_number(request_body["room_temperature"]))
    item["cpu_temperature"].append(validate_number(request_body["cpu_temperature"]))

    return item


def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table(TABLE_NAME)

        response_body = {
            "message": dt.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

        item: dict = fetch_item(table)
        received_data: dict = json.loads(event["body"])

        result = process_data(item, received_data)

        save_value(result, table)

        return {"statusCode": 200, "body": json.dumps(response_body)}
    except (Exception, ValueError) as e:
        return {"statusCode": 500, "body": json.dumps(f"Internal Server Error: {traceback.format_exc()}")}
