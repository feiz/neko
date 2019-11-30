import { dynamoDB } from "../lib/db"

(async () => {
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
})();

class Saying {
    static async create(keyword: string) {
        try {
            await dynamoDB.putItem({ TableName: "Saying", Item: { keyword: { S: keyword } } });
        } catch (e) {
            console.log(e);
        }
    }
    static async delete(keyword: string) {
        try {
            for (let word of await (await Saying.list(keyword)).Items) {
                await dynamoDB.deleteItem({ TableName: "Words", Key: { "keyword": { S: keyword }, "word": { S: word.word.S } } })
            }
            await dynamoDB.deleteItem({ TableName: "Saying", Key: { "keyword": { S: keyword } } })
        } catch (e) {
            console.log(e);
        }

    }
    static async list(keyword: string) {
        try {
            return dynamoDB.query({
                TableName: "Words",
                ExpressionAttributeValues: {
                    ":keyword": { S: keyword }
                },
                KeyConditionExpression: "keyword = :keyword"
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async add(keyword: string, word: string) {
        try {
            await dynamoDB.getItem({
                TableName: "Saying",
                Key: { keyword: { S: keyword } }
            });
            await dynamoDB.putItem({
                TableName: "Words",
                Item: { keyword: { S: keyword }, word: { S: word } }
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async remove(keyword: string, word: string) {
        try {
            await dynamoDB.getItem({
                TableName: "Saying",
                Key: { keyword: { S: keyword } }
            });
            await dynamoDB.deleteItem({
                TableName: "Words",
                Key: { keyword: { S: keyword }, word: { S: word } }
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async pop(keyword: string, owner: string) {
        try {
            await dynamoDB.getItem({
                TableName: "Saying",
                Key: { keyword: { S: keyword } }
            });
            await dynamoDB.putItem({
                TableName: "Words",
                Item: { keyword: { S: keyword } }
            });
        } catch (e) {
            console.log(`${e}`);
        }
    }

}


export { Saying }