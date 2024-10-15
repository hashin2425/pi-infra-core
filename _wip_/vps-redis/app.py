import datetime
import json
import logging
import os
import threading
import time

import dotenv
import flask
import psutil
import redis

# --- setup --- #
dotenv.load_dotenv()

redis_host = os.environ.get("REDIS_HOST")
redis_port = int(os.environ.get("REDIS_PORT"))
redis_password = os.environ.get("REDIS_PASSWORD")
redis_connection_0 = redis.Redis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True, db=0)
redis_connection_1 = redis.Redis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True, db=1)

app = flask.Flask(__name__)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


# --- functions --- #
def get_now_jst() -> datetime.datetime:
    return datetime.datetime.now() + datetime.timedelta(hours=9)


def set_machine_status():
    while True:
        redis_connection_0.set("timestamp", get_now_jst().isoformat())
        redis_connection_0.set("cpu_percent", psutil.cpu_percent(interval=1))
        redis_connection_0.set("memory_percent", psutil.virtual_memory().percent)
        redis_connection_0.set("disk_percent", psutil.disk_usage("/").percent)
        redis_connection_0.set("memory_available_gb", round(psutil.virtual_memory().available / (1024**3), 2))
        redis_connection_0.set("disk_available_gb", round(psutil.disk_usage("/").free / (1024**3), 2))
        time.sleep(10)


self_check_thread = threading.Thread(target=set_machine_status, daemon=True)
self_check_thread.start()


# --- routes --- #
@app.before_request
def verify_api_key():
    if flask.request.path == "/":
        # Skip API key verification for the root path
        return

    api_key_from_headers = flask.request.headers.get("X-API-Key")
    api_key_from_query = flask.request.args.get("api_key")
    api_key = api_key_from_headers if api_key_from_query is None else api_key_from_query
    if api_key != os.environ.get("API_KEY"):
        return flask.jsonify({"message": "Invalid API key"}), 401


@app.route("/get_all_data")
def get_list():
    try:
        list_items = ["timestamp", "room_temperature", "cpu_temperature"]
        result_dict = {}

        for item_name in list_items:
            list_data = redis_connection_1.lrange(item_name, 0, -1)
            parsed_data = []
            for item in list_data:
                parsed_item = json.loads(item)
                parsed_data.append(parsed_item)
            result_dict[item_name] = parsed_data

        return flask.jsonify(result_dict)
    except redis.RedisError as e:
        return flask.jsonify({"error": f"Redis error: {str(e)}"}), 500


@app.route("/")
def route_root():
    return f"Server is running. {get_now_jst().isoformat()} (JST)"


# --- main --- #
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        debug=os.environ.get("FLASK_DEBUG", "") == "True",
    )
