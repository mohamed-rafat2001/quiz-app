# Quiz App 🧠

A full-stack quiz application built with the MERN stack (MongoDB, Express, React, Node.js). This application features Role-Based Access Control (RBAC), allowing Admins to manage the system, Teachers to create and monitor quizzes, and Students to take quizzes and track their progress.

## 🚀 Features

### **Role-Based Access Control (RBAC)**
- **Admin**: Full access to all quizzes, users, and system-wide statistics.
- **Teacher**: Create, edit, and delete their own quizzes. View detailed statistics and leaderboards for their quizzes.
- **Student**: Browse available quizzes, take quizzes, view their own answers, and track their performance.

### **User Authentication & Profile**
- **Secure Login & Sign Up**: JWT-based authentication with secure cookie storage.
- **Profile Management**: Users can update their personal details, change passwords, and upload profile pictures.
- **Password Recovery**: Forgot/Reset password functionality via email.

### **Quiz System**
- **Dynamic Quiz Creation**: Teachers can create quizzes with multiple-choice questions.
- **Interactive Taking**: Students can take quizzes with real-time feedback and progress tracking.
- **Leaderboards**: View top performers for each quiz.
- **Statistics**: Detailed dashboards for students (personal progress) and teachers (quiz performance).

### **Security Features**
- **Rate Limiting**: Protects against brute-force attacks.
- **Data Sanitization**: Prevents NoSQL injection and XSS attacks.
- **Secure Headers**: Enhanced security using `helmet`.
- **Protected Routes**: Both client-side and server-side route protection based on user roles.

## 🛠️ Tech Stack

### **Frontend**
- **React (Vite)**: Modern UI development.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Framer Motion**: Smooth animations and transitions.
- **TanStack React Query**: Efficient data fetching, caching, and state management.
- **React Router**: Client-side navigation and route protection.
- **React Icons**: Extensive icon library.

### **Backend**
- **Node.js & Express**: Fast and minimalist web framework.
- **MongoDB & Mongoose**: Scalable NoSQL database and ODM.
- **JWT**: Secure token-based authentication.
- **Cloudinary**: Cloud storage for profile images.
- **Nodemailer**: Transactional email service.
- **Express Validator**: Server-side data validation.

## 📂 Project Structure

```
quiz-app/
├── client/          # Frontend React application (Vite + Tailwind)
│   ├── src/
│   │   ├── features/ # Feature-based modules (auth, quiz, dashboard, etc.)
│   │   ├── shared/   # Reusable UI, hooks, and context
│   │   └── providers/# Application-wide providers
├── server/          # Backend Node.js application (Express)
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database schemas
│   │   ├── routers/     # API endpoints
│   │   └── utils/       # Helpers (validators, email, cloudinary)
```

## ⚙️ Setup & Installation

### **Prerequisites**
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- SMTP service for emails (e.g., Mailtrap, Gmail)

### **1. Clone the repository**
```bash
git clone https://github.com/mohamed-rafat2001/quiz-app.git
cd quiz-app
```

### **2. Backend Setup**
1. `cd server`
2. `npm install`
3. Create `.env`:
   ```env
   PORT=8080
   DATABASE_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_key
   CLOUD_API_SECRET=your_cloudinary_secret
   MAILER_USER=your_email
   MAILER_PASS=your_email_password
   ```
4. `npm start`

### **3. Frontend Setup**
1. `cd client`
2. `npm install`
3. Create `.env`:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```
4. `npm start`

## 🚀 Deployment

The client is configured for deployment on **Netlify**.
- Build Command: `npm run build`
- Publish Directory: `dist`
- Redirects: Configured for SPA routing.
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
