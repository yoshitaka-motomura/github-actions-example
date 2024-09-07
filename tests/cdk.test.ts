import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Cdk from '../lib/cdk-stack';

const app = new cdk.App();
const stack = new Cdk.CdkStack(app, 'MyTestStack');
const template = Template.fromStack(stack);

describe('CDK Stack Resources Tests', () =>{
    test('S3 Bucket Created', () => {
        expect(template.resourceCountIs('AWS::S3::Bucket', 1));
        expect(template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: {
            Status: 'Enabled',
        },
        PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
        },
        }));
    });

    test('DynamoDB Table Created', () => {
        expect(template.resourceCountIs('AWS::DynamoDB::Table', 1));
        expect(template.hasResourceProperties('AWS::DynamoDB::Table', {
        KeySchema: [
            {
            AttributeName: 'id',
            KeyType: 'HASH',
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        }));
    })
    test('Lambda Function Created', () => {
        expect(template.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'memo_func.lambda_handler',
            Runtime: 'python3.12',
            MemorySize: 256,
        }));
    })

    test('API Gateway Created', () => {
        expect(template.resourceCountIs('AWS::ApiGateway::RestApi', 1));
        expect(template.hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'Memo API',
            Description: 'This service serves memo'
        }));
    })

    test('Lambda Function Integration', () => {
        expect(template.hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
        }))
    })

});

