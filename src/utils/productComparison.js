// Product Comparison Utility
const STORAGE_KEY = 'dealistaan_comparison';
const MAX_COMPARE = 4;

export const addToComparison = (product) => {
  try {
    const items = getComparison();
    if (items.length >= MAX_COMPARE) {
      throw new Error(`You can compare up to ${MAX_COMPARE} products`);
    }
    if (items.find(item => item._id === product._id)) {
      throw new Error('Product already in comparison');
    }
    const updated = [...items, { ...product }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    throw error;
  }
};

export const removeFromComparison = (productId) => {
  try {
    const items = getComparison();
    const updated = items.filter(item => item._id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error removing from comparison:', error);
    return [];
  }
};

export const getComparison = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting comparison:', error);
    return [];
  }
};

export const clearComparison = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing comparison:', error);
  }
};

export const isInComparison = (productId) => {
  const items = getComparison();
  return items.some(item => item._id === productId);
};

