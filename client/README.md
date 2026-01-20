# Quiz App - Frontend 🌐

The frontend of the Quiz App is a modern React application built with **Vite**, utilizing **Tailwind CSS** for styling, **TanStack React Query** for data fetching, and **React Router** for navigation.

## 🚀 Features

- **Role-Based UI**: Dynamic interfaces for Admins, Teachers, and Students.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on all screen sizes.
- **Data Synchronization**: Powered by TanStack React Query for efficient caching, background updates, and optimistic UI.
- **Interactive Quizzes**: Smooth quiz-taking experience with Framer Motion animations.
- **Form Management**: Robust form handling and validation using React Hook Form and Zod.
- **Dark Mode**: Built-in dark mode support with context API.
- **Protected Routes**: Secure client-side routing based on authentication and user roles.

## 🛠️ Tech Stack

- **React (Vite)**: Core library and build tool.
- **Tailwind CSS**: Utility-first styling.
- **TanStack React Query**: Server state management.
- **React Router Dom**: Navigation and routing.
- **Framer Motion**: Animations.
- **React Icons**: Icon library.
- **React Hook Form**: Form handling.
- **Zod**: Schema validation.
- **Axios**: HTTP client.

## 📂 Folder Structure

- `src/features/`: Feature-specific modules (Auth, Quiz, Dashboard, Admin, Profile).
- `src/shared/`: Reusable components, hooks, context, and API configuration.
- `src/providers/`: Application-wide context providers (QueryClient, Auth, DarkMode).
- `src/pages/`: Main page components (Landing, Home).
- `src/routes/`: Route definitions and lazy loading.

## ⚙️ Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 📝 Scripts

- `npm start`: Runs the app in development mode using Vite.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Previews the production build locally.
