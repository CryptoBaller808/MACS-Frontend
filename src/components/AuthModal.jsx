import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, mode, onClose, onSwitchMode }) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        // Validation for registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!formData.agreeToTerms) {
          setError('Please agree to the terms and conditions');
          setLoading(false);
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          username: formData.username
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-macs-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
          <div>
            <h2 className="text-h3 text-macs-blue-600 font-gliker">
              {mode === 'login' ? 'Welcome Back' : 'Join MACS'}
            </h2>
            <p className="text-sm text-macs-gray-600 mt-1">
              {mode === 'login' 
                ? 'Sign in to your account' 
                : 'Create your artist account'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Registration Fields */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 transition-colors"
                  placeholder="Choose a unique username"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 pr-10 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-macs-gray-400 hover:text-macs-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-macs-gray-400 hover:text-macs-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Terms Agreement (Registration only) */}
          {mode === 'register' && (
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-macs-blue-600 focus:ring-macs-blue-500 border-macs-gray-300 rounded"
              />
              <label className="text-sm text-macs-gray-700">
                I agree to the{' '}
                <a href="#" className="text-macs-blue-600 hover:text-macs-blue-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-macs-blue-600 hover:text-macs-blue-700 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {/* Forgot Password (Login only) */}
          {mode === 'login' && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-macs-blue-600 hover:text-macs-blue-700 underline"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-macs-gray-50 border-t border-macs-gray-200 rounded-b-xl">
          <div className="text-center">
            <p className="text-sm text-macs-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button
                onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                className="text-macs-blue-600 hover:text-macs-blue-700 font-medium underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Social Login Options */}
          <div className="mt-4 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-macs-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-macs-gray-50 text-macs-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-macs-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-macs-gray-500 hover:bg-macs-gray-50 transition-colors"
              >
                <span className="mr-2">🌐</span>
                Wallet
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-macs-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-macs-gray-500 hover:bg-macs-gray-50 transition-colors"
              >
                <span className="mr-2">📧</span>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

