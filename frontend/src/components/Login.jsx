import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import bookLogo from '../assets/book-donation-logo.svg';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      await loginUser(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Please register your email and password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Login with Google failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = () => {
    setError('Facebook login not implemented yet');
  };

  const handleInstagramSignIn = () => {
    setError('Instagram login not implemented yet');
  };

  const handleTwitterSignIn = () => {
    setError('X/Twitter login not implemented yet');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Section with Background Image and Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <img 
          src={bookLogo} 
          alt="Book Donation Tracker" 
          className="w-32 h-32 mb-8" 
        />
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-6">Share Knowledge</h1>
          <p className="text-xl mb-4">Donate books and spread the joy of reading</p>
          <div className="bg-white/20 p-8 rounded-lg">
            <p className="italic text-lg">"A reader lives a thousand lives before he dies. The man who never reads lives only one."</p>
            <p className="mt-2 font-semibold">— George R.R. Martin</p>
          </div>
        </div>
        
        {/* Decorative book imagery */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="h-32 bg-contain bg-bottom bg-no-repeat" 
               style={{backgroundImage: `url('/images/books-silhouette.png')`}}>
          </div>
        </div>
      </div>
      
      {/* Right Section with Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600 mt-2">Sign in to continue donating books</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                {...register("email", { required: true })}
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
              {errors.email && <span className="text-xs text-red-500">This field is required</span>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                {...register("password", { required: true })}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs text-red-500">This field is required</span>}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-15 h-15 inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="w-15 h-15 inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.87v-6.99h-2.3V12h2.3V9.79c0-2.27 1.35-3.53 3.42-3.53.99 0 2.03.18 2.03.18v2.23h-1.14c-1.13 0-1.48.7-1.48 1.41V12h2.52l-.4 2.88h-2.12v6.99A10 10 0 0022 12z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleInstagramSignIn}
                className="w-15 h-15 inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0120.5 7.75v8.5a4.25 4.25 0 01-4.25 4.25h-8.5A4.25 4.25 0 013.5 16.25v-8.5A4.25 4.25 0 017.75 3.5zm4.25 3A5.25 5.25 0 1017.25 12 5.26 5.26 0 0012 6.5zm0 1.5A3.75 3.75 0 1115.75 12 3.75 3.75 0 0112 8zm5.25-2.25a.75.75 0 11-.75.75.75.75 0 01.75-.75z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleTwitterSignIn}
                className="w-15 h-15 inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with X</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.977 2H17.8l-4.187 5.538L9.004 2H2l7.34 10.31L2.272 22h3.177l4.577-6.057L15.576 22H22l-7.74-10.859L20.977 2zM7.166 4.3l9.526 13.274h-1.596L5.595 4.3h1.571z" />
                </svg>
              </button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/SignUp" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;