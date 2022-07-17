export interface CreateUserEventData {
  name: string
  email: string
  dob: string
}

export interface DatabaseUserRecord extends CreateUserEventData {
  id: string
}