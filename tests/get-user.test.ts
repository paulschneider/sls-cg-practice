import { handle as getUser } from "../src/functions/users/get"
import { ApiResponse, HttpErrorResponse } from "../src/schema"
import { variables, setEnvironment } from "./setup"
import { testParameters } from "./data/new-user"
import { v4 as uuidv4 } from "../__mocks__/uuid"
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

describe("Fetch user handler", function () {
  describe("Returns a 200 when a user is successfully found", function () {
    it("should return a successful response", async function () {
      setDbQueryUserGetResponse(200)

      const response = await getUser(uuidv4() as string) as ApiResponse

      expect(response.statusCode).toEqual(200)
      expect.objectContaining({
        message: "User fetched!",
        data: {
          ...testParameters,
          id: uuidv4() as string,
        },
      })
    })
  })

  describe("Returns a 404 when a user cannot be found", function () {
    it("should return a failure response", async function () {
      setDbQueryUserGetResponse(404)
      const response = await getUser("rando-string-not-found") as ApiResponse

      expect(response.statusCode).toEqual(404)
      expect(response.body).toEqual("No user found")
    })
  })

  describe("GET Handles an error when the database is not available", function () {
    it("should return a service unavailable error", async function () {
      setDbQueryUserGetResponse(503)

      const response = await getUser(variables.userId) as HttpErrorResponse

      expect(db.get).toHaveBeenCalledWith(
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