"use strict"

import { schema as userCreateSchema, CreateUserValidationError } from "../../validators/create-user"
import { schema as lambdaEventSchema, LambdaEventValidationError } from "../../validators/lambda-event"
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from "aws-lambda"

import { insertDatabaseRecord } from "../../database"

export const handle: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
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
}
