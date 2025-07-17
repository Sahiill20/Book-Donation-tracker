import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import bookLogo from '../assets/book-donation-logo.svg';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function SignUp() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    if (!data.agreeTerms) {
      setError('You must agree to the terms of service');
      setIsLoading(false);
      return;
    }
    
    try {
      // Extract email and password for Firebase Auth
      const { email, password } = data;
      
      // Register the user with Firebase Auth
      const userCredential = await registerUser(email, password, {
        fullName: data.fullName,
        username: data.username,
        phoneNumber: data.phoneNumber,
        address: data.address
      });
      const user = userCredential.user;
      await axios.post('http://localhost:3000/api/users/register', {
        uid: user.uid,
        email,
        fullName: data.fullName,
        username: data.username,
        phoneNumber: data.phoneNumber,
        address: data.address
      });

      localStorage.setItem("userData", JSON.stringify({
        uid: user.uid,
        email,
        fullName: data.fullName,
        username: data.username,
        phoneNumber: data.phoneNumber,
        address: data.address
      }));
  

      
      
      navigate('/home');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Section with Background Image and Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col items-center justify-center p-12 relative">
        <img 
          src={bookLogo} 
          alt="Book Donation Tracker" 
          className="w-32 h-32 mb-8" 
        />
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl mb-4">Start sharing books and spreading knowledge today</p>
          <div className="bg-white/20 p-8 rounded-lg">
            <p className="italic text-lg">"The more that you read, the more things you will know. The more that you learn, the more places you'll go."</p>
            <p className="mt-2 font-semibold">— Dr. Seuss</p>
          </div>
        </div>
        
        {/* Decorative book imagery */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="h-32 bg-contain bg-bottom bg-no-repeat" 
               style={{backgroundImage: `url('/images/books-silhouette.png')`}}>
          </div>
        </div>
      </div>
      
      {/* Right Section with Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join our book donation community</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                {...register("fullName", { required: "Full name is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
              {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                {...register("username", { 
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters"
                  }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="johndoe123"
              />
              {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                {...register("phoneNumber", { 
                  required: "Phone number is required" 
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(123) 456-7890"
              />
              {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber.message}</span>}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                {...register("address", { required: "Address is required" })}
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Book Street, Reading, NY 10001"
              />
              {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
            </div>
            
            <div className="flex items-center">
              <input
                id="agreeTerms"
                type="checkbox"
                {...register("agreeTerms")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/Login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;