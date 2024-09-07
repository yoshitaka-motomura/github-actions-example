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
});

