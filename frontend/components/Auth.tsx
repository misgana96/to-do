'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Trim and normalize email
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        throw new Error('Please enter a valid email address');
      }
      console.log('normalizedEmail', normalizedEmail);
      if (isSignUp) {
        console.log('signing up');
        console.log('normalizedEmail', normalizedEmail);
        console.log('password', password);
        
        // Signup with minimal payload - Supabase rejects test domains like @example.com
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password
        });
        
        console.log('Signup response:', { data, error });
        
        if (error) throw error;
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setMessage('Check your email to confirm your account!');
        } else if (data.session) {
          setMessage('Account created successfully!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      // Log full error for debugging
      console.error('Auth error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        email: normalizedEmail
      });
      
      // Provide more helpful error messages
      if (error.code === 'email_address_invalid' || error.message?.includes('is invalid')) {
        setError('Email address is invalid. Note: Test domains like @example.com are not supported. Please use a real email address (e.g., @gmail.com, @yahoo.com).');
      } else if (error.code === 'invalid_credentials' || error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'email_not_confirmed' || error.message?.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before signing in.');
      } else if (error.code === 'signup_disabled') {
        setError('Sign up is currently disabled. Please contact support.');
      } else if (error.code === 'user_already_registered') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.status === 400 || error.statusCode === 400) {
        setError(`Bad request: ${error.message || 'Please check your email and password format.'}`);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('An error occurred. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-700 dark:text-green-400 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

