import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, ArrowRight, Shield, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components';
import GoogleAuth from '../../components/auth/GoogleAuth';
import { VALIDATION, ROUTES } from '../../constants';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const password = watch('password');

  // Password strength calculation
  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 6) strength += 1;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  // Block timer
  useEffect(() => {
    if (blockTime > 0) {
      const timer = setTimeout(() => {
        setBlockTime(blockTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isBlocked) {
      setIsBlocked(false);
    }
  }, [blockTime, isBlocked]);

  const onSubmit = async (data) => {
    if (isBlocked) return;

    // Prepare registration data
    const registrationData = {
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };

    console.log('Registration attempt:', registrationData);
    const result = await registerUser(registrationData);
    console.log('Registration result:', result);
    
    if (result.success) {
      console.log('Registration successful, redirecting to home');
      navigate(ROUTES.HOME);
    } else {
      console.log('Registration failed:', result.message || result.error);
      // Handle failed registration attempts
      const newAttempts = registrationAttempts + 1;
      setRegistrationAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsBlocked(true);
        setBlockTime(300); // 5 minutes block
        setRegistrationAttempts(0);
      }
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
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100 via-green-200 to-green-100 dark:from-orange-900 dark:via-red-900 dark:to-pink-900'></div>
      </div>

      <motion.div
        className='relative z-10 w-full max-w-md'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Register Card */}
        <motion.div
          className='bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700'
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className='text-center mb-8' variants={itemVariants}>
            <motion.div
              className='w-20 h-20 bg-gradient-to-br from-green-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className='w-10 h-10 text-white' />
            </motion.div>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>Join Ghazali Food</h1>
            <p className='text-gray-600 dark:text-gray-400'>Create your account to get started</p>
          </motion.div>

          {/* Security Warnings */}
          {registrationAttempts > 0 && (
            <motion.div
              className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className='flex items-center'>
                <AlertCircle className='h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2' />
                <span className='text-sm font-medium text-yellow-800 dark:text-yellow-300'>
                  Security Notice
                </span>
              </div>
              <p className='text-xs text-yellow-700 dark:text-yellow-400 mt-1'>
                {registrationAttempts === 1 && '1 failed attempt. 2 more attempts remaining.'}
                {registrationAttempts === 2 && '2 failed attempts. 1 more attempt remaining.'}
                {registrationAttempts >= 3 && 'Too many failed attempts. Please wait before trying again.'}
              </p>
            </motion.div>
          )}

          {/* Block Warning */}
          {isBlocked && (
            <motion.div
              className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className='flex items-center'>
                <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400 mr-2' />
                <span className='text-sm font-medium text-red-800 dark:text-red-300'>
                  Registration Temporarily Blocked
                </span>
              </div>
              <p className='text-xs text-red-700 dark:text-red-400 mt-1'>
                Too many failed attempts. Please wait {Math.floor(blockTime / 60)}:{(blockTime % 60).toString().padStart(2, '0')} before trying again.
              </p>
            </motion.div>
          )}

          {/* Form */}
          <motion.form onSubmit={handleSubmit(onSubmit)} className='space-y-6' variants={itemVariants}>
            <div className='space-y-4'>
              <Input
                label='Full Name'
                type='text'
                autoComplete='name'
                placeholder='Enter your full name'
                leftIcon={<User className='h-5 w-5 text-gray-400' />}
                error={errors.name?.message}
                className='bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:border-green-500 dark:focus:border-green-400'
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: VALIDATION.NAME_MIN_LENGTH,
                    message: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`,
                  },
                  maxLength: {
                    value: VALIDATION.NAME_MAX_LENGTH,
                    message: `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`,
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: 'Name can only contain letters and spaces',
                  },
                })}
              />

              <Input
                label='Email address'
                type='email'
                autoComplete='email'
                placeholder='Enter your email'
                leftIcon={<Mail className='h-5 w-5 text-gray-400' />}
                error={errors.email?.message}
                className='bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:border-green-500 dark:focus:border-green-400'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: VALIDATION.EMAIL_REGEX,
                    message: 'Please enter a valid email address',
                  },
                  validate: {
                    notDisposable: (value) => {
                      const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
                      const domain = value.split('@')[1];
                      return !disposableDomains.includes(domain) || 'Please use a permanent email address';
                    },
                  },
                })}
              />

              <Input
                label='Phone Number'
                type='tel'
                autoComplete='tel'
                placeholder='Enter your phone number'
                leftIcon={<Phone className='h-5 w-5 text-gray-400' />}
                error={errors.phone?.message}
                className='bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:border-green-500 dark:focus:border-green-400'
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: {
                    value: 10,
                    message: 'Phone number must be at least 10 digits',
                  },
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
              />

              <div className='relative'>
                <Input
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
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
                  className='bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:border-green-500 dark:focus:border-green-400 pr-12'
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: VALIDATION.PASSWORD_MIN_LENGTH,
                      message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
                    },
                    validate: {
                      hasUpperCase: (value) => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                      hasLowerCase: (value) => /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                      hasNumber: (value) => /[0-9]/.test(value) || 'Password must contain at least one number',
                    },
                  })}
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <motion.div
                  className='space-y-2'
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className='flex items-center space-x-2'>
                    <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength <= 2
                            ? 'bg-red-500'
                            : passwordStrength <= 4
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength / 6) * 100}%` }}
                      />
                    </div>
                    <span className='text-xs text-gray-600 dark:text-gray-400'>
                      {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-500'>
                    {passwordStrength < 3 && 'Password should be stronger for better security'}
                  </div>
                </motion.div>
              )}

              <Input
                label='Confirm Password'
                type='password'
                autoComplete='new-password'
                placeholder='Confirm your password'
                leftIcon={<Lock className='h-5 w-5 text-gray-400' />}
                error={errors.confirmPassword?.message}
                className='bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:border-green-500 dark:focus:border-green-400'
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
            </div>

            <div className='flex items-center'>
              <input
                id='terms'
                name='terms'
                type='checkbox'
                className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                {...register('terms', {
                  required: 'You must accept the terms and conditions',
                })}
              />
              <label htmlFor='terms' className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
                I agree to the{' '}
                <Link
                  to='/terms'
                  className='font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200'
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to='/privacy'
                  className='font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200'
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className='text-sm text-red-600 dark:text-red-400'>{errors.terms.message}</p>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type='submit'
                size='lg'
                fullWidth
                loading={isLoading}
                disabled={isLoading || isBlocked}
                className='bg-gradient-to-r from-green-500 to-red-600 text-white hover:from-green-600 hover:to-red-700 shadow-lg'
              >
                {isBlocked ? 'Registration Blocked' : (
                  <>
                    Create Account
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </>
                )}
              </Button>
            </motion.div>

            <div className='text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className='font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200'
                >
                  Sign in here
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
              <GoogleAuth 
                onSuccess={(result) => {
                  if (result.success) {
                    navigate(ROUTES.HOME);
                  }
                }}
                text="Sign up with Google"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div className='mt-8 text-center' variants={itemVariants}>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            Join thousands of users shopping with us
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
