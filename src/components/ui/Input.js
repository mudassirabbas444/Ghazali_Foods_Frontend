import React, { forwardRef } from 'react';
import { cn } from '../../utils';

const Input = forwardRef(
  (
    { label, error, helperText, leftIcon, rightIcon, className = '', ...props },
    ref
  ) => {
    const inputClasses = cn(
      'w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      error && 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-300',
      className
    );

    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
      error && 'text-red-700 dark:text-red-400'
    );

    const helperTextClasses = cn(
      'mt-1 text-sm',
      error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
    );

    return (
      <div className='w-full'>
        {label && <label className={labelClasses}>{label}</label>}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              {leftIcon}
            </div>
          )}

          <input ref={ref} className={inputClasses} {...props} />

          {rightIcon && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={helperTextClasses}>{error || helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
