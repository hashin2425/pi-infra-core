import json

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    response = {"message": "hello world."}
    return func.HttpResponse(body=json.dumps(response), status_code=200, mimetype="application/json")
