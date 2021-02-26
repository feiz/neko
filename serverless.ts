import { AWS } from '@serverless/typescript'

import slack from 'src/slack'

const serverlessConfiguration: AWS = {
  service: 'neko',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    dynamodb: {
      stages: ['dev']
    }

  },
  plugins: ['serverless-offline', 'serverless-webpack', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
      SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:*'
            ],
            Resource: [
              { 'Fn::Join': [':', ['arn:aws:dynamodb', { Ref: 'AWS::Region' }, { Ref: 'AWS::AccountId' }, 'table/Saying']] },
              { 'Fn::Join': [':', ['arn:aws:dynamodb', { Ref: 'AWS::Region' }, { Ref: 'AWS::AccountId' }, 'table/Word']] }
            ]
          }

        ]
      }
    }
  },
  // import the function via paths
  functions: { slack },
  resources: {
    Resources: {
      saying: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Saying",
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [{ AttributeName: "keyword", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "keyword", KeyType: "HASH" }]
        }
      },
      word: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Word",
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
              { AttributeName: "keyword", AttributeType: "S" },
              { AttributeName: "word", AttributeType: "S" }
          ],
          KeySchema: [
              { AttributeName: "keyword", KeyType: "HASH" },
              { AttributeName: "word", KeyType: "RANGE" }
          ]
        }
      }

    }
  }
}

module.exports = serverlessConfiguration
