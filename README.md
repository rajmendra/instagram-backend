Certainly! Here's the updated README with a placeholder for Swagger documentation:

````markdown
# Instagram Backend API

## Overview

The Instagram Backend API is a comprehensive backend solution for a social media application. It provides endpoints for user management, status posting, likes, comments, and more.

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
2. [API Documentation](#api-documentation)
   - [Swagger Documentation](#swagger-documentation)
   - [User Operations](#user-operations)
   - [Status Operations](#status-operations)
   - [Follow Operations](#follow-operations)
   - [Like and Comment Operations](#like-and-comment-operations)
3. [Usage](#usage)
   - [Authentication](#authentication)
   - [Endpoints](#endpoints)
4. [Contributing](#contributing)
5. [License](#license)

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   ```
````

2. Install dependencies:

   ```bash
   cd instagram-backend
   npm install
   ```

3. Set up your MongoDB connection in `.env` file.

   ```env
   MONGODB_URI=[your-mongodb-uri]
   ```

   Replace `[your-mongodb-uri]` and `[your-jwt-secret]` with your MongoDB connection string and a secret key for JWT.

4. Start the server:

   ```bash
   npm start
   ```

## API Documentation

### Swagger Documentation

Explore the API using Swagger: [Swagger Documentation](#swagger-url-here)

### User Operations

- [Register a User](#register-a-user)
- [Login](#login)
- [Update User Profile](#update-user-profile)
- [Upload Profile Picture](#upload-profile-picture)

### Status Operations

- [Post a Status](#post-a-status)
- [Get Statuses](#get-statuses)
- [Like a Status](#like-a-status)
- [Comment on a Status](#comment-on-a-status)

### Follow Operations

- [Follow a User](#follow-a-user)
- [Get Following List](#get-following-list)

### Like and Comment Operations

- [Get User Likes](#get-user-likes)
- [Comment on a Status](#comment-on-a-status)

## Usage

### Authentication

Most API endpoints require authentication using a JWT token. Include the token in the `auth-token` header.

### Endpoints

See [API Documentation](#api-documentation) for detailed information on each endpoint.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the [MIT License](LICENSE).

```

Replace `[swagger-url-here]` with the actual URL where your Swagger documentation is hosted.
```
