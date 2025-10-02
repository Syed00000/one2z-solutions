/**
 * Clear all localStorage cache data
 * Now everything comes from database and Cloudinary
 */
export const clearLocalStorageCache = () => {
  // Remove old localStorage data
  const keysToRemove = [
    'meetings',
    'messages', 
    'contactMessages',
    'reviews',
    'projects',
    'adminData',
    'cachedData'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('✅ LocalStorage cache cleared - All data now comes from database');
};

/**
 * Initialize app by clearing old cache
 */
export const initializeApp = () => {
  clearLocalStorageCache();
  
  // Keep only authentication data
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    console.log('✅ Authentication data preserved');
  }
};
