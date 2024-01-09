# Instagram Backend

Welcome to the Instagram Backend!

## Prerequisites

- Node.js installed
- MongoDB or any other database system

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajmendra/instagram-backend.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd instagram-backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root of your project with the following content:
   ```env
   PORT=3001
   MONGO_URL=your_mongodb_connection_string
   SECRET_KEY=your_secret_key_for_jwt
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. The backend will be running at `http://localhost:3001` by default.


# API Documentation

## Auth Routes

### Register a New User

- **Endpoint:** `POST /auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  - Example:
    ```json
    {
      "username": "example_user",
      "password": "example_password",
      "email": "user@example.com"
    }
    ```
- **Response:**
  - Status: 201 Created
  - Example:
    ```json
    {
      "message": "User registered successfully"
    }
    ```

### Login

- **Endpoint:** `POST /auth/login`
- **Description:** Logs in an existing user.
- **Request Body:**
  - Example:
    ```json
    {
      "username": "example_user",
      "password": "example_password"
    }
    ```
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    {
      "token": "example_token",
      "userId": "example_user_id"
    }
    ```

### Edit Profile

- **Endpoint:** `PUT /auth/edit-profile`
- **Description:** Edits the user's profile.
- **Request Body:**
  - Example:
    ```json
    {
      "fullName": "New Full Name",
      "bio": "New bio information"
    }
    ```
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    {
      "message": "Profile updated successfully"
    }
    ```

### Upload Profile Picture

- **Endpoint:** `POST /auth/upload-profile-picture`
- **Description:** Uploads a new profile picture.
- **Request Body:** Form data with a single file named "profilePicture".
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    {
      "message": "Profile picture uploaded successfully"
    }
    ```

## User Routes

### Get User Profile

- **Endpoint:** `GET /user/profile/:userId`
- **Description:** Retrieves the profile of a specific user.
- **Parameters:**
  - `userId`: The ID of the user.
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    {
      "username": "example_user",
      "fullName": "Example User",
      "bio": "This is an example bio",
      "profilePicture": "example_profile_picture_url"
    }
    ```

### Update User

- **Endpoint:** `PUT /user/profile/:userId`
- **Description:** Updates the profile of a specific user.
- **Parameters:**
  - `userId`: The ID of the user.
- **Request Body:**
  - Example:
    ```json
    {
      "fullName": "Updated Full Name",
      "bio": "Updated bio information"
    }
    ```
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    {
      "message": "User profile updated successfully"
    }
    ```

## Status Routes

### Get User Statuses

- **Endpoint:** `GET /status/`
- **Description:** Retrieves statuses of the authenticated user.
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    [
      {
        "statusId": "example_status_id",
        "content": "This is an example status",
        "createdAt": "2022-01-01T12:34:56.789Z",
        "likesCount": 5,
        "commentsCount": 3,
        "user": {
          "userId": "example_user_id",
          "username": "example_user",
          "fullName": "Example User",
          "profilePicture": "example_profile_picture_url"
        }
      },
      // ... more statuses
    ]
    ```

### Post New Status

- **Endpoint:** `POST /status/:userId`
- **Description:** Posts a new status for a specific user.
- **Parameters:**
  - `userId`: The ID of the user.
- **Request Body:**
  - Form data with a single file named "file" for attachments (image, video, etc.).
- **Response:**
  - Status: 201 Created
  - Example:
    ```json
    {
      "message": "Status posted successfully",
      "statusId": "newly_created_status_id"
    }
    ```

### Get Viewable Statuses

- **Endpoint:** `GET /status/viewable`
- **Description:** Retrieves statuses visible to the authenticated user based on their followers.
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    [
      {
        "statusId": "example_status_id",
        "content": "This is a viewable status",
        "createdAt": "2022-01-02T10:20:30.456Z",
        "likesCount": 2,
        "commentsCount": 1,
        "user": {
          "userId": "another_user_id",
          "username": "another_user",
          "fullName": "Another User",
          "profilePicture": "another_user_profile_picture_url"
        }
      },
      // ... more statuses
    ]
    ```

### Like a Status

- **Endpoint:** `POST /status/:userId/like/:statusId`
- **Description:** Likes a specific status.
- **Parameters:**
  - `userId`: The ID of the user performing the like.
  - `statusId`: The ID of the status to be liked.
- **Response:**
  - Status: 200 OK
  - Example:
    ```json
    {
      "message": "Status liked successfully"
    }
    ```

### Comment on a Status

- **Endpoint:** `POST /status/:userId/comment/:statusId`
- **Description:** Adds a comment to a specific status.
- **Parameters:**
  - `userId`: The ID of the user making the comment.
  - `statusId`: The ID of the status to be commented on.
- **Request Body:**
  - Example:
    ```json
    {
      "text": "This is a comment on the status."
    }
    ```
- **Response:**
  - Status: 201 Created
  - Example:
    ```json
    {
      "message": "Comment added successfully",
      "commentId": "newly_created_comment_id"
    }
    ```

- **

## Contributing

Explain how others can contribute to your backend project.

## License

This project is licensed under the [MIT License](LICENSE).
```

Make sure to replace placeholder texts such as `rajmendra`, `instagram-backend`, etc., with the actual details of your repositories and application. Provide specific details about the project structure, API documentation, how others can contribute, and any additional information you think is relevant to your backend project.
