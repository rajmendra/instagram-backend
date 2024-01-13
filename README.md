# Instagram Clone - Node.js Application 📸

## Overview

The Instagram Clone is a social media platform that mimics the basic functionality of Instagram. Users can post statuses, like each other's statuses, make comments, follow/unfollow other users, and update their profiles. The application is built using Node.js and follows a modular project structure for better organization.

## Project Structure 🏗️

```plaintext
app/
    script/                 # database script to load initial data
    src/                    # Source code
        config/             # Configuration files
        controllers/        # Controller logic for handling requests
        middlewares/        # Middleware functions for route handling
        models/             # Data models
        routes/             # Route definitions
        utils/              # Utility functions
        app.js              # Main application entry point
    tests/                  # Test files
    index.js                # Application entry point
```

## Getting Started 🚀

To start the Node.js application, follow these steps:

1. Clone the repository to your local machine.

```bash
git clone https://github.com/rajmendra/instagram-backend.git
```

2. Navigate to the project directory.

```bash
cd instagram-backend
```

3. Install dependencies.

```bash
npm install
```

4. Run the application.

```bash
npm start
```

The application should now be running on [http://localhost:3001](http://localhost:3001).

## Swagger API Documentation 📖

For detailed API documentation, please refer to the [Swagger API Docs](https://insta-backend-8xel.onrender.com/api-docs/). 🌐

## Authentication 🔐

The application uses authenticated routes for user registration and login. Users need to register and log in to access the features like posting statuses, liking, commenting, and following/unfollowing.

## Routes 🛣️

- **Register:** `/api/register` - Allows users to create an account.
- **Login:** `/api/login` - Allows users to log in.
- **Get All Statuses:** `/api/statuses` - Retrieves all posted statuses.
- **Like/Unlike Status:** `/api/statuses/:statusId/like` - Allows users to like/unlike a status.
- **Follow/Unfollow User:** `/api/users/:userId/follow` - Allows users to follow/unfollow another user.
- **Comment on Status:** `/api/statuses/:statusId/comment` - Allows users to comment on a status.
- **Edit Profile:** `/api/users/edit` - Allows users to edit their profile information.
- **Update Profile Image:** `/api/users/update-image` - Allows users to update their profile image.

## Note 📝

- Users can only like and comment on statuses of users they are following, fostering a personalized and interconnected experience. This feature ensures that interactions are more meaningful, creating a social environment where users engage with content from those they have chosen to connect with. It promotes a sense of community by focusing on the relationships between users, making each like and comment more significant within the context of the user's social network. 🌐💬

Feel free to explore the application and enjoy the Instagram-like experience! 🌟
