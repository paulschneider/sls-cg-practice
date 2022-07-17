import { messages } from "../src/errors/messages"
import { handle as createUser } from "../src/functions/users/create"
import { CreateUserEventData, ApiResponse } from "../src/schema"
import { DocumentClient } from "../__mocks__/aws-sdk/clients/dynamodb"
import { v4 as uuidv4 } from "../__mocks__/uuid"

const db = new DocumentClient()

const testParameters: CreateUserEventData = {
  name: "Paul Schneider",
  email: "email@example.com",
  dob: "1980-03-25",
}

describe("Create user handler", function () {

  describe("User created with a fully formed request object", function () {
    it("should return a successful response", async function () {
      const response = await createUser(testParameters) as ApiResponse
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual("User created!")

      expect(db.put).toHaveBeenCalledWith(
        expect.objectContaining({
          "TableName": "coates-test-userTable-dev",
          "Item": {
            name: testParameters.name,
            email: testParameters.email,
            dob: testParameters.dob,
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

})