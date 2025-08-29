import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login({ email, password });
    } catch (err) {
      // Error is handled by the login function with toast
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Company Logo/Name */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mychoice</h1>
          <p className="text-blue-100">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white backdrop-blur-sm bg-opacity-95 p-8 rounded-2xl shadow-xl border border-blue-200">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToSignup}
              className="flex items-center justify-center w-full text-blue-600 hover:text-blue-700 font-medium"
            >
              Don't have an account? Sign up
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-white">
            Developed By <span className="font-medium text-blue-200">Cripcocode Ai Pvt Ltd</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;