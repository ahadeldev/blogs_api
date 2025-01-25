import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthModule from "./services/auth/auth.module";
import UsersModule from "./services/users/users.module";
import BlogsModule from "./services/blogs/blogs.module";
import CommentsModule from "./services/comments/comments.module";

import { testDatabaseConnection } from "./utils/db.utils";
import logger from "./middlewares/logger";
import routeNotFound from "./middlewares/route.not.found";
import appErrorhandler from "./middlewares/app.error.handler";
import globalRateLimiter from "./middlewares/global.rate.limiter";
import corsConfig from "./config/cors.config";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

const bootstrap = async () => {

  await testDatabaseConnection(); // test database connection.
  const authModule = new AuthModule(); // instantiate the auth routes.
  const usersRoutes = new UsersModule(); // instantiate the users routes.
  const blogsRoutes = new BlogsModule(); // instantiate the blogs routes.
  const commentsRoutes = new CommentsModule(); // instantiate the comments routes.

  app.use(express.json()); // parse json data.
  app.use(express.urlencoded({extended: true})); // parse url encoded data.
  app.use(cookieParser()); // // cookie parsing middleware.
  app.use(logger); // custom logging middleware.
  app.use(globalRateLimiter); // global rate limiting middleware.
  app.use(cors(corsConfig)); // cross-origin resourse sharing middleware. 

  app.use("/api/v1/auth", authModule.router); // authentication routes.
  app.use("/api/v1/users", usersRoutes.router); // users routes.
  app.use("/api/v1/blogs", blogsRoutes.router); // blogs routes.
  app.use("/api/v1/comments", commentsRoutes.router); // blogs routes.

  app.use(routeNotFound); // routes not found handling middleware.
  app.use(appErrorhandler); // global error handling middleware.

  app.listen(PORT, () => {
    console.log(`==> Server running on port: ${PORT}`);
  })
}

bootstrap();