import React, { useState } from 'react';
import { Search, Mail, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import bookingService from '../services/bookingService';

const BookingTracker = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      if (window.showToast) {
        window.showToast('Please enter your email address', 'warning');
      }
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await bookingService.getUserBookings(email);
      
      if (response.success) {
        setBookings(response.bookings || []);
        if (response.bookings.length === 0) {
          if (window.showToast) {
            window.showToast('No bookings found for this email address', 'info');
          }
        } else {
          if (window.showToast) {
            window.showToast(`Found ${response.bookings.length} booking(s)`, 'success');
          }
        }
      } else {
        if (window.showToast) {
          window.showToast('Error searching for bookings. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Error searching bookings:', error);
      if (window.showToast) {
        window.showToast('Error searching for bookings. Please check your connection.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-gliker font-medium";
    
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'declined':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-macs-teal/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-macs-teal to-macs-teal/80 p-6">
          <h2 className="text-2xl font-gliker font-bold text-white mb-2">
            Track Your Bookings
          </h2>
          <p className="text-macs-teal/20 font-gliker">
            Enter your email address to view all your booking requests and their status
          </p>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-macs-teal focus:border-macs-teal font-gliker"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-macs-teal text-white rounded-lg hover:bg-macs-teal/90 disabled:opacity-50 disabled:cursor-not-allowed font-gliker font-medium flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="p-6">
          {hasSearched && !isLoading && (
            <>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-gliker font-medium text-gray-600 mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-500 font-gliker">
                    No booking requests were found for this email address.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-gliker font-bold text-macs-brown mb-4">
                    Your Booking History ({bookings.length} booking{bookings.length !== 1 ? 's' : ''})
                  </h3>
                  
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(booking.status)}
                          <div>
                            <h4 className="font-gliker font-bold text-macs-brown">
                              {booking.service}
                            </h4>
                            <p className="text-sm text-gray-600 font-gliker">
                              Booking ID: {booking.id}
                            </p>
                          </div>
                        </div>
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-macs-teal" />
                          <span className="font-gliker">{formatDate(booking.dateTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-macs-teal" />
                          <span className="font-gliker">{formatTime(booking.dateTime)}</span>
                        </div>
                      </div>

                      {booking.message && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 font-gliker">
                            <strong>Message:</strong> {booking.message}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 font-gliker">
                        Requested: {new Date(booking.createdAt).toLocaleDateString()}
                        {booking.updatedAt !== booking.createdAt && (
                          <span> • Updated: {new Date(booking.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>

                      {booking.status === 'pending' && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800 font-gliker">
                            ⏳ Waiting for artist confirmation. You'll be notified once the artist responds.
                          </p>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-gliker">
                            ✅ Your booking is confirmed! The artist will contact you with further details.
                          </p>
                        </div>
                      )}

                      {booking.status === 'declined' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800 font-gliker">
                            ❌ This booking was declined. You can try booking a different time slot.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTracker;

