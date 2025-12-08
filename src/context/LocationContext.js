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

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

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
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
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
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

