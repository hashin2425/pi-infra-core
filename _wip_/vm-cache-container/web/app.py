import os
import logging
import datetime
import psutil


import flask
import redis
import dotenv
import redis.exceptions

# --- setup --- #
dotenv.load_dotenv()

app = flask.Flask(__name__)
redis_pool = redis.ConnectionPool(host=os.environ.get("REDIS_HOST", "localhost"), port=6379, db=0)
redis_connections = {
    "redis_client_01": redis.Redis(connection_pool=redis_pool, db=1),
    "redis_client_02": redis.Redis(connection_pool=redis_pool, db=2),
    "redis_client_03": redis.Redis(connection_pool=redis_pool, db=3),
}

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


# --- functions --- #
def get_now_jst() -> datetime.datetime:
    return datetime.datetime.now() + datetime.timedelta(hours=9)


def get_machine_status() -> dict:
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage("/").percent,
        "memory_available_gb": round(psutil.virtual_memory().available / (1024**3), 2),
        "disk_available_gb": round(psutil.disk_usage("/").free / (1024**3), 2),
    }


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


@app.route("/")
def route_root():
    return f"Server is running. {get_now_jst().isoformat()} (JST)"


@app.route("/health-check/")
def route_health_check():
    try:
        redis_connections["redis_client_01"].ping()
        redis_connections["redis_client_01"].set("health_check", f"OK: Last checked at {(get_now_jst()).isoformat()} (JST).")

        result = redis_connections["redis_client_01"].get("health_check").decode("utf-8")
        return str(result)
    except (redis.exceptions.ConnectionError, redis.exceptions.BusyLoadingError, redis.exceptions.TimeoutError):
        return "Failed to connect to Redis server"


@app.route("/machine-check/")
def route_machine_check():
    return flask.jsonify(get_machine_status())


@app.route("/set/<db>/<key>/")
def route_set(key, db):
    redis_connections[db].set(key, "value")
    return flask.jsonify({"message": f"Set {key}"})


@app.route("/get/<db>/<key>/")
def route_get(key, db):
    value = redis_connections[db].get(key)
    if value:
        return flask.jsonify({key: value.decode("utf-8")})
    return flask.jsonify({"message": "Key not found"}), 404


@app.route("/delete/<db>/<key>/")
def route_delete(key, db):
    redis_connections[db].delete(key)
    return flask.jsonify({"message": f"Deleted {key}"})


# --- main --- #
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        debug=os.environ.get("FLASK_DEBUG", "") == "True",
    )
