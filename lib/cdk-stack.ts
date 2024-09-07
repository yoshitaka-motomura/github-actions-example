import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'node:path';
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { account, region } = cdk.Stack.of(this)

    /**
     * S3 Bucket Construct
     */
    const Bucket = new s3.Bucket(this, 'ServiceBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: false,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: `input-bucket-${region}-${account}`,
    })

    /**
    * Dynamodb Table Construct
    */
    const memoTable = new dynamodb.Table(this, 'MemoTable', {
      tableName: 'Memo',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })


    /**
    * Lambda Function Construct
    */

    const lambdaFunction = new lambda.Function(this, 'MemoFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      memorySize: 256,
      handler: 'memo_func.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/lambda_functions')),
      logRetention: cdk.aws_logs.RetentionDays.ONE_DAY,
      functionName: 'MemoFunction',
      environment: {
        BUCKET_NAME: Bucket.bucketName,
        TABLE_NAME: memoTable.tableName,
      }
    })
    memoTable.grantReadWriteData(lambdaFunction)
    Bucket.grantReadWrite(lambdaFunction)
    const memoFuncIntegration = new apigateway.LambdaIntegration(lambdaFunction)

    /**
    * API Gateway Construct
    */

    const apigw = new apigateway.RestApi(this, 'MemoApi', {
      restApiName: 'Memo API',
      description: 'This service serves memo',
    })

    const memo = apigw.root.addResource('memo')
    memo.addMethod('GET', memoFuncIntegration)

    //deploy stage
    const deployment = new apigateway.Deployment(this, 'MemoDeployment', {
      api: apigw,
      stageName: 'v1',
    })

    /**
    * Output
    **/
    new cdk.CfnOutput(this, 'BucketName', {
      value: Bucket.bucketName,
      description: 'The name of the S3 bucket',
    });
    new cdk.CfnOutput(this, 'MemoTableName', {
      value: memoTable.tableName,
      description: 'The name of the DynamoDB table',
    })
  }
}
