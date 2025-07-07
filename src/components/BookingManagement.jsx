import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, Search, Filter, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import bookingService from '../services/bookingService';

const BookingManagement = ({ artistId = '1' }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    declined: 0
  });
  const [processingBookings, setProcessingBookings] = useState(new Set());
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [artistId]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingService.getBookings({ artistId });
      
      if (response.success) {
        setBookings(response.bookings || []);
        calculateStats(response.bookings || []);
      } else {
        // Fallback to mock data
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

  const calculateStats = (bookingList) => {
    const stats = {
      total: bookingList.length,
      pending: bookingList.filter(b => b.status === 'pending').length,
      confirmed: bookingList.filter(b => b.status === 'confirmed').length,
      completed: bookingList.filter(b => b.status === 'completed').length,
      declined: bookingList.filter(b => b.status === 'declined').length
    };
    setStats(stats);
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
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
    if (processingBookings.has(bookingId)) return;

    setProcessingBookings(prev => new Set(prev).add(bookingId));

    try {
      const response = await bookingService.confirmBooking(bookingId, action);
      
      if (response.success) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: response.booking.status, updatedAt: response.booking.updatedAt }
            : booking
        ));

        // Show success notification
        setNotification({
          type: 'success',
          message: `Booking ${action === 'accept' ? 'accepted' : 'declined'} successfully!`
        });

        // Auto-hide notification
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error(response.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to update booking. Please try again.'
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setProcessingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-macs-gray-100 text-macs-gray-800 border-macs-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'declined':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-macs-blue-600"></div>
        <span className="ml-3 text-macs-gray-600">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-macs-gray-200 p-4">
          <div className="text-2xl font-bold text-macs-gray-900">{stats.total}</div>
          <div className="text-sm text-macs-gray-600">Total Bookings</div>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
          <div className="text-2xl font-bold text-amber-800">{stats.pending}</div>
          <div className="text-sm text-amber-700">Pending</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-2xl font-bold text-green-800">{stats.confirmed}</div>
          <div className="text-sm text-green-700">Confirmed</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-2xl font-bold text-blue-800">{stats.completed}</div>
          <div className="text-sm text-blue-700">Completed</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-2xl font-bold text-red-800">{stats.declined}</div>
          <div className="text-sm text-red-700">Declined</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-macs-gray-900 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-macs-blue-600" />
          Booking Management
        </h2>
        <button
          onClick={loadBookings}
          disabled={isLoading}
          className="btn-ghost flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-macs-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-macs-gray-400" />
              <input
                type="text"
                placeholder="Search by client name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-macs-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-macs-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: `All (${stats.total})`, color: 'bg-macs-gray-100 text-macs-gray-800' },
              { key: 'pending', label: `Pending (${stats.pending})`, color: 'bg-amber-100 text-amber-800' },
              { key: 'confirmed', label: `Confirmed (${stats.confirmed})`, color: 'bg-green-100 text-green-800' },
              { key: 'completed', label: `Completed (${stats.completed})`, color: 'bg-blue-100 text-blue-800' },
              { key: 'declined', label: `Declined (${stats.declined})`, color: 'bg-red-100 text-red-800' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === filter.key
                    ? filter.color
                    : 'bg-macs-gray-100 text-macs-gray-600 hover:bg-macs-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-macs-gray-200">
            <Calendar className="w-12 h-12 text-macs-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-macs-gray-900 mb-2">No bookings found</h3>
            <p className="text-macs-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any booking requests yet.'}
            </p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg border border-macs-gray-200 p-6">
              <div className="flex items-start justify-between">
                {/* Client Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-macs-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-macs-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-macs-gray-900">
                        {booking.clientName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-macs-gray-600 mb-2">
                      <Mail className="w-4 h-4 mr-2" />
                      {booking.clientEmail}
                    </div>
                    <div className="flex items-center text-sm text-macs-gray-600 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(booking.dateTime)}
                    </div>
                    <div className="flex items-center text-sm text-macs-gray-600 mb-3">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(booking.dateTime)}
                    </div>
                    <div className="bg-macs-blue-50 rounded-lg p-3 mb-3">
                      <div className="text-sm font-medium text-macs-blue-900 mb-1">
                        Service: {booking.service}
                      </div>
                      <div className="text-sm text-macs-blue-800">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        {booking.message}
                      </div>
                    </div>
                    <div className="text-xs text-macs-gray-500">
                      Requested: {new Date(booking.createdAt).toLocaleDateString()}
                      {booking.updatedAt !== booking.createdAt && (
                        <span> • Updated: {new Date(booking.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {booking.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleBookingAction(booking.id, 'decline')}
                      disabled={processingBookings.has(booking.id)}
                      className="btn-ghost text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingBookings.has(booking.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleBookingAction(booking.id, 'accept')}
                      disabled={processingBookings.has(booking.id)}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingBookings.has(booking.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </>
                      )}
                    </button>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="ml-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Confirmed - Upcoming</span>
                      </div>
                    </div>
                  </div>
                )}

                {booking.status === 'declined' && (
                  <div className="ml-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <div className="flex items-center text-red-800">
                        <XCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Declined</span>
                      </div>
                    </div>
                  </div>
                )}

                {booking.status === 'completed' && (
                  <div className="ml-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <div className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingManagement;

