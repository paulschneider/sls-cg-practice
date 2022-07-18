import { messages } from "../src/errors/messages"
import { handle as createUser } from "../src/functions/users/create"
import { CreateUserEventData, ApiResponse, HttpErrorResponse } from "../src/schema"
import { testParameters } from "./data/new-user"
import { DocumentClient, setDbQueryUserPutResponse } from "../__mocks__/aws-sdk/clients/dynamodb"
import { v4 as uuidv4 } from "../__mocks__/uuid"
import { variables, setEnvironment } from "./setup"

const db = new DocumentClient()

beforeAll(() => {
  setEnvironment()
})

describe("Make sure its all set up", function () {
  test("Database ENV set correctly", () => {
    expect(process.env.USER_TABLE_NAME).toEqual(variables.dbName)
  })
})

describe("Create user handler", function () {
  describe("User created with a fully formed request object", function () {
    it("should return a successful response", async function () {
      const response = await createUser(testParameters) as ApiResponse
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual("User created!")

      expect(db.put).toHaveBeenCalledWith(
        expect.objectContaining({
          "TableName": process.env.USER_TABLE_NAME,
          "Item": {
            ...testParameters,
            id: uuidv4() as string,
          },
        })
      )
    })
  })

  describe("User created called with no event data", function () {
    it("should return a failure response (missing event data)", async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await createUser(null) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.lambdaEvent.requiredAttributes)
    })
  })

  describe("User created called with missing event data [name]", function () {
    it("should return a failure response (missing event data)", async function () {
      const data = {
        "email": testParameters.email,
        "dob": testParameters.dob,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as CreateUserEventData

      const response = await createUser(data) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.createUser.attrs.name.required)
    })
  })

  describe("User created called with missing event data [email]", function () {
    it("should return a failure response (missing event data)", async function () {

      const data = {
        "name": testParameters.name,
        "dob": testParameters.dob,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as CreateUserEventData

      const response = await createUser(data) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.createUser.attrs.email.required)

    })
  })

  describe("User created called with missing event data [dob]", function () {
    it("should return a failure response (missing event data)", async function () {

      const data = {
        "name": testParameters.name,
        "email": testParameters.email,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as CreateUserEventData

      const response = await createUser(data) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.createUser.attrs.dob.required)
    })
  })

  describe("User created called with invalid event data [name, short]", function () {
    it("should return a failure response (invalid event data)", async function () {
      const data = {
        "name": "",
        "email": testParameters.email,
        "dob": testParameters.dob,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as CreateUserEventData

      const response = await createUser(data) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.createUser.attrs.name.minLength)
    })
  })

  describe("User created called with invalid event data [name, long]", function () {
    it("should return a failure response (invalid event data)", async function () {
      const data = {
        "name": "Guy With Areallylongnamethatwecantstore",
        "email": testParameters.email,
        "dob": testParameters.dob,
      }

      const response = await createUser(data) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.createUser.attrs.name.maxLength)
    })
  })

  describe("User created called with invalid event data [email, invalid]", function () {
    it("should return a failure response (invalid event data)", async function () {
      const data = {
        "name": testParameters.name,
        "email": "tim@apple",
        "dob": testParameters.dob,
      }

      const response = await createUser(data) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.createUser.attrs.email.invalid)
    })
  })

  describe("User created called with invalid event data [dob, bad format]", function () {
    it("should return a failure response (invalid event data)", async function () {
      const data = {
        "name": testParameters.name,
        "email": testParameters.email,
        "dob": "1980/03/25",
      }

      const response = await createUser(data) as ApiResponse

      expect(response.statusCode).toEqual(400)
      expect(response.body).toEqual(messages.createUser.attrs.dob.format)
    })
  })

  describe("POST Handles an error when the database is not available", function () {
    it("should return a service unavailable error", async function () {
      setDbQueryUserPutResponse(503)

      const response = await createUser(testParameters) as HttpErrorResponse

      expect(db.put).toHaveBeenCalledWith(
        expect.objectContaining({
          "TableName": process.env.USER_TABLE_NAME,
          "Item": {
            ...testParameters,
            id: uuidv4() as string,
          },
        })
      )

      expect(response.status).toEqual(503)
      expect(response.message).toEqual("Service unavailable")
    })
  })
})