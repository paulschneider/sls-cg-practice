import { CreateUserEventData } from "../../../src/schema"
import { testParameters } from "../../../tests/data/new-user"
import { v4 as uuidv4 } from "../../uuid"

type allowedData = CreateUserEventData | null
let getCreatedUserMockResponse: jest.Mock

const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true))

export function setDbQueryCreatedUserGetResponse(code: 200 | 404) {
  switch (code) {
    case 200:
      getCreatedUserMockResponse = jest.fn().mockReturnValue(Promise.resolve({
        id: uuidv4() as string,
        ...testParameters,
      }))
      break
    case 404:
      getCreatedUserMockResponse = jest.fn().mockReturnValue(Promise.resolve(null))
      break
  }
}

const getFn = jest.fn().mockImplementation(() => ({ promise: getCreatedUserMockResponse }))
const putFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))
const scanFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))
const marshallFn = jest.fn().mockImplementation((data: allowedData) => ({ ...data }))

export class DocumentClient {
  get = getFn
  put = putFn
  scan = scanFn
}

export const Converter = {
  marshall: marshallFn,
}
