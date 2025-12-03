import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components';
import GoogleAuth from '../../components/auth/GoogleAuth';
import { ROUTES } from '../../constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log('LoginPage onSubmit called with:', data);
    const result = await login(data);
    console.log('LoginPage login result:', result);
    
    if (result.success) {
      console.log('Login successful, redirecting to home');
      navigate(ROUTES.HOME);
    } else if (result.requiresVerification) {
      console.log('Login requires verification, redirecting to verification page');
      // Redirect to email verification page
      navigate(`/verify-email?userId=${result.userId}&email=${encodeURIComponent(result.email)}`);
    }
  };

  const handleGoogleSuccess = (result) => {
    if (result.success) {
      navigate(ROUTES.HOME);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Subtle Background Pattern */}
      <div className='absolute inset-0 overflow-hidden opacity-5'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 dark:from-orange-900 dark:via-red-900 dark:to-pink-900'></div>
      </div>

      <motion.div
        className='relative z-10 w-full max-w-md px-4'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Login Card */}
        <motion.div
          className='bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700'
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className='text-center mb-6 sm:mb-8' variants={itemVariants}>
            <motion.div
              className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg'
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className='w-8 h-8 sm:w-10 sm:h-10 text-white' />
            </motion.div>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>Welcome Back</h1>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Sign in to your account to continue</p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-6' variants={itemVariants}>
            <div>
              <Input
                type='email'
                placeholder='Enter your email'
                leftIcon={<Mail className='h-5 w-5 text-gray-400' />}
                error={errors.email?.message}
                className='bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:border-orange-500 dark:focus:border-orange-400'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
            </div>

            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                leftIcon={<Lock className='h-5 w-5 text-gray-400' />}
                rightIcon={
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                }
                error={errors.password?.message}
                className='bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:border-orange-500 dark:focus:border-orange-400 pr-12'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
            </div>

            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-xs sm:text-sm text-gray-700 dark:text-gray-300'
                >
                  Remember me
                </label>
              </div>

              <div className='text-xs sm:text-sm'>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className='font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-200 min-h-[44px] flex items-center'
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type='submit'
                size='lg'
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className='bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg'
              >
                {isLoading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </>
                )}
              </Button>
            </motion.div>

            <div className='text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className='font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-200'
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </motion.form>

          {/* Google OAuth */}
          <motion.div className='mt-8' variants={itemVariants}>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300 dark:border-gray-600' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>Or continue with</span>
              </div>
            </div>
            <div className='mt-6'>
              <GoogleAuth onSuccess={handleGoogleSuccess} />
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div className='mt-8 text-center' variants={itemVariants}>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            Secure login with industry-standard encryption
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
