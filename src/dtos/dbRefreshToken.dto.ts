
interface DbRefreshToken {
  token_id: string;
  token: string;
  user_id: string;
  revoked: boolean;
  expires_in: Date;
  created_at: Date;
}

export default DbRefreshToken;