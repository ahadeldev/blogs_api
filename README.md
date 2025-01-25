# Blog Application API

This is a backend API for a blog application built using Node.js, TypeScript, Prisma, and various best practices like Domain-Driven Design (DDD). The API handles user authentication, blog management, and comment functionalities with robust validation and security mechanisms.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **TypeScript**: Superset of JavaScript for type safety and better maintainability.
- **Prisma**: ORM for interacting with the database, handling migrations, and schema management.
- **Express**: Web framework for building RESTful APIs.
- **JWT (JSON Web Tokens)**: Authentication strategy for securely transmitting information between client and server.
- **Rate Limiting**: To prevent abuse and ensure fair usage of the API.
- **Postman**: API documentation for easy testing and interaction with the API.

---

## Features

- **Authentication**: Secure login and registration with JWT tokens.
- **User Management**: Users can view and update their profile, as well as delete or deactivate their account.
- **Blog Management**: Users can create, update, delete, and view blogs.
- **Commenting**: Users can create, update, delete, and view comments for blogs.
- **Pagination**: Implemented for blog listings and comment views to improve performance.
- **Validation**: All inputs are validated for security and data integrity.
- **Rate Limiting**: To prevent abuse by limiting the number of requests per user.

---

## Project Structure

```
node_modules
postman
    Blogs API.json
prisma
    migrations
    schema.prisma
src
    config
        cors.config.ts
        tokens.config.ts
    dtos
        authenticated.request.dto.ts
        blog.dto.ts
        blogs.pagination.dto.ts
        comment.dto.ts
        corsOptions.dto.ts
        dbRefreshToken.dto.ts
        deleteUserResponse.dto.ts
        loginUser.dto.ts
        logout.token.dto.ts
        registerUser.dto.ts
        updateBlog.dto.ts
        updateUser.dto.ts
        user.dto.ts
        user.profile.dto.ts
    middlewares
        app.error.handler.ts
        authenticate.ts
        check.refresh.token.ts
        global.rate.limiter.ts
        logger.ts
        route.not.found.ts
    services
        auth
            auth.controllers.ts
            auth.module.ts
            auth.repository.ts
            auth.services.ts
        blogs
            blogs.controllers.ts
            blogs.module.ts
            blogs.repository.ts
            blogs.services.ts
        comments
            comments.controllers.ts
            comments.module.ts
            comments.repository.ts
            comments.services.ts
        users
            users.controllers.ts
            users.module.ts
            users.repository.ts
            users.services.ts
    shared
        api.error.ts
        api.response.ts
        http.status.codes.ts
    types
        loginUser.type.ts
        logout.type.ts
        refreshToken.type.ts
    utils
        db.utils.ts
        password.utils.ts
        return.error.ts
        token.utils.ts
    server.ts
.env
.gitignore
nodemon.json
package-lock.json
package.json
tsconfig.json
```

---

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/register` - Register a new user (Public)
- **POST** `/api/v1/auth/login` - Login and generate JWT token (Public)
- **POST** `/api/v1/auth/refresh` - Refresh the access token (Private)
- **POST** `/api/v1/auth/logout` - Logout and invalidate the token (Private)

### Blogs

- **POST** `/api/v1/blogs/new` - Create a new blog (Private)
- **GET** `/api/v1/blogs/all?page=pageIdx` - List all blogs (Public)
- **GET** `/api/v1/blogs/my-blogs?page=pageIdx` - List current user's blogs (Private)
- **GET** `/api/v1/blogs/my-blogs/:id` - Get a specific blog by ID (Private)
- **PUT** `/api/v1/blogs/my-blogs/:id` - Update a blog by ID (Private)
- **DELETE** `/api/v1/blogs/my-blogs/:id` - Delete a blog by ID (Private)

### Comments

- **POST** `/api/v1/comments/add` - Create a new comment on a blog (Private)
- **GET** `/api/v1/comments/all` - List all comments for blogs (Public)
- **PUT** `/api/v1/comments/:id` - Update a comment by ID (Private)
- **DELETE** `/api/v1/comments/:id` - Delete a comment by ID (Private)

### Users

- **GET** `/api/v1/users/profile` - Get user profile details (Private)
- **PUT** `/api/v1/users/profile` - Update user profile details (Private)
- **DELETE** `/api/v1/users/profile/delete` - Delete user account (Private)
- **DELETE** `/api/v1/users/profile/deactivate` - Deactivate user account (Private)

---

## Setup and Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blog-api.git
   cd blog-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables in a `.env` file (refer to `.env.example` for required variables).

4. Run database migrations using Prisma:

   ```bash
   npx prisma migrate deploy
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

   The server will be running on `http://localhost:5000`.

---

## Usage

- You can test the API using the provided **Postman collection** (`postman/Blogs API.json`).
- Make sure to follow the authentication flow (register, login, then use the JWT for subsequent requests).
- Ensure your API requests contain the correct `Authorization` headers for private endpoints (e.g., `Authorization: Bearer <your_token>`).

---

## Environment Variables

You need to configure the following environment variables in the `.env` file:

```
DATABASE_URL=<DB_CONNECTION_STRING>
NODE_ENV=<NODE_ENVIRONMENTs>
PORT=<HOST_PORT>
FRONTEND_DOMAIN=<FRONTEND_APP_URL>
JWT_SECRET=<JWT_SECRET_STRING>
```

---