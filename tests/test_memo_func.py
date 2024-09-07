from lambda_functions.memo_func import lambda_handler


def test_memo_func_handler():
    event = {}
    context = {}
    response = lambda_handler(event, context)
    assert response["statusCode"] == 200
    assert "Hello from Lambda!" in response["body"]
