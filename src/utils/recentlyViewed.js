// Recently Viewed Products Utility
const STORAGE_KEY = 'dealistaan_recently_viewed';
const MAX_ITEMS = 10;

export const addToRecentlyViewed = (product) => {
  try {
    const items = getRecentlyViewed();
    // Remove if already exists
    const filtered = items.filter(item => item._id !== product._id);
    // Add to beginning
    const updated = [{ ...product }, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recently viewed:', error);
  }
};

export const getRecentlyViewed = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};

