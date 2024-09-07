import json
import pytest
from unittest.mock import patch
import example_lambda  # Lambda関数を含むモジュールをインポート


@pytest.fixture(scope="module")
def mock_dynamodb_table():
    """DynamoDBのテーブルをモック化"""
    with patch.object(example_lambda, "table") as mock_table:
        mock_table.get_item.return_value = {
            "Item": {"id": "1", "name": "Test Item", "description": "This is a test item"}
        }
        yield mock_table


@pytest.fixture(scope="module")
def mock_env_variables():
    """環境変数をモック化"""
    with patch.dict("os.environ", {"TABLE_NAME": "test-table", "REGION": "ap-northeast-1"}):
        yield


def test_lambda_handler(mock_dynamodb_table, mock_env_variables):
    # Lambda関数を呼び出し
    result = example_lambda.lambda_handler({}, {})

    # レスポンスの検証
    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert "data" in body
    assert body["data"]["id"] == "1"
    assert body["data"]["name"] == "Test Item"

    # モックの呼び出しを検証
    mock_dynamodb_table.get_item.assert_called_once_with(Key={"id": "1"})


@pytest.fixture(scope="function")
def mock_dynamodb_table_error():
    """DynamoDBのテーブルをモック化し、ResourceNotFoundExceptionを発生させる"""
    with patch.object(example_lambda, "table") as mock_table:
        mock_table.get_item.side_effect = example_lambda.ClientError(
            {"Error": {"Code": "ResourceNotFoundException", "Message": "Table not found"}}, "GetItem"
        )
        yield mock_table


def test_lambda_handler_error(mock_dynamodb_table_error, mock_env_variables):
    """DynamoDBのテーブルが存在しない場合のテスト"""
    with pytest.raises(example_lambda.ClientError):
        example_lambda.lambda_handler({}, {})


def test_lambda_handler_error_other(mock_dynamodb_table_error):
    """その他のエラーが発生した場合のテスト Exceptionを発生させる"""
    mock_dynamodb_table_error.get_item.side_effect = Exception("Unknown error")
    with pytest.raises(Exception):
        example_lambda.lambda_handler({}, {})
