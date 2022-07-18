export const variables = {
  dbName: "coates-test-userTable-dev",
}

export function setEnvironment() {
  process.env.USER_TABLE_NAME = variables.dbName
}
