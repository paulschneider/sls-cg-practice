import AWS from "aws-sdk"
import { CreateUserEventData } from "../../../src/schema"
import { testParameters } from "../../../tests/data/new-user"
import { v4 as uuidv4 } from "../../uuid"
import createError from "http-errors"

type allowedData = CreateUserEventData | null
const defaultPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true))
const serviceUnavailableResponse = jest.fn().mockRejectedValue(new Error("Service unavailable"))

let getUserMockResponse: jest.Mock = defaultPromiseResponse
let deleteUserMockResponse: jest.Mock = defaultPromiseResponse
let putUserMockResponse: jest.Mock = defaultPromiseResponse
interface MockResponses {
  [key: string]: {
    [key: string]: jest.Mock
  }
}

const responses: MockResponses = {
  get: {
    ok: jest.fn().mockReturnValue(Promise.resolve({ id: uuidv4() as string, ...testParameters })),
    notFound: jest.fn().mockReturnValue(Promise.resolve(null)),
    serviceUnavailable: serviceUnavailableResponse,
  },
  put: {
    ok: defaultPromiseResponse,
    serviceUnavailable: serviceUnavailableResponse,
  },
  delete: {
    ok: defaultPromiseResponse,
    serviceUnavailable: serviceUnavailableResponse,
  },
}

export function setDbQueryUserPutResponse(code: 200 | 503) {
  switch (code) {
    case 200:
      putUserMockResponse = responses.put.ok
      break
    case 503:
      putUserMockResponse = responses.put.serviceUnavailable
      break
  }
}

export function setDbQueryUserGetResponse(code: 200 | 404 | 503) {
  switch (code) {
    case 200:
      getUserMockResponse = responses.get.ok
      break
    case 404:
      getUserMockResponse = responses.get.notFound
      break
    case 503:
      getUserMockResponse = responses.get.serviceUnavailable
      break
  }
}

export function setDynamoDbFailureResponse(method: string, code: 200 | 503) {
  switch (code) {
    case 200:
      deleteUserMockResponse = (responses[method]).ok
      break
    case 503:
      deleteUserMockResponse = responses[method].serviceUnavailable
      break
  }
}

const getFn = jest.fn().mockImplementation(() => ({ promise: getUserMockResponse }))
const putFn = jest.fn().mockImplementation(() => ({ promise: putUserMockResponse }))
const scanFn = jest.fn().mockImplementation(() => ({ promise: defaultPromiseResponse }))
const deleteFn = jest.fn().mockImplementation(() => ({ promise: deleteUserMockResponse }))
const marshallFn = jest.fn().mockImplementation((data: allowedData) => ({ ...data }))

export class DocumentClient {
  get = getFn
  put = putFn
  scan = scanFn
  delete = deleteFn
}

export const Converter = {
  marshall: marshallFn,
}
