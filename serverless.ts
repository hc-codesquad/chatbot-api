import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'chatbot-api',
  },
  // app and org for use with dashboard.serverless.com
  app: 'chatbot-api',
  org: 'codesquad',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        port: '8000',
        dbPath: './.dynamodb',
        inMemory: false,
        migrate: false,
        seed: false,
      },
    },
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-dynamodb-local',
    'serverless-dotenv-plugin',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DYNAMODB_CHATS_TABLE: 'chabot-api-dev-chats',
      DYNAMODB_PRODUCT_SUGGESTIONS_TABLE: 'chabot-api-dev-product-suggestions',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
        ],
        Resource: '*',
      },
    ],
  },
  functions: {
    chatbot: {
      handler: 'src/handler.chatbot',
      events: [
        {
          http: {
            method: 'post',
            path: 'chatbot',
            cors: true,
          },
        },
      ],
    },
    paymentMethods:{
      handler: 'src/handler.paymentMethods',
      events: [
        {
          http: {
            method: 'get',
            path: 'payment-methods',
            cors: true,
          },
        },
      ],
    },
    payments:{
      handler: 'src/handler.payments',
      events: [
        {
          http: {
            method: 'post',
            path: 'payments',
            cors: true,
          },
        },
      ],
    },
    paymentsSettlements:{
      handler: 'src/handler.paymentsSettlements',
      events: [
        {
          http: {
            method: 'post',
            path: 'payments/{paymentId}/settlements',
            cors: true,
          },
        },
      ],
    },
    paymentsRefunds:{
      handler: 'src/handler.paymentsRefunds',
      events: [
        {
          http: {
            method: 'post',
            path: 'payments/{paymentId}/refunds',
            cors: true,
          },
        },
      ],
    },
  },
 /*  resources: {
    Resources: {
      ChatsDynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: 'chatbot-api-dev-chats',
        },
      },
      ProductSuggestionsDynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'skuId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'skuId',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: 'chatbot-api-dev-product-suggestions',
        },
      },
    },
  }, */
};

module.exports = serverlessConfiguration;
