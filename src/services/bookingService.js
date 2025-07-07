// Booking Service for MACS Platform
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://5001-ipwxlbr9tv9s4h2xkej3y-d6ef6919.manusvm.computer' 
  : 'http://localhost:5001';

class BookingService {
  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookings(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.artistId) queryParams.append('artistId', filters.artistId);
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.clientEmail) queryParams.append('clientEmail', filters.clientEmail);
      if (filters.status) queryParams.append('status', filters.status);

      const response = await fetch(`${API_BASE_URL}/api/v1/bookings?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async confirmBooking(bookingId, action) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  }

  async getBookingById(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async getAvailability(artistId, startDate = null, endDate = null) {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/availability/${artistId}?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  }

  // Client booking history
  async getClientBookings(clientEmail) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('clientEmail', clientEmail);

      const response = await fetch(`${API_BASE_URL}/api/v1/bookings?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client bookings:', error);
      throw error;
    }
  }

  // Get booking statistics for artists
  async getBookingStats(artistId) {
    try {
      const response = await this.getBookings({ artistId });
      const bookings = response.bookings || [];
      
      const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        declined: bookings.filter(b => b.status === 'declined').length,
        completed: bookings.filter(b => b.status === 'completed').length,
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }

  // Check availability for specific time slot
  async checkAvailability(artistId, dateTime) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artistId, dateTime }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  // Utility method to check if a time slot is available
  isTimeSlotAvailable(dateTime, bookedSlots) {
    return !bookedSlots.includes(dateTime);
  }

  // Format date for API calls
  formatDateTime(date, time) {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    return `${dateStr}T${time}:00Z`;
  }

  // Parse API date format
  parseDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return {
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0].substring(0, 5)
    };
  }

  // Mock data fallback for development
  getMockBookings() {
    return {
      success: true,
      bookings: [
        {
          id: '1',
          artistId: '1',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah.johnson@email.com',
          dateTime: '2025-07-15T10:00:00Z',
          service: 'Custom Ceramic Piece',
          message: 'I would like to schedule a professional portrait session for my LinkedIn profile.',
          status: 'pending',
          createdAt: '2025-07-10T14:30:00Z',
          updatedAt: '2025-07-10T14:30:00Z'
        },
        {
          id: '2',
          artistId: '1',
          clientName: 'Michael Chen',
          clientEmail: 'michael.chen@email.com',
          dateTime: '2025-07-18T14:00:00Z',
          service: 'Art Consultation',
          message: 'Looking forward to collaborating on a mixed media piece.',
          status: 'confirmed',
          createdAt: '2025-07-08T09:15:00Z',
          updatedAt: '2025-07-08T09:15:00Z'
        },
        {
          id: '3',
          artistId: '1',
          clientName: 'Emma Davis',
          clientEmail: 'emma.davis@email.com',
          dateTime: '2025-07-12T16:00:00Z',
          service: 'Workshop Session',
          message: 'I\'m a beginner and would love to learn basic watercolor techniques.',
          status: 'completed',
          createdAt: '2025-07-05T11:20:00Z',
          updatedAt: '2025-07-05T11:20:00Z'
        }
      ],
      total: 3
    };
  }

  getMockAvailability() {
    return {
      success: true,
      availability: {
        '2025-07-15': ['09:00', '11:00', '13:00', '15:00'],
        '2025-07-16': ['10:00', '12:00', '14:00', '16:00'],
        '2025-07-17': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        '2025-07-18': ['13:00', '14:00', '15:00', '16:00'],
        '2025-07-19': ['09:00', '11:00', '13:00'],
        '2025-07-22': ['10:00', '11:00', '12:00', '15:00', '16:00'],
        '2025-07-23': ['09:00', '10:00', '14:00', '15:00'],
        '2025-07-24': ['11:00', '12:00', '13:00', '16:00'],
        '2025-07-25': ['09:00', '10:00', '11:00', '14:00'],
        '2025-07-26': ['13:00', '14:00', '15:00', '16:00']
      },
      bookedSlots: {
        '2025-07-15': ['10:00'],
        '2025-07-18': ['14:00'],
        '2025-07-12': ['16:00']
      }
    };
  }
}

export default new BookingService();

