import { DocumentClient, Converter, PutItemInput, GetItemInput, GetItemOutput, AttributeMap } from "aws-sdk/clients/dynamodb"
import { v4 as uuidv4 } from "uuid"
import { CreateUserEventData, DatabaseUserRecord } from "../schema/create-user"

const dynamoDb = new DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY",
  secretAccessKey: "DEFAULT_SECRET",
})

export async function insertDatabaseRecord(data: CreateUserEventData) {
  const insertable: DatabaseUserRecord = { id: uuidv4(), ...data }

  const input: PutItemInput = {
    TableName: "coates-test-userTable-dev",
    Item: Converter.marshall(insertable),
  }

  return dynamoDb.put(input).promise().catch((e) => {
    console.log(e)
  })
}

export async function fetchDatabaseRecord(email: string): Promise<AttributeMap | void> {
  const input: GetItemInput = {
    TableName: "coates-test-userTable-dev",
    Key: Converter.marshall({ email }),
  }

  return dynamoDb.get(input).promise()
    .then((response: GetItemOutput) => {
      return response.Item
    })
    .catch((e) => {
      console.log(e)
    })
}