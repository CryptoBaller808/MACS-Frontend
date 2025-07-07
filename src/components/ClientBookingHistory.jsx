import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import bookingService from '../services/bookingService';

const ClientBookingHistory = ({ clientEmail }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (clientEmail) {
      fetchBookings();
    }
  }, [clientEmail]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, we'll use mock data since we don't have user authentication
      // In a real app, this would fetch based on the authenticated user
      const mockBookings = [
        {
          id: '1',
          artistId: '1',
          artistName: 'Keoni Nakamura',
          artistAvatar: '/api/placeholder/40/40',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah.johnson@email.com',
          dateTime: '2025-07-15T10:00:00Z',
          service: 'Custom Ceramic Piece',
          message: 'I would like to commission a traditional ceramic vase with blue and orange patterns.',
          status: 'pending',
          createdAt: '2025-07-10T14:30:00Z',
          updatedAt: '2025-07-10T14:30:00Z'
        },
        {
          id: '2',
          artistId: '1',
          artistName: 'Keoni Nakamura',
          artistAvatar: '/api/placeholder/40/40',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah.johnson@email.com',
          dateTime: '2025-07-18T14:00:00Z',
          service: 'Art Consultation',
          message: 'Looking for guidance on starting my own ceramic art journey.',
          status: 'confirmed',
          createdAt: '2025-07-08T09:15:00Z',
          updatedAt: '2025-07-09T11:20:00Z'
        },
        {
          id: '3',
          artistId: '1',
          artistName: 'Keoni Nakamura',
          artistAvatar: '/api/placeholder/40/40',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah.johnson@email.com',
          dateTime: '2025-07-05T16:00:00Z',
          service: 'Workshop Session',
          message: 'Interested in learning traditional pottery techniques.',
          status: 'completed',
          createdAt: '2025-07-01T12:00:00Z',
          updatedAt: '2025-07-05T18:30:00Z'
        },
        {
          id: '4',
          artistId: '1',
          artistName: 'Keoni Nakamura',
          artistAvatar: '/api/placeholder/40/40',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah.johnson@email.com',
          dateTime: '2025-06-28T11:00:00Z',
          service: 'Portrait Session',
          message: 'Professional headshots for my business profile.',
          status: 'declined',
          createdAt: '2025-06-25T15:45:00Z',
          updatedAt: '2025-06-26T09:15:00Z'
        }
      ];
      
      setBookings(mockBookings);
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getFilterCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      declined: bookings.filter(b => b.status === 'declined').length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-amber-500" />
          My Bookings
        </h2>
        <button
          onClick={fetchBookings}
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
          { key: 'completed', label: 'Completed', count: counts.completed },
          { key: 'declined', label: 'Declined', count: counts.declined },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You haven't made any booking requests yet." 
              : `No ${filter} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const { date, time } = formatDateTime(booking.dateTime);
            
            return (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={booking.artistAvatar}
                      alt={booking.artistName}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.artistName}</h3>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                    </div>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{time}</span>
                  </div>
                </div>

                {booking.message && (
                  <div className="mb-4">
                    <div className="flex items-start text-gray-600">
                      <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{booking.message}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Requested: {new Date(booking.createdAt).toLocaleDateString()}</span>
                  {booking.updatedAt !== booking.createdAt && (
                    <span>Updated: {new Date(booking.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Action buttons based on status */}
                {booking.status === 'confirmed' && new Date(booking.dateTime) > new Date() && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                      ✅ Your booking is confirmed! The artist will contact you with further details.
                    </p>
                  </div>
                )}

                {booking.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                      ⏳ Waiting for artist confirmation. You'll be notified once the artist responds.
                    </p>
                  </div>
                )}

                {booking.status === 'declined' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                      ❌ This booking was declined. You can try booking a different time slot.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientBookingHistory;

