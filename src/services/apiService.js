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
    // Get all bookings for current user (artist or client)
    async getBookings() {
      return await apiRequest('/booking');
    },

    // Get bookings for a specific artist
    async getArtistBookings(artistId) {
      return await apiRequest(`/booking/artist/${artistId}`);
    },

    // Get bookings for current user as client
    async getClientBookings() {
      return await apiRequest('/booking/client');
    },

    // Create a new booking request
    async createBooking(bookingData) {
      return await apiRequest('/booking', {
        method: 'POST',
        body: bookingData,
      });
    },

    // Get specific booking details
    async getBooking(bookingId) {
      return await apiRequest(`/booking/${bookingId}`);
    },

    // Update booking (accept, decline, modify)
    async updateBooking(bookingId, bookingData) {
      return await apiRequest(`/booking/${bookingId}`, {
        method: 'PUT',
        body: bookingData,
      });
    },

    // Accept a booking request
    async acceptBooking(bookingId) {
      return await apiRequest(`/booking/${bookingId}/accept`, {
        method: 'POST',
      });
    },

    // Decline a booking request
    async declineBooking(bookingId, reason = '') {
      return await apiRequest(`/booking/${bookingId}/decline`, {
        method: 'POST',
        body: { reason },
      });
    },

    // Cancel a booking
    async cancelBooking(bookingId, reason = '') {
      return await apiRequest(`/booking/${bookingId}/cancel`, {
        method: 'POST',
        body: { reason },
      });
    },

    // Complete a booking
    async completeBooking(bookingId) {
      return await apiRequest(`/booking/${bookingId}/complete`, {
        method: 'POST',
      });
    },

    // Delete a booking
    async deleteBooking(bookingId) {
      return await apiRequest(`/booking/${bookingId}`, {
        method: 'DELETE',
      });
    },

    // Get booking statistics for artist
    async getBookingStats(artistId) {
      return await apiRequest(`/booking/stats/${artistId}`);
    }
  },

  // Calendar and availability management
  calendar: {
    // Get artist availability
    async getAvailability(artistId) {
      return await apiRequest(`/calendar/availability/${artistId}`);
    },

    // Set artist availability
    async setAvailability(availabilityData) {
      return await apiRequest('/calendar/availability', {
        method: 'POST',
        body: availabilityData,
      });
    },

    // Update availability
    async updateAvailability(availabilityId, availabilityData) {
      return await apiRequest(`/calendar/availability/${availabilityId}`, {
        method: 'PUT',
        body: availabilityData,
      });
    },

    // Delete availability slot
    async deleteAvailability(availabilityId) {
      return await apiRequest(`/calendar/availability/${availabilityId}`, {
        method: 'DELETE',
      });
    },

    // Get available time slots for a specific date
    async getAvailableSlots(artistId, date) {
      return await apiRequest(`/calendar/slots/${artistId}?date=${date}`);
    },

    // Get calendar events for artist
    async getCalendarEvents(artistId, startDate, endDate) {
      return await apiRequest(`/calendar/events/${artistId}?start=${startDate}&end=${endDate}`);
    },

    // Block time slot (mark as unavailable)
    async blockTimeSlot(blockData) {
      return await apiRequest('/calendar/block', {
        method: 'POST',
        body: blockData,
      });
    },

    // Unblock time slot
    async unblockTimeSlot(blockId) {
      return await apiRequest(`/calendar/block/${blockId}`, {
        method: 'DELETE',
      });
    }
  },

  // Service management for artists
  services: {
    // Get artist services
    async getServices(artistId) {
      return await apiRequest(`/services/artist/${artistId}`);
    },

    // Create new service
    async createService(serviceData) {
      return await apiRequest('/services', {
        method: 'POST',
        body: serviceData,
      });
    },

    // Update service
    async updateService(serviceId, serviceData) {
      return await apiRequest(`/services/${serviceId}`, {
        method: 'PUT',
        body: serviceData,
      });
    },

    // Delete service
    async deleteService(serviceId) {
      return await apiRequest(`/services/${serviceId}`, {
        method: 'DELETE',
      });
    },

    // Get service categories
    async getServiceCategories() {
      return await apiRequest('/services/categories');
    }
  },

  // Media management
  media: {
    // Get artist media/gallery
    async getArtistMedia(artistId) {
      return await apiRequest(`/media/artist/${artistId}`);
    },

    // Upload media file
    async uploadMedia(formData) {
      const url = getApiUrl('/media/upload');
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
    },

    // Get specific media item
    async getMediaById(mediaId) {
      return await apiRequest(`/media/${mediaId}`);
    },

    // Update media metadata
    async updateMedia(mediaId, updateData) {
      return await apiRequest(`/media/${mediaId}`, {
        method: 'PUT',
        body: updateData,
      });
    },

    // Delete media
    async deleteMedia(mediaId) {
      return await apiRequest(`/media/${mediaId}`, {
        method: 'DELETE',
      });
    },

    // Like media
    async likeMedia(mediaId) {
      return await apiRequest(`/media/${mediaId}/like`, {
        method: 'POST',
      });
    },

    // Unlike media
    async unlikeMedia(mediaId) {
      return await apiRequest(`/media/${mediaId}/like`, {
        method: 'DELETE',
      });
    },

    // Get media likes
    async getMediaLikes(mediaId) {
      return await apiRequest(`/media/${mediaId}/likes`);
    },

    // Add media view
    async addMediaView(mediaId) {
      return await apiRequest(`/media/${mediaId}/view`, {
        method: 'POST',
      });
    },

    // Get media stats
    async getMediaStats(mediaId) {
      return await apiRequest(`/media/${mediaId}/stats`);
    },

    // Search media
    async searchMedia(query, filters = {}) {
      const params = new URLSearchParams({ query, ...filters });
      return await apiRequest(`/media/search?${params}`);
    },

    // Get featured media
    async getFeaturedMedia() {
      return await apiRequest('/media/featured');
    },

    // Get trending media
    async getTrendingMedia() {
      return await apiRequest('/media/trending');
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

