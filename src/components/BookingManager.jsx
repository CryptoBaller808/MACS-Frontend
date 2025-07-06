import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  X,
  Eye,
  Filter,
  Search,
  Download,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import apiService from '../services/apiService';

const BookingManager = ({ artistId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    revenue: 0
  });

  // Booking status options
  const statusOptions = [
    { value: 'all', label: 'All Bookings', icon: null },
    { value: 'pending', label: 'Pending', icon: AlertCircle, color: 'text-amber-600' },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-green-600' },
    { value: 'completed', label: 'Completed', icon: Check, color: 'text-macs-blue-600' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600' }
  ];

  useEffect(() => {
    loadBookings();
    loadStats();
  }, [artistId]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.booking.getArtistBookings(artistId);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      // Mock data for development
      setBookings([
        {
          id: 1,
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah@example.com',
          clientPhone: '+1 (555) 123-4567',
          serviceType: 'Portrait Session',
          date: '2024-07-15',
          time: '14:00',
          duration: 120,
          price: 150,
          status: 'pending',
          notes: 'Looking for outdoor portrait session with natural lighting. Prefer golden hour timing.',
          createdAt: '2024-07-10T10:30:00Z'
        },
        {
          id: 2,
          clientName: 'Michael Chen',
          clientEmail: 'michael@example.com',
          clientPhone: '+1 (555) 987-6543',
          serviceType: 'Music Collaboration',
          date: '2024-07-18',
          time: '16:00',
          duration: 180,
          price: 200,
          status: 'confirmed',
          notes: 'Collaboration on indie rock track. Need help with guitar arrangements and production.',
          createdAt: '2024-07-08T14:15:00Z'
        },
        {
          id: 3,
          clientName: 'Emma Davis',
          clientEmail: 'emma@example.com',
          clientPhone: '+1 (555) 456-7890',
          serviceType: 'Art Tutoring',
          date: '2024-07-12',
          time: '10:00',
          duration: 60,
          price: 75,
          status: 'completed',
          notes: 'Beginner watercolor techniques. First time working with watercolors.',
          createdAt: '2024-07-05T09:20:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.booking.getBookingStats(artistId);
      setStats(response.data || stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Mock stats for development
      setStats({
        total: 15,
        pending: 3,
        confirmed: 5,
        completed: 7,
        revenue: 2450
      });
    }
  };

  const handleBookingAction = async (bookingId, action, reason = '') => {
    try {
      switch (action) {
        case 'accept':
          await apiService.booking.acceptBooking(bookingId);
          break;
        case 'decline':
          await apiService.booking.declineBooking(bookingId, reason);
          break;
        case 'cancel':
          await apiService.booking.cancelBooking(bookingId, reason);
          break;
        case 'complete':
          await apiService.booking.completeBooking(bookingId);
          break;
      }
      loadBookings();
      loadStats();
      setShowBookingModal(false);
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      // For development, just update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: action === 'accept' ? 'confirmed' : action }
          : booking
      ));
      setShowBookingModal(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (statusOption && statusOption.icon) {
      const Icon = statusOption.icon;
      return <Icon className={`h-4 w-4 ${statusOption.color}`} />;
    }
    return null;
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-macs-blue-100 text-macs-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-macs-gray-100 text-macs-gray-800'}`}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-macs-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-macs-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-macs-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-h2 font-gliker text-macs-gray-900">Booking Management</h2>
        <button className="btn-secondary">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-macs-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-macs-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-macs-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-macs-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-macs-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-macs-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-macs-gray-600">Pending</p>
              <p className="text-2xl font-bold text-macs-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-macs-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-macs-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-macs-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-macs-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-macs-amber-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-macs-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-macs-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-macs-gray-900">${stats.revenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-macs-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-macs-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-macs-blue-600 text-white'
                    : 'bg-macs-gray-100 text-macs-gray-700 hover:bg-macs-gray-200'
                }`}
              >
                {option.icon && (
                  <option.icon className={`h-4 w-4 mr-1 inline ${filter === option.value ? 'text-white' : option.color}`} />
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-macs-md overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-macs-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-macs-gray-900 mb-2">No bookings found</h3>
            <p className="text-macs-gray-600">
              {filter === 'all' 
                ? "You don't have any bookings yet." 
                : `No ${filter} bookings found.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-macs-gray-200">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="p-6 hover:bg-macs-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-macs-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-macs-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-macs-gray-900">
                          {booking.clientName}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-macs-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(booking.time)} ({booking.duration} min)
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${booking.price}
                        </div>
                      </div>
                      
                      <p className="text-sm text-macs-gray-600 mt-1">
                        {booking.serviceType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowBookingModal(true);
                      }}
                      className="p-2 text-macs-gray-400 hover:text-macs-blue-600 hover:bg-macs-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'accept')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'decline')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleBookingAction(booking.id, 'complete')}
                        className="btn-primary text-sm"
                      >
                        Mark Complete
                      </button>
                    )}

                    <button className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-macs-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
              <h3 className="text-h3 text-macs-blue-600 font-gliker">
                Booking Details
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-macs-gray-900">
                  {selectedBooking.serviceType}
                </h4>
                {getStatusBadge(selectedBooking.status)}
              </div>

              {/* Client Information */}
              <div className="bg-macs-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-macs-gray-900 mb-3">Client Information</h5>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-macs-gray-400 mr-3" />
                    <span className="text-macs-gray-900">{selectedBooking.clientName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-macs-gray-400 mr-3" />
                    <span className="text-macs-gray-900">{selectedBooking.clientEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-macs-gray-400 mr-3" />
                    <span className="text-macs-gray-900">{selectedBooking.clientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-macs-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-macs-gray-900 mb-3">Booking Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-macs-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-macs-gray-600">Date</p>
                      <p className="text-macs-gray-900">{formatDate(selectedBooking.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-macs-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-macs-gray-600">Time</p>
                      <p className="text-macs-gray-900">{formatTime(selectedBooking.time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-macs-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-macs-gray-600">Duration</p>
                      <p className="text-macs-gray-900">{selectedBooking.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-macs-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-macs-gray-600">Price</p>
                      <p className="text-macs-gray-900">${selectedBooking.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-macs-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-macs-gray-900 mb-3">Client Notes</h5>
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 text-macs-gray-400 mr-3 mt-1" />
                    <p className="text-macs-gray-700">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-macs-gray-200">
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleBookingAction(selectedBooking.id, 'decline')}
                    className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </button>
                  <button
                    onClick={() => handleBookingAction(selectedBooking.id, 'accept')}
                    className="btn-primary"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept Booking
                  </button>
                </>
              )}

              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => handleBookingAction(selectedBooking.id, 'complete')}
                  className="btn-primary"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark Complete
                </button>
              )}

              <button
                onClick={() => setShowBookingModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;

