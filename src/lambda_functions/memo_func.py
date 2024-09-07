import json
def lambda_handler(event, context):
    # some code
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Hello from Lambda!',
        })
    }