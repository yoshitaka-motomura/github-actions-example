import os
import json
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

TABLE_NAME = os.environ.get("TABLE_NAME", "test-table")
REGION = os.environ.get("REGION")
dynamodb = boto3.resource("dynamodb", region_name=REGION)
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    logger.info(f"Attempting to access DynamoDB table: {TABLE_NAME}")

    try:
        res = table.get_item(Key={"id": "1"})
        item = res.get("Item", {})
        logger.info(f"Retrieved item: {item}")
    except ClientError as e:
        logger.error(f"Error accessing DynamoDB: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise

    return {
        "statusCode": 200,
        "body": json.dumps({
            "data": item,
        }),
    }
