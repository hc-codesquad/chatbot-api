import AWS from 'aws-sdk';

export const ddb = new AWS.DynamoDB({
  endpoint: process.env.DYNAMODB_ENDPOINT,
  region: process.env.AWS_REGION,
});

export const ddbClient = new AWS.DynamoDB.DocumentClient({ service: ddb });
