/**
 * Main App component for AllMyDucks Todo application
 * Handles routing and global layout
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import TodoCard from './components/TodoCard';

// Auth components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import Profile from './components/auth/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HelpPage from './pages/HelpPage';

// Pages
import TodoPage from './pages/TodoPage';
import SearchPage from './pages/SearchPage';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Sample tasks data
const sampleTasks = [
  { id: 1, content: 'Morning team standup', completed: true, priority: 'high' },
  { id: 2, content: 'Complete project proposal', completed: false, priority: 'medium' },
  { id: 3, content: 'Review pull requests', completed: false, priority: 'medium' },
  { id: 4, content: 'Update documentation', completed: false, priority: 'low' },
  { id: 5, content: 'Weekly progress report', completed: true, priority: 'high' }
];

// Page components
const HomePage = () => (
  <div className="home-page container py-4">
    <h1 className="text-center mb-4">All My Ducks</h1>
    <p className="text-center text-muted mb-5">Keep track of your daily tasks</p>
    <TodoCard initialTasks={sampleTasks} />
  </div>
);

/**
 * App Component
 * Sets up routing and global layout structure
 * @returns {JSX.Element} The rendered component
 */
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/help" element={<HelpPage />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/todos" element={<TodoPage />} />
                  <Route path="/search" element={<SearchPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 