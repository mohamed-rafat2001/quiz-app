# Quiz App 🧠

A full-stack quiz application built with the MERN stack (MongoDB, Express, React, Node.js). This application allows users to take quizzes, track their scores, and manage their profiles.

## 🚀 Features

### **User Authentication & Profile**

- **Secure Login & Sign Up**: JWT-based authentication.
- **Profile Management**: Users can update their personal details and profile pictures.
- **Password Security**: Hashed passwords using `bcryptjs` and password update functionality.

### **Quiz System**

- **Dynamic Quizzes**: Interactive quiz interface.
- **Instant Feedback**: View correct/incorrect answers after completion.
- **Score Tracking**: Keep track of user performance and history.

### **Security Features**

- **Rate Limiting**: Protects the server from brute-force attacks.
- **Data Sanitization**: Prevents NoSQL injection and XSS attacks.
- **Secure Headers**: Using `helmet` for enhanced security.
- **CORS Enabled**: Configured for secure cross-origin requests.

## 🛠️ Tech Stack

### **Frontend**

- **React**: UI library.
- **Redux Toolkit**: State management.
- **React Query**: For efficient data fetching and caching.
- **React Router**: Navigation.
- **Bootstrap**: Responsive design and styling.
- **Vite**: Fast development build tool.

### **Backend**

- **Node.js & Express**: Server-side framework.
- **MongoDB & Mongoose**: Database and ODM.
- **JWT**: Secure authentication.
- **Cloudinary**: Image storage and management.
- **Nodemailer**: For sending emails.
- **Multer**: Handling file uploads.

## 📂 Project Structure

```
quiz-app/
├── client/          # Frontend React application
│   ├── src/
│   │   ├── api/     # API configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── services/# React Query services
│   │   └── ui/      # Layout and styling
├── server/          # Backend Node.js application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database schemas
│   │   ├── routers/     # API endpoints
│   │   └── utils/       # Helper functions
```

## ⚙️ Setup & Installation

### **Prerequisites**

- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)

### **1. Clone the repository**

```bash
git clone https://github.com/mohamed-rafat2001/quiz-app.git
cd quiz-app
```

### **2. Backend Setup**

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory and add your credentials:
   ```env
   PORT=3000
   DATABASE_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_key
   CLOUD_API_SECRET=your_cloudinary_secret
   MAILER_USER=your_email
   MAILER_PASS=your_email_password
   ```
4. Start the server:
   ```bash
   npm start
   ```

### **3. Frontend Setup**

1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## 📝 License

This project is licensed under the ISC License.
