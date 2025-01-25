import { client } from "../../utils/db.utils";
import User from "../../dtos/user.dto";
import DbRefreshToken from "../../dtos/dbRefreshToken.dto";
import LogoutToken from "../../dtos/logout.token.dto";

class AuthRepository {

  // register user
  async createUser(userData: {name: string, email: string, username: string, password: string}): Promise<User>{
    const newUser = await client.user.create({
      data: userData
    });
    return newUser;
  }

  // check if user exists via email or username
  async findUserByEmailOrUsername(email: string, username: string){
    const userExists = await client.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
        AND: [
          { is_active: true },
        ]
      },
    });
    return userExists;
  }

  // find user by id
  async getUserById(userId: string): Promise<User | null>{
    const user = await client.user.findUnique({where: {user_id: userId}});
    return user;
  }

  // save the user refresh token in the database
  async saveRefreshToken(token: string, expiresIn: number, userId: string): Promise<DbRefreshToken> {
    // convert expiration time to a Date object
    const expirationDate = new Date(Date.now() + expiresIn);

    // delete all revoked tokens for the user
    await client.refreshToken.deleteMany({
      where: {
        user_id: userId,
        revoked: true
      }
    });

    // check if the user already has an active (non-revoked) token
    const existingToken = await client.refreshToken.findFirst({
      where: {
        user_id: userId,
        revoked: false
      }
    });

    // return existing token if it is valid
    if (existingToken) {
      return existingToken;
    }

    // create a new token if no valid token exists
    const savedToken = await client.refreshToken.create({
      data: {
        token,
        user_id: userId,
        expires_in: expirationDate
      }
    });
    return savedToken;
  }

  // get refresh token from database
  async findRefreshToken(refreshToken: string): Promise<DbRefreshToken | null>{
    const tokenFound = await client.refreshToken.findFirst({
      where: { token: refreshToken }
    })
    return tokenFound;
  }

  // user logout, revoke the refresh token
  async revokeRefreshToken(userId: string): Promise<DbRefreshToken>{
    const refreshTokenRevoked = await client.refreshToken.update({
      where: { user_id: userId },
      data: { revoked: true }
    })
    return refreshTokenRevoked;
  }

  // user logout, blacklist the access token
  async blacklistAccessToken(tokenBody: string): Promise<LogoutToken>{
    const blacklistedToken = await client.logoutToken.create({
      data: {token: tokenBody}
    });
    return blacklistedToken;
  }
}

export default AuthRepository;