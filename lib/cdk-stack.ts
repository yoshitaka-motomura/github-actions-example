import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { account, region } = cdk.Stack.of(this)
    const Bucket = new s3.Bucket(this, 'ServiceBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: false,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: `input-bucket-${region}-${account}`,
    })

    new cdk.CfnOutput(this, 'BucketName', {
      value: Bucket.bucketName,
      description: 'The name of the S3 bucket',
    });
  }
}
