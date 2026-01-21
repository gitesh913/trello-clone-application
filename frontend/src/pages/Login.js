import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      login(response.data.user, response.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-matte-blue-900 via-dark-blue-800 to-matte-blue-800">
      <div className="bg-gradient-to-br from-matte-blue-800 to-dark-blue-700 p-8 rounded-xl shadow-2xl w-full max-w-md border border-matte-blue-600">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">Trello Clone</h1>
        <h2 className="text-xl font-semibold mb-8 text-center text-matte-blue-300">Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-matte-blue-200 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-matte-blue-200 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-accent-blue/50 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-matte-blue-300 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-accent-cyan font-semibold hover:text-accent-blue transition"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
