import { messages } from "../src/errors/messages"
import { handle as getUser } from "../src/functions/users/get"
import { CreateUserEventData, ApiResponse } from "../src/schema"
import { DocumentClient } from "../__mocks__/aws-sdk/clients/dynamodb"

const db = new DocumentClient()

describe("Fetch user handler", function () {
  describe("Returns a 404 when a user cannot be found", function () {
    it.only("should return a successful response", async function () {
      const response = await getUser("email@example.com") as ApiResponse

      expect(response.statusCode).toEqual(404)
      expect(response.body).toEqual("No user found")
    })
  })

  // describe("A user can be fetched [GET] by user ID", function () {
  //   it("should return a successful response", async function () {
  //     const response = await getUser(12345) as ApiResponse
  //   })
  // })
})