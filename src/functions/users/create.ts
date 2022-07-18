"use strict"

import { schema as userCreateSchema, CreateUserValidationError } from "../../validators/create-user"
import { schema as lambdaEventSchema, LambdaEventValidationError } from "../../validators/lambda-event"
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { CreateUserEventData } from "../../schema"
import { insertDatabaseRecord } from "../../database"
import createError from "http-errors"

const handle = async function (event: CreateUserEventData): Promise<APIGatewayProxyResultV2> {
  try {
    const { error: eventError }: { error: LambdaEventValidationError } = lambdaEventSchema.validate(event)

    if (eventError) {
      return {
        statusCode: 400,
        body: eventError.details[0].message,
      }
    }

    const { error: createError }: { error: CreateUserValidationError } = userCreateSchema.validate(event)

    if (createError) {
      return {
        statusCode: 400,
        body: createError.details[0].message,
      }
    }

    await insertDatabaseRecord(event)

    return {
      statusCode: 200,
      body: "User created!",
    }
  } catch (e: unknown) {
    return createError(503, (e as Error).message)
  }
}

/* istanbul ignore next : We'd only be testing APIG at this point */
const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  return handle(JSON.parse(event.body) as unknown as CreateUserEventData)
}

export { handle, handler }
