import { v4 as uuidv4 } from "../__mocks__/uuid"

export const variables = {
  dbName: "coates-test-userTable-dev",
  userId: uuidv4() as string,
}

export function setEnvironment() {
  process.env.USER_TABLE_NAME = variables.dbName
}
