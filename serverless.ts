import { AWS } from '@serverless/typescript'

import slack from 'src/slack'

const serverlessConfiguration: AWS = {
  service: 'neko',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-offline', 'serverless-webpack'],
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
    lambdaHashingVersion: '20201221'
  },
  // import the function via paths
  functions: { slack }
}

module.exports = serverlessConfiguration
