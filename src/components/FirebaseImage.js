import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Firebase Image Component with error handling and loading states
 */
const FirebaseImage = ({ 
  src, 
  alt = 'Image', 
  className = '', 
  fallbackIcon = null,
  onError = null,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const previousSrcRef = useRef(src);
  const imgRef = useRef(null);

  // Update imageSrc when src prop actually changes
  useEffect(() => {
    const normalizedSrc = src && src.trim() !== '' ? src.trim() : '';
    const previousSrc = previousSrcRef.current;
    
    // Only update if src actually changed (not just a new string reference)
    if (normalizedSrc !== previousSrc) {
      previousSrcRef.current = normalizedSrc;
      
      if (normalizedSrc) {
        setImageSrc(normalizedSrc);
        // Only reset loading state if image hasn't loaded yet or src actually changed
        if (!imgRef.current || !imgRef.current.complete || imgRef.current.dataset.loaded !== 'true') {
          setIsLoading(true);
          setHasError(false);
        }
      } else {
        // If src becomes empty, reset
        setImageSrc('');
        setIsLoading(false);
        setHasError(false);
      }
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    // Mark image as loaded to prevent unnecessary reloads
    if (imgRef.current) {
      imgRef.current.dataset.loaded = 'true';
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    // Force reload by adding timestamp
    if (src) {
      setImageSrc(`${src}?t=${Date.now()}`);
    }
  };

  // Don't render if src is empty or null
  if (!src || src.trim() === '') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        {fallbackIcon || (
          <div className='text-center p-4'>
            <AlertCircle className='h-8 w-8 text-gray-400 mx-auto mb-2' />
            <p className='text-sm text-gray-500'>No image available</p>
          </div>
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className='text-center p-4'>
          {fallbackIcon || (
            <AlertCircle className='h-8 w-8 text-gray-400 mx-auto mb-2' />
          )}
          <p className='text-sm text-gray-500 mb-2'>Failed to load image</p>
          <span
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent button click
              handleRetry();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleRetry();
              }
            }}
            className='text-xs text-primary-600 hover:text-primary-700 cursor-pointer underline'
          >
            Retry
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <div className='w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin' />
        </div>
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default FirebaseImage;
