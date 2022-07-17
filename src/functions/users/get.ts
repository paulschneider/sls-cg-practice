"use strict"

import { schema as lambdaEventSchema, LambdaEventValidationError } from "../../validators/lambda-event"
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { fetchDatabaseRecord } from "../../database"

const handle = async function (email: string): Promise<APIGatewayProxyResultV2> {

  const user = await fetchDatabaseRecord(email)

  if (!user) {
    return {
      statusCode: 404,
      body: "No user found",
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "User fetched!",
      data: user,
    }),
  }
}

const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  return handle(event.pathParameters.email)
}

export { handle, handler }
