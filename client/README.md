# Quiz App - Frontend 🌐

The frontend of the Quiz App is a modern React application built with Vite, utilizing Redux for state management and React Query for efficient data handling.

## 🚀 Features

- **Responsive UI**: Built with Bootstrap for a seamless experience across devices.
- **State Management**: Uses Redux Toolkit to manage user state and application data.
- **Data Fetching**: Powered by TanStack React Query for caching, synchronization, and error handling.
- **Form Handling**: Efficient form management using React Hook Form.
- **Authentication**: Protected routes and secure login/signup flows.
- **Dynamic Quiz Interface**: Interactive components for taking quizzes and viewing results.

## 🛠️ Tech Stack

- **React**: Library for building the user interface.
- **Vite**: Next-generation frontend tooling.
- **Redux Toolkit**: Standard way to write Redux logic.
- **React Query**: Hooks for fetching, caching, and updating asynchronous data.
- **React Router**: Declarative routing for React.
- **Bootstrap & Bootstrap Icons**: Styling and iconography.
- **Axios**: Promise-based HTTP client for the browser.

## 📂 Folder Structure

- `src/api/`: Base API configurations and local storage helpers.
- `src/components/`: Reusable components (Home, Auth, Dashboard, Profile, Quiz).
- `src/Hooks/`: Custom React hooks (e.g., `useProtect`).
- `src/services/`: React Query service functions for interacting with the backend.
- `src/ui/`: Layout components, loaders, and global styles.

## ⚙️ Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## 📝 Scripts

- `npm start`: Runs the app in development mode using Vite.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Previews the production build locally.
