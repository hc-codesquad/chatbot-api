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
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dynamodb-local'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    hello: {
      handler: 'src/handler.chatbot',
      events: [
        {
          http: {
            method: 'get',
            path: 'chatbot',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
