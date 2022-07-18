import { handle as deleteUser } from "../src/functions/users/delete"
import { HttpErrorResponse, ApiResponse } from "../src/schema"
import { variables, setEnvironment } from "./setup"
import { DocumentClient, setDbQueryUserGetResponse, setDynamoDbFailureResponse } from "../__mocks__/aws-sdk/clients/dynamodb"

const db = new DocumentClient()

beforeAll(() => {
  setEnvironment()
})

describe("Make sure its all set up", function () {
  test("Database ENV set correctly", () => {
    expect(process.env.USER_TABLE_NAME).toEqual(variables.dbName)
  })
})

describe("Delete user handler", function () {
  describe("Returns a 200 when a user is successfully deleted", function () {
    it("should return a successful response", async function () {
      setDbQueryUserGetResponse(200)

      const response = await deleteUser(variables.userId) as ApiResponse

      expect(db.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          "TableName": process.env.USER_TABLE_NAME,
          "Key": { id: variables.userId },
        })
      )

      expect(response.statusCode).toEqual(202)
      expect(response.body).toEqual("User deleted!")
    })
  })

  describe("Returns a 404 when a userId for an unknown user is provided", function () {
    it("should return a user not found response", async function () {
      setDbQueryUserGetResponse(404)

      const response = await deleteUser("rando-string-not-found") as ApiResponse

      expect(db.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          "TableName": process.env.USER_TABLE_NAME,
          "Key": { id: variables.userId },
        })
      )

      expect(response.statusCode).toEqual(404)
      expect(response.body).toEqual("No user found")
    })
  })

  describe("DELETE Handles an error when the database is not available", function () {
    it("should return a service unavailable error", async function () {
      setDbQueryUserGetResponse(200)
      setDynamoDbFailureResponse("delete", 503)

      const response = await deleteUser(variables.userId) as HttpErrorResponse

      expect(db.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          "TableName": process.env.USER_TABLE_NAME,
          "Key": { id: variables.userId },
        })
      )

      expect(response.status).toEqual(503)
      expect(response.message).toEqual("Service unavailable")
    })
  })
})