"use strict"

import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { fetchDatabaseRecord, deleteDatabaseRecord } from "../../database"
import createError from "http-errors"

const handle = async function (id: string): Promise<APIGatewayProxyResultV2> {
  const user = await fetchDatabaseRecord(id)

  if (!user) {
    return {
      statusCode: 404,
      body: "No user found",
    }
  }

  try {
    await deleteDatabaseRecord(id)

    return {
      statusCode: 202, // accepted
      body: "User deleted!",
    }
  } catch (e: unknown) {
    return createError(503, (e as Error).message)
  }
}

/* istanbul ignore next : We'd only be testing APIG at this point */
const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  return handle(event.pathParameters.id)
}

export { handle, handler }
