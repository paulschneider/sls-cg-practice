import AWS from "aws-sdk"
// import { DeleteItemInput, GetItemInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { PutItemInput, ScanInput, ScanOutput, ItemList } from "aws-sdk/clients/dynamodb"

export const dbConnection = new AWS.DynamoDB({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY",
  secretAccessKey: "DEFAULT_SECRET",
})

export async function insertDatabaseRecord(data) {
  const input: PutItemInput = {
    TableName: "coates-test-userTable-dev",
    Item: AWS.DynamoDB.Converter.marshall(data as PutItemInput),
  }

  return dbConnection.putItem(input).promise().catch((e) => {
    console.log(e)
  })
}

export async function fetchAllDatabaseRecords(): Promise<ItemList | void> {
  return dbConnection.scan({ TableName: "coates-test-userTable-dev" } as ScanInput).promise()
    .then((response: ScanOutput) => {
      return response.Items
    })
    .catch((e) => {
      console.log(e)
    })
}