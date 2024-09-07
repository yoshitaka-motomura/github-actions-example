import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
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
