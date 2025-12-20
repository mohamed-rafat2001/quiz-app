# Quiz App - Backend ⚙️

The backend of the Quiz App is a robust Node.js/Express application that provides a RESTful API for user management, quiz handling, and score tracking.

## 🚀 Features

- **RESTful API**: Clean and organized API endpoints.
- **Security**: 
  - Password hashing with `bcryptjs`.
  - JWT for secure authentication.
  - Protection against NoSQL injection (`express-mongo-sanitize`).
  - XSS protection (`xss-clean`).
  - Rate limiting for API protection.
  - HTTP headers security with `helmet`.
- **File Uploads**: Image handling via `multer` and `cloudinary`.
- **Email Service**: Integration with `nodemailer` for transactional emails.
- **Error Handling**: Centralized error management system.

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime.
- **Express**: Web framework for Node.js.
- **MongoDB & Mongoose**: NoSQL database and object modeling.
- **Cloudinary**: Cloud-based image management.
- **Nodemailer**: Module for sending emails.
- **Multer**: Middleware for handling `multipart/form-data`.

## 📂 Folder Structure

- `src/controllers/`: Logic for handling API requests.
- `src/db/`: Database connection configuration.
- `src/middelwars/`: Custom middlewares for authentication and error handling.
- `src/models/`: Mongoose schemas for Users, Quizzes, and Answers.
- `src/routers/`: Express routes for different modules.
- `src/utils/`: Helper utilities (Email, Cloudinary, Error handling).
- `index.js`: Application entry point.

## ⚙️ Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the following keys:
   ```env
   PORT=3000
   DATABASE_URL=
   JWT_SECRET=
   JWT_EXPIRES_IN=
   CLOUD_NAME=
   CLOUD_API_KEY=
   CLOUD_API_SECRET=
   MAILER_USER=
   MAILER_PASS=
   MAILER_PORT=
   ```
3. Start the server:
   ```bash
   npm start
   ```

## 📝 Scripts

- `npm start`: Starts the server using `nodemon`.
- `npm run debug`: Starts the server in debug mode using `ndb`.
