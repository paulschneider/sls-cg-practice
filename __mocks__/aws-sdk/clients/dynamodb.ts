import { CreateUserEventData } from "../../../src/schema"

type allowedData = CreateUserEventData

export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true))

const getFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))
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
