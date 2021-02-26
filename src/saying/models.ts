import { dynamoDB } from "../lib/db"

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
                await dynamoDB.deleteItem({ TableName: "Word", Key: { "keyword": { S: keyword }, "word": { S: word.word.S } } })
            }
            await dynamoDB.deleteItem({ TableName: "Saying", Key: { "keyword": { S: keyword } } })
        } catch (e) {
            console.log(e);
        }

    }
    static async list(keyword: string) {
        try {
            return dynamoDB.query({
                TableName: "Word",
                ExpressionAttributeValues: {
                    ":keyword": { S: keyword }
                },
                KeyConditionExpression: "keyword = :keyword"
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async exists(keyword: string) {
        try {
            const result = await dynamoDB.getItem({
                TableName: "Saying",
                Key: { keyword: { S: keyword } }
            })
            return typeof result.Item !== "undefined";
        } catch (e) {
            console.log(e);
        }
    }

    static async add(keyword: string, word: string) {
        try {
            if (await Saying.exists(keyword)) {
                await dynamoDB.putItem({
                    TableName: "Word",
                    Item: { keyword: { S: keyword }, word: { S: word } }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async remove(keyword: string, word: string) {
        try {
            if (await Saying.exists(keyword)) {
                await dynamoDB.deleteItem({
                    TableName: "Word",
                    Key: { keyword: { S: keyword }, word: { S: word } }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async pop(keyword: string, owner: string) {
        try {
            if (await Saying.exists(keyword)) {
                await dynamoDB.putItem({
                    TableName: "Word",
                    Item: { keyword: { S: keyword } }
                });
            }
        } catch (e) {
            console.log(`${e}`);
        }
    }

}


export { Saying }