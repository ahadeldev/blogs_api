interface User {
  user_id?: string
  name: string
  email: string
  username: string
  password: string
  role?: string
  created_at?: Date
  updated_at?: Date
}
export default User;