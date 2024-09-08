import requests
import os
from dotenv import load_dotenv

load_dotenv()
BASE_URL = "http://localhost:5000"
API_KEY = os.getenv("API_KEY")


def test_root():
    requests.get(f"{BASE_URL}/", timeout=5)


def test_health_check():
    headers = {"X-API-Key": API_KEY}
    requests.get(f"{BASE_URL}/health-check/", headers=headers, timeout=5)


def test_set_get():
    headers = {"X-API-Key": API_KEY}
    requests.get(f"{BASE_URL}/set/redis_client_01/test_key/", headers=headers, timeout=5)
    requests.get(f"{BASE_URL}/get/redis_client_01/test_key/", headers=headers, timeout=5)


if __name__ == "__main__":
    while True:
        test_root()
        test_health_check()
        test_set_get()
