import UsersRepository from "./users.repository";
import UsersServices from "./users.services";
import UsersControllers from "./users.controllers";
import { Router } from "express";
import authenticate from "../../middlewares/authenticate";

class UsersModule {
  public router: Router;

 constructor(){

   // initialize users dependencies
   const usersRepository = new UsersRepository();
   const usersServices = new UsersServices(usersRepository);
   const usersControllers  = new UsersControllers(usersServices);

   // initialize routes
   this.router = Router();

   // user profile route
   this.router.get("/profile", authenticate, usersControllers.getUserProfileController.bind(usersControllers));

  // update user profile route
  this.router.put("/profile", authenticate, usersControllers.updateUserProfileController.bind(usersControllers));

  // delete user account route
  this.router.delete("/profile/delete", authenticate, usersControllers.deleteUserAccountController.bind(usersControllers));

  // deactivate user account route
  this.router.put("/profile/deactivate", authenticate,usersControllers.deactivateUserAccountController.bind(usersControllers));
 }
}

export default UsersModule;