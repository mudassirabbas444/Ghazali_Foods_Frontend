import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('Across Pakistan');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get location from localStorage first
    const savedLocation = localStorage.getItem('userLocation');
    const savedLocationName = localStorage.getItem('userLocationName');
    
    if (savedLocation && savedLocationName) {
      try {
        setLocation(JSON.parse(savedLocation));
        setLocationName(savedLocationName);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }

    // Try to get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = { latitude, longitude };
          
          try {
            // Reverse geocode to get city name
            const cityName = await reverseGeocode(latitude, longitude);
            setLocation(locationData);
            setLocationName(cityName || 'Current Location');
            
            // Save to localStorage
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            localStorage.setItem('userLocationName', cityName || 'Current Location');
          } catch (error) {
            console.error('Error getting location name:', error);
            setLocation(locationData);
            setLocationName('Current Location');
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            localStorage.setItem('userLocationName', 'Current Location');
          }
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set default location
          if (!savedLocation) {
            setLocationName('Across Pakistan');
          }
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 3600000, // Cache for 1 hour
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'Ghazali Food Ecommerce App'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.address) {
        // Try to get city name
        const city = data.address.city || 
                    data.address.town || 
                    data.address.village || 
                    data.address.county ||
                    data.address.state;
        return city || 'Current Location';
      }
      return 'Current Location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Current Location';
    }
  };

  const updateLocation = async (lat, lng, name = null) => {
    const locationData = { latitude: lat, longitude: lng };
    setLocation(locationData);
    
    if (name) {
      setLocationName(name);
      localStorage.setItem('userLocationName', name);
    } else {
      const cityName = await reverseGeocode(lat, lng);
      setLocationName(cityName);
      localStorage.setItem('userLocationName', cityName);
    }
    
    localStorage.setItem('userLocation', JSON.stringify(locationData));
  };

  const updateLocationName = (name) => {
    setLocationName(name);
    localStorage.setItem('userLocationName', name);
  };

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      return { granted: false, error: 'Geolocation is not supported by your browser' };
    }

    // Check if permission API is available (Chrome, Edge, etc.)
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return { 
          granted: permission.state === 'granted', 
          denied: permission.state === 'denied',
          state: permission.state,
          error: permission.state === 'denied' ? 'Location permission denied. Please enable it in your browser settings.' : null
        };
      } catch (error) {
        // Permission API might not be supported, fall back to trying to get location
        return { granted: null, denied: false, error: null };
      }
    }
    
    // Fallback: Permission API not available
    return { granted: null, denied: false, error: null };
  };

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      // Check permission first (but don't block if it's in "prompt" state)
      checkLocationPermission().then((permissionCheck) => {
        // If explicitly denied, reject immediately
        if (permissionCheck.denied === true) {
          reject(new Error(permissionCheck.error || 'Location permission denied. Please enable location access in your browser settings.'));
          return;
        }

        // Try to get location (will prompt user if permission is "prompt")
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const cityName = await reverseGeocode(latitude, longitude);
              const locationData = { latitude, longitude };
              updateLocation(latitude, longitude, cityName);
              resolve({ ...locationData, name: cityName });
            } catch (error) {
              // Even if reverse geocoding fails, we still have the coordinates
              const locationData = { latitude, longitude };
              updateLocation(latitude, longitude, 'Current Location');
              resolve({ ...locationData, name: 'Current Location' });
            }
          },
          (error) => {
            let errorMessage = 'Failed to get location';
            
            // Handle error codes (1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT)
            if (error.code === 1 || error.code === error.PERMISSION_DENIED) {
              errorMessage = 'Location permission denied. Please enable location access in your browser settings and try again.';
            } else if (error.code === 2 || error.code === error.POSITION_UNAVAILABLE) {
              errorMessage = 'Location information is unavailable. Please check your device settings.';
            } else if (error.code === 3 || error.code === error.TIMEOUT) {
              errorMessage = 'Location request timed out. Please try again.';
            } else {
              // Use error message if available, otherwise use default
              errorMessage = error.message || 'Failed to get location. Please check your browser settings and try again.';
            }
            
            console.error('Geolocation error:', error);
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000, // Increased timeout
            maximumAge: 0, // Don't use cached position
          }
        );
      }).catch((permissionError) => {
        // If permission check fails, still try to get location
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const cityName = await reverseGeocode(latitude, longitude);
              const locationData = { latitude, longitude };
              updateLocation(latitude, longitude, cityName);
              resolve({ ...locationData, name: cityName });
            } catch (error) {
              const locationData = { latitude, longitude };
              updateLocation(latitude, longitude, 'Current Location');
              resolve({ ...locationData, name: 'Current Location' });
            }
          },
          (error) => {
            let errorMessage = 'Failed to get location';
            
            // Handle error codes (1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT)
            if (error.code === 1 || error.code === error.PERMISSION_DENIED) {
              errorMessage = 'Location permission denied. Please enable location access in your browser settings and try again.';
            } else if (error.code === 2 || error.code === error.POSITION_UNAVAILABLE) {
              errorMessage = 'Location information is unavailable. Please check your device settings.';
            } else if (error.code === 3 || error.code === error.TIMEOUT) {
              errorMessage = 'Location request timed out. Please try again.';
            } else {
              // Use error message if available, otherwise use default
              errorMessage = error.message || 'Failed to get location. Please check your browser settings and try again.';
            }
            
            console.error('Geolocation error:', error);
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      });
    });
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        locationName,
        isLoading,
        updateLocation,
        updateLocationName,
        getCurrentLocation,
        checkLocationPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

