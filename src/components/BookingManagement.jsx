import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Mail, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  MoreVertical
} from 'lucide-react';
import bookingService from '../services/bookingService';

const BookingManagement = ({ artistId = '1' }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    declined: 0
  });
  const [actionLoading, setActionLoading] = useState({});

  const filters = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
    { id: 'completed', label: 'Completed', count: stats.completed },
    { id: 'declined', label: 'Declined', count: stats.declined }
  ];

  useEffect(() => {
    loadBookings();
  }, [artistId]);

  useEffect(() => {
    filterBookings();
  }, [bookings, activeFilter, searchTerm]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingService.getBookings({ artistId });
      if (response.success) {
        setBookings(response.bookings || []);
        calculateStats(response.bookings || []);
      } else {
        // Fallback to mock data for demo
        const mockData = bookingService.getMockBookings();
        setBookings(mockData.bookings);
        calculateStats(mockData.bookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      // Fallback to mock data
      const mockData = bookingService.getMockBookings();
      setBookings(mockData.bookings);
      calculateStats(mockData.bookings);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (bookingsList) => {
    const newStats = {
      total: bookingsList.length,
      pending: bookingsList.filter(b => b.status === 'pending').length,
      confirmed: bookingsList.filter(b => b.status === 'confirmed').length,
      completed: bookingsList.filter(b => b.status === 'completed').length,
      declined: bookingsList.filter(b => b.status === 'declined').length
    };
    setStats(newStats);
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.clientName.toLowerCase().includes(term) ||
        booking.clientEmail.toLowerCase().includes(term) ||
        booking.service.toLowerCase().includes(term) ||
        booking.message.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleBookingAction = async (bookingId, action) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: action }));
    
    try {
      const response = await bookingService.confirmBooking(bookingId, action);
      
      if (response.success) {
        // Update the booking in the local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: response.booking.status, updatedAt: response.booking.updatedAt }
            : booking
        ));
        
        // Show success message with toast notification
        if (window.showToast) {
          window.showToast(
            `Booking ${action === 'accept' ? 'confirmed' : 'declined'} successfully!`,
            'success'
          );
        }
      } else {
        if (window.showToast) {
          window.showToast('Failed to update booking. Please try again.', 'error');
        }
        console.error('Failed to update booking:', response.error);
      }
    } catch (error) {
      if (window.showToast) {
        window.showToast('Error updating booking. Please check your connection.', 'error');
      }
      console.error('Error updating booking:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: null }));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        className: 'badge-warning',
        icon: AlertCircle,
        text: 'Pending'
      },
      confirmed: {
        className: 'badge-success',
        icon: CheckCircle,
        text: 'Confirmed'
      },
      completed: {
        className: 'badge-info',
        icon: CheckCircle,
        text: 'Completed'
      },
      declined: {
        className: 'badge-error',
        icon: XCircle,
        text: 'Declined'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`${config.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getTimeUntilBooking = (dateTimeString) => {
    const bookingDate = new Date(dateTimeString);
    const now = new Date();
    const diffMs = bookingDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-macs-teal-600" />
          <h2 className="text-h3 text-macs-gray-900">Booking Management</h2>
        </div>
        <button
          onClick={loadBookings}
          disabled={isLoading}
          className="btn-outline flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className={`card-macs p-4 cursor-pointer transition-all duration-200 ${
              activeFilter === filter.id 
                ? 'ring-2 ring-macs-teal-500 bg-macs-teal-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-macs-gray-900 mb-1">
                {filter.count}
              </div>
              <div className="text-sm text-macs-gray-600">
                {filter.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card-macs p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-macs-gray-400" />
            <input
              type="text"
              placeholder="Search by client name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-macs pl-10"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-macs-teal-600 text-white'
                    : 'bg-macs-gray-100 text-macs-gray-700 hover:bg-macs-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner w-8 h-8"></div>
            <span className="ml-3 text-macs-gray-600">Loading bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card-macs p-8 text-center">
            <Calendar className="w-12 h-12 text-macs-gray-400 mx-auto mb-4" />
            <h3 className="text-h5 text-macs-gray-900 mb-2">No bookings found</h3>
            <p className="text-macs-gray-600">
              {activeFilter === 'all' 
                ? "You don't have any bookings yet." 
                : `No ${activeFilter} bookings found.`}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const { date, time } = formatDateTime(booking.dateTime);
            const timeUntil = getTimeUntilBooking(booking.dateTime);
            const isActionLoading = actionLoading[booking.id];

            return (
              <div key={booking.id} className="card-macs p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-macs-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-macs-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-h5 text-macs-gray-900">{booking.clientName}</h3>
                          <div className="flex items-center gap-2 text-sm text-macs-gray-600">
                            <Mail className="w-4 h-4" />
                            {booking.clientEmail}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-macs-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-macs-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{time} • {timeUntil}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-macs-gray-900">
                        Service: {booking.service}
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-macs-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-macs-gray-600 line-clamp-2">
                          {booking.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleBookingAction(booking.id, 'decline')}
                        disabled={isActionLoading}
                        className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                      >
                        {isActionLoading === 'decline' ? (
                          <div className="spinner w-4 h-4"></div>
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Decline
                      </button>
                      <button
                        onClick={() => handleBookingAction(booking.id, 'accept')}
                        disabled={isActionLoading}
                        className="btn-primary flex items-center gap-2"
                      >
                        {isActionLoading === 'accept' ? (
                          <div className="spinner w-4 h-4"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Accept
                      </button>
                    </div>
                  )}

                  {booking.status !== 'pending' && (
                    <div className="flex items-center gap-2 text-sm text-macs-gray-500">
                      <Clock className="w-4 h-4" />
                      Updated {new Date(booking.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      {filteredBookings.length > 0 && (
        <div className="card-macs p-4 bg-macs-gray-50">
          <div className="text-center text-sm text-macs-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

