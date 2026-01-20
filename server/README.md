# Quiz App - Backend ⚙️

The backend of the Quiz App is a robust Node.js/Express application providing a RESTful API with Role-Based Access Control (RBAC), secure authentication, and comprehensive quiz management.

## 🚀 Features

- **RBAC (Role-Based Access Control)**: Custom middleware to manage permissions for Admin, Teacher, and Student roles.
- **Secure Authentication**: JWT-based auth with secure cookies, password hashing (bcryptjs), and password reset flows.
- **Quiz Management**: Full CRUD operations for quizzes, questions, and answers with ownership checks.
- **Advanced API Features**: Filtering, sorting, pagination, and field limiting using a reusable `APIFeatures` class.
- **Security Suite**:
  - Rate limiting to prevent DOS/Brute-force.
  - Helmet for secure HTTP headers.
  - Mongo-sanitize and XSS-clean for data sanitization.
  - CORS configuration for frontend integration.
- **File Management**: Integrated with Cloudinary for profile picture uploads via Multer.
- **Global Error Handling**: Centralized error management with operational vs. programming error distinction.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment.
- **Express**: Web framework.
- **MongoDB & Mongoose**: Database and ODM.
- **Cloudinary**: Cloud image storage.
- **Nodemailer**: Email delivery.
- **Express Validator**: Request validation.
- **Bcryptjs**: Password security.
- **JSON Web Token**: Session management.

## 📂 Folder Structure

- `src/controllers/`: Route handlers and business logic.
- `src/models/`: Mongoose schemas (User, Quiz, QuizQuestion, QuizResult, QuestionAnswer).
- `src/routers/`: API route definitions.
- `src/middelwars/`: Authentication, RBAC, and error handling middlewares.
- `src/utils/`: Helpers including validators, email service, and Cloudinary config.

## ⚙️ Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the following keys:
   ```env
   PORT=8080
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=90d
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_key
   CLOUD_API_SECRET=your_cloudinary_secret
   MAILER_USER=your_smtp_user
   MAILER_PASS=your_smtp_password
   ```
3. Start the server:
   ```bash
   npm start
   ```

## 📝 Scripts

- `npm start`: Starts the server using `nodemon`.
- `npm run debug`: Starts the server in debug mode.
