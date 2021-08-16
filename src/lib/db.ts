import { DynamoDB, DynamoDBConfiguration } from '@aws-sdk/client-dynamodb-v2-node'

const config: DynamoDBConfiguration = { region: process.env.AWS_DEFAULT_REGION }

if (process.env.AWS_DYNAMODB_ENDPOINT) {
  config.endpoint = process.env.AWS_DYNAMODB_ENDPOINT
}

if (process.env.JEST_WORKER_ID) {
  config.endpoint = 'http://localhost:8000'
  config.sslEnabled = false
  config.region = 'local-env'
}
const dynamoDB = new DynamoDB(config)

export { dynamoDB }
