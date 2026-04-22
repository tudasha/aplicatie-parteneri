import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [userOrEmail, setUserOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/login', { userOrEmail, password });
      if (response.data.success) {
        onLogin();
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Connection failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clay-bg flex items-center justify-center p-6">
      <div className="clay-card w-full max-w-md p-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-clay-brand rounded-clay shadow-clay-sm flex items-center justify-center text-white mb-6">
          <LogIn className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-black text-clay-brand mb-8">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Username or Email</label>
            <input
              type="text"
              className="clay-input"
              value={userOrEmail}
              onChange={(e) => setUserOrEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="clay-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full clay-button-primary py-4 text-lg"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-slate-500 font-medium">
          Don't have an account? <Link to="/register" className="text-clay-brand font-black hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
