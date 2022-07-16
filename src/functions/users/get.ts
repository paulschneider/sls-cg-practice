"use strict"

import { schema as lambdaEventSchema, LambdaEventValidationError } from "../../validators/lambda-event"
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from "aws-lambda"

export const handle: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
  const { error: eventError }: { error: LambdaEventValidationError } = lambdaEventSchema.validate(event)

  if (eventError) {
    return {
      statusCode: 400,
      body: eventError.details[0].message,
    }
  }

  return Promise.resolve({
    statusCode: 200,
    body: "User located!",
  })
}
