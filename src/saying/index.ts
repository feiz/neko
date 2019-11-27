import { app } from "../app";
import {
  DynamoDB,
  DynamoDBClient,
  QueryOutput
} from "@aws-sdk/client-dynamodb-v2-node";

const command: string = "saying";
interface botCommand {
  (args: string[]): Promise<string>;
}
const dynamoDB = new DynamoDB({
  endpoint: "http://localhost:8000",
  region: "us-east-1"
});
async () => {
  try {
    await dynamoDB.createTable({
      TableName: "Saying",
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      AttributeDefinitions: [{ AttributeName: "keyword", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "keyword", KeyType: "HASH" }]
    });
    await dynamoDB.createTable({
      TableName: "Words",
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      AttributeDefinitions: [
        { AttributeName: "keyword", AttributeType: "S" },
        { AttributeName: "word", AttributeType: "S" }
      ],
      KeySchema: [
        { AttributeName: "keyword", KeyType: "HASH" },
        { AttributeName: "word", KeyType: "RANGE" }
      ]
    });
  } catch (e) {
    console.log(e);
  }
};
const subCommands: { [key: string]: botCommand } = {
  create: async args => {
    const word = args[0];
    dynamoDB.putItem({ TableName: "Saying", Item: { keyword: { S: word } } });
    return `語録「${word}」を登録しました`;
  },
  delete: async args => {
    const word = args[0];
    return `語録「${word}」を削除しました`;
  },
  list: async args => {
    const keyword = args[0];
    const wds = await dynamoDB.query({
      TableName: "Words",
      ExpressionAttributeValues: {
        ":keyword": { S: keyword }
      },
      KeyConditionExpression: "keyword = :keyword"
    });
    let wordlist = "";
    for (let word of wds.Items) {
      wordlist += word.word.S + "\n";
    }
    return wordlist + "など";
  }
};

for (let subcommand in subCommands) {
  const ptn = new RegExp(String.raw`^\?${command} ${subcommand}(?<args> .*)`);
  const commandFunc = subCommands[subcommand];

  app.message(ptn, async ({ context, say }) => {
    const args = context.matches[1].trim().split(" ");
    const msg = await commandFunc(args);
    say(msg);
  });
}

function choice(items: QueryOutput["Items"]): any {
  const index = Math.floor(Math.random() * items.length);
  return items[index].word.S;
}
app.message(/^!(.*)/, async ({ context, say }) => {
  const source = context.matches[1].trim();
  const keyword = args[0];
  const word = args[1];
  dynamoDB.putItem({
    TableName: "Words",
    Item: { keyword: { S: keyword }, word: { S: word } }
  });

  try {
    await dynamoDB.getItem({
      TableName: "Saying",
      Key: { keyword: { S: keyword } }
    });

    const wds = await dynamoDB.query({
      TableName: "Words",
      ExpressionAttributeValues: {
        ":keyword": { S: keyword }
      },
      KeyConditionExpression: "keyword = :keyword"
    });
    const wd = choice(wds.Items);
    say(`${wd}`);
  } catch (e) {
    say(`${e}`);
  }
});
