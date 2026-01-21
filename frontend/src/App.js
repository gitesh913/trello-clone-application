import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import './styles/global.css';

function AppRoutes() {
  const { user, login } = React.useContext(AuthContext);

  // Auto-login on app start for testing
  useEffect(() => {
    if (!user) {
      const testUser = {
        id: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      };
      login(testUser, 'test-token-12345');
    }
  }, [user, login]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/board/:projectId" element={<Board />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
