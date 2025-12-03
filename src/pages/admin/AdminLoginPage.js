import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button, Input } from '../../components';
import { ROUTES } from '../../constants';
import { toast } from 'react-toastify';
import logo from '../../assets/Logo.png';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    const result = await login(data);
    
    if (result.success) {
      toast.success('Admin login successful!');
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else {
      setError(result.message || 'Invalid credentials');
      toast.error(result.message || 'Login failed');
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
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 overflow-hidden opacity-5'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100 via-red-100 to-pink-100'></div>
      </div>

      <motion.div
        className='relative z-10 w-full max-w-md px-4'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Login Card */}
        <motion.div
          className='bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200'
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className='text-center mb-6 sm:mb-8' variants={itemVariants}>
            <div className='flex items-center justify-center mb-4'>
              <img src={logo} alt="Logo" className='h-12 w-12 object-contain' />
            </div>
            <motion.div
              className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg'
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className='w-8 h-8 sm:w-10 sm:h-10 text-white' />
            </motion.div>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2'>Admin Login</h1>
            <p className='text-sm sm:text-base text-gray-600'>Sign in to access admin panel</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className='w-5 h-5 text-red-600' />
              <p className='text-sm text-red-700'>{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <motion.form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-6' variants={itemVariants}>
            <div>
              <Input
                type='email'
                placeholder='Enter your email'
                leftIcon={<Mail className='h-5 w-5 text-gray-400' />}
                error={errors.email?.message}
                className='bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-orange-500'
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
                    className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                }
                error={errors.password?.message}
                className='bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-orange-500 pr-12'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
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
          </motion.form>

          {/* Footer */}
          <motion.div className='mt-6 text-center' variants={itemVariants}>
            <p className='text-sm text-gray-500'>
              Secure admin access with industry-standard encryption
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

