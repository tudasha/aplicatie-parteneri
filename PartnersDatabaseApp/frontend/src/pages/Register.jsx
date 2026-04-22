import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', password: '', fullName: '', 
    position: 'Team Member', department: 'Sponsorship', email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/register', formData);
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Registration failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-clay-bg flex items-center justify-center p-6">
      <div className="clay-card w-full max-w-2xl p-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-clay-brand rounded-clay shadow-clay-sm flex items-center justify-center text-white mb-6">
          <UserPlus className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-black text-clay-brand mb-8">Join the Team</h2>

        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Username</label>
            <input name="username" type="text" className="clay-input" onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Email</label>
            <input name="email" type="email" className="clay-input" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Full Name</label>
            <input name="fullName" type="text" className="clay-input" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Password</label>
            <input name="password" type="password" className="clay-input" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Role</label>
            <select name="position" className="clay-input appearance-none" onChange={handleChange} required>
                <option value="Team Member">Team Member</option>
                <option value="Team Leader">Team Leader</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Department</label>
            <input name="department" type="text" className="clay-input" onChange={handleChange} required />
          </div>

          <div className="md:col-span-2 pt-4">
            {error && <p className="text-red-500 text-sm font-bold text-center mb-4">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full clay-button-primary py-4 text-lg"
            >
                {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-clay-brand font-black hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
