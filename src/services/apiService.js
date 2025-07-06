const API_BASE_URL = 'https://macs-backend-api.onrender.com/api/v1';

// API Configuration
const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('macs_token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to build API URL
const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Generic API request function with retry logic
const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const defaultOptions = {
    headers: getAuthHeaders(),
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Convert body to JSON if it's an object
  if (requestOptions.body && typeof requestOptions.body === 'object') {
    requestOptions.body = JSON.stringify(requestOptions.body);
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

// API Service Object
const apiService = {
  // Authentication endpoints
  auth: {
    async login(email, password) {
      return await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
    },

    async register(userData) {
      return await apiRequest('/auth/register', {
        method: 'POST',
        body: userData,
      });
    },

    async logout() {
      return await apiRequest('/auth/logout', {
        method: 'POST',
      });
    },

    async verify() {
      return await apiRequest('/auth/verify');
    },

    async resetPassword(email) {
      return await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { email },
      });
    },

    async getCurrentUser() {
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

    async getPublicProfile(profileId) {
      // Public profile endpoint that doesn't require authentication
      try {
        const url = getApiUrl(`/profiles/public/${profileId}`);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch public profile:', error);
        throw error;
      }
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
    },

    // Upload profile avatar
    async uploadAvatar(file) {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const url = getApiUrl('/profiles/avatar');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    },

    // Get artist gallery/artworks
    async getArtistGallery(artistId) {
      return await apiRequest(`/profiles/${artistId}/gallery`);
    },

    // Follow/unfollow artist
    async followArtist(artistId) {
      return await apiRequest(`/profiles/${artistId}/follow`, {
        method: 'POST',
      });
    },

    async unfollowArtist(artistId) {
      return await apiRequest(`/profiles/${artistId}/unfollow`, {
        method: 'POST',
      });
    },

    // Get follow status
    async getFollowStatus(artistId) {
      return await apiRequest(`/profiles/${artistId}/follow-status`);
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
    },

    async deleteBooking(bookingId) {
      return await apiRequest(`/booking/${bookingId}`, {
        method: 'DELETE',
      });
    }
  },

  // Bridge functionality
  bridge: {
    async getBridgeInfo() {
      return await apiRequest('/bridge');
    },

    async initiateBridge(bridgeData) {
      return await apiRequest('/bridge/initiate', {
        method: 'POST',
        body: bridgeData,
      });
    },

    async getBridgeStatus(transactionId) {
      return await apiRequest(`/bridge/status/${transactionId}`);
    }
  },

  // Crowdfunding
  crowdfunding: {
    async getCampaigns() {
      return await apiRequest('/crowdfunding');
    },

    async getCampaign(campaignId) {
      return await apiRequest(`/crowdfunding/${campaignId}`);
    },

    async createCampaign(campaignData) {
      return await apiRequest('/crowdfunding', {
        method: 'POST',
        body: campaignData,
      });
    },

    async updateCampaign(campaignId, campaignData) {
      return await apiRequest(`/crowdfunding/${campaignId}`, {
        method: 'PUT',
        body: campaignData,
      });
    },

    async deleteCampaign(campaignId) {
      return await apiRequest(`/crowdfunding/${campaignId}`, {
        method: 'DELETE',
      });
    },

    async contributeToCampaign(campaignId, contributionData) {
      return await apiRequest(`/crowdfunding/${campaignId}/contribute`, {
        method: 'POST',
        body: contributionData,
      });
    }
  },

  // Utility functions
  utils: {
    // Health check
    async healthCheck() {
      try {
        const response = await fetch(getApiUrl('/health'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    },

    // Get API status
    async getApiStatus() {
      try {
        const response = await fetch(getApiUrl('/status'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          return await response.json();
        }
        return { status: 'error', message: 'API not responding' };
      } catch (error) {
        return { status: 'error', message: error.message };
      }
    },

    // Upload file (generic)
    async uploadFile(file, endpoint = '/upload') {
      const formData = new FormData();
      formData.append('file', file);
      
      const url = getApiUrl(endpoint);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    }
  }
};

export default apiService;

