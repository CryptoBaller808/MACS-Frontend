/**
 * MACS Platform API Service
 * Handles all communication with the backend API
 */

// Backend API configuration
const API_CONFIG = {
  BASE_URL: 'https://macs-backend-api.onrender.com',
  API_VERSION: '/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Get full API URL
const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('macs_auth_token');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('macs_auth_token', token);
  } else {
    localStorage.removeItem('macs_auth_token');
  }
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic API request function with retry logic
const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  };

  const requestOptions = {
    method: 'GET',
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  // Add body for non-GET requests
  if (options.body && typeof options.body === 'object') {
    requestOptions.body = JSON.stringify(options.body);
  }

  let lastError;
  
  for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication errors or client errors (4xx)
      if (error.message.includes('401') || error.message.includes('403') || 
          error.message.includes('400') || error.message.includes('404')) {
        throw error;
      }
      
      // Wait before retrying (except on last attempt)
      if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
      }
    }
  }
  
  throw lastError;
};

// API Service object
const apiService = {
  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  // Authentication endpoints
  auth: {
    async register(userData) {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: userData,
      });
      
      if (response.success && response.data.token) {
        setAuthToken(response.data.token);
      }
      
      return response;
    },

    async login(credentials) {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      
      if (response.success && response.data.token) {
        setAuthToken(response.data.token);
      }
      
      return response;
    },

    async logout() {
      setAuthToken(null);
      return { success: true };
    },

    async getProfile() {
      return await apiRequest('/auth/me');
    },

    async updateProfile(profileData) {
      return await apiRequest('/auth/me', {
        method: 'PUT',
        body: profileData,
      });
    },

    // Check if user is authenticated
    isAuthenticated() {
      return !!getAuthToken();
    },

    // Get current auth token
    getToken() {
      return getAuthToken();
    }
  },

  // User management
  users: {
    async getUsers() {
      return await apiRequest('/user');
    },

    async getUser(userId) {
      return await apiRequest(`/user/${userId}`);
    },

    async updateUser(userId, userData) {
      return await apiRequest(`/user/${userId}`, {
        method: 'PUT',
        body: userData,
      });
    }
  },

  // Profile management
  profiles: {
    async getProfiles() {
      return await apiRequest('/profiles');
    },

    async getProfile(profileId) {
      return await apiRequest(`/profiles/${profileId}`);
    },

    async createProfile(profileData) {
      return await apiRequest('/profiles', {
        method: 'POST',
        body: profileData,
      });
    },

    async updateProfile(profileId, profileData) {
      return await apiRequest(`/profiles/${profileId}`, {
        method: 'PUT',
        body: profileData,
      });
    },

    async deleteProfile(profileId) {
      return await apiRequest(`/profiles/${profileId}`, {
        method: 'DELETE',
      });
    }
  },

  // Wallet integration
  wallet: {
    async getWalletInfo() {
      return await apiRequest('/wallet');
    },

    async connectWallet(walletData) {
      return await apiRequest('/wallet/connect', {
        method: 'POST',
        body: walletData,
      });
    },

    async getBalance(address) {
      return await apiRequest(`/wallet/balance/${address}`);
    }
  },

  // Booking system
  booking: {
    async getBookings() {
      return await apiRequest('/booking');
    },

    async createBooking(bookingData) {
      return await apiRequest('/booking', {
        method: 'POST',
        body: bookingData,
      });
    },

    async getBooking(bookingId) {
      return await apiRequest(`/booking/${bookingId}`);
    },

    async updateBooking(bookingId, bookingData) {
      return await apiRequest(`/booking/${bookingId}`, {
        method: 'PUT',
        body: bookingData,
      });
    }
  },

  // Crowdfunding platform
  crowdfunding: {
    async getCampaigns() {
      return await apiRequest('/crowdfunding');
    },

    async createCampaign(campaignData) {
      return await apiRequest('/crowdfunding', {
        method: 'POST',
        body: campaignData,
      });
    },

    async getCampaign(campaignId) {
      return await apiRequest(`/crowdfunding/${campaignId}`);
    },

    async fundCampaign(campaignId, amount) {
      return await apiRequest(`/crowdfunding/${campaignId}/fund`, {
        method: 'POST',
        body: { amount },
      });
    }
  },

  // Cross-chain bridge
  bridge: {
    async getBridgeInfo() {
      return await apiRequest('/bridge');
    },

    async initiateBridge(bridgeData) {
      return await apiRequest('/bridge/transfer', {
        method: 'POST',
        body: bridgeData,
      });
    },

    async getBridgeStatus(transactionId) {
      return await apiRequest(`/bridge/status/${transactionId}`);
    }
  }
};

// Export the service
export default apiService;

// Export individual modules for convenience
export const { auth, users, profiles, wallet, booking, crowdfunding, bridge } = apiService;

// Export utility functions
export { getAuthToken, setAuthToken, getApiUrl };

