import { DynamoDB, DynamoDBConfiguration } from "@aws-sdk/client-dynamodb-v2-node";

let config: DynamoDBConfiguration = { region: process.env.AWS_DEFAULT_REGION }
if (process.env.AWS_DYNAMODB_ENDPOINT) {
    config.endpoint = process.env.AWS_DYNAMODB_ENDPOINT;
}
const dynamoDB = new DynamoDB(config);

export { dynamoDB };