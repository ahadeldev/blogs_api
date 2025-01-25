import AuthControllers from "./auth.controllers";
import AuthServices from "./auth.services";
import AuthRepository from "./auth.repository";
import { Router } from "express";
import checkRefreshToken from "../../middlewares/check.refresh.token";
import authenticate from "../../middlewares/authenticate";


class AuthModule {
  public router: Router;

  constructor(){
    // initialize dependencies
    const authRepository = new AuthRepository();
    const authServices = new AuthServices(authRepository);
    const authControllers = new AuthControllers(authServices);

    // initialize routes
    this.router = Router();

    // register new user route
    this.router.post("/register", authControllers.registerUserController.bind(authControllers));

    // login user route
    this.router.post("/login", authControllers.loginUserController.bind(authControllers));

    // refresh access token route
    this.router.post("/refresh", checkRefreshToken, authControllers.refreshAccessTokenController.bind(authControllers));

    // logout user route
    this.router.post("/logout", authenticate, authControllers.logoutUserController.bind(authControllers));
  }
}

export default AuthModule;