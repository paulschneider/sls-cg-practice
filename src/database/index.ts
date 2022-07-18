import { DocumentClient, Converter, PutItemInput, GetItemInput, GetItemOutput, DeleteItemInput, DeleteItemOutput } from "aws-sdk/clients/dynamodb"
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
    TableName: process.env.USER_TABLE_NAME,
    Item: Converter.marshall(insertable),
  }

  return dynamoDb.put(input).promise()
}

export async function fetchDatabaseRecord(id: string): Promise<DatabaseUserRecord | void> {
  const input: GetItemInput = {
    TableName: process.env.USER_TABLE_NAME,
    Key: Converter.marshall({ id }),
    AttributesToGet: [
      "name", "email", "dob", "id",
    ],
  }

  return dynamoDb.get(input).promise()
    .then((response: GetItemOutput) => response as DatabaseUserRecord)
}

export async function deleteDatabaseRecord(id: string): Promise<DeleteItemOutput | void> {
  const input: DeleteItemInput = {
    TableName: process.env.USER_TABLE_NAME,
    Key: Converter.marshall({ id }),
  }

  return dynamoDb.delete(input).promise()
}

