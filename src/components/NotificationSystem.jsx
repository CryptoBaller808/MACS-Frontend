import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Check,
  X,
  Calendar,
  Clock,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  Settings,
  Filter,
  MoreHorizontal,
  Trash2,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const NotificationSystem = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Notification types and their configurations
  const notificationTypes = {
    booking_request: {
      icon: Calendar,
      color: 'text-macs-blue-600',
      bgColor: 'bg-macs-blue-100',
      title: 'New Booking Request'
    },
    booking_confirmed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'Booking Confirmed'
    },
    booking_cancelled: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      title: 'Booking Cancelled'
    },
    booking_completed: {
      icon: Check,
      color: 'text-macs-blue-600',
      bgColor: 'bg-macs-blue-100',
      title: 'Booking Completed'
    },
    payment_received: {
      icon: DollarSign,
      color: 'text-macs-amber-600',
      bgColor: 'bg-macs-amber-100',
      title: 'Payment Received'
    },
    review_received: {
      icon: Star,
      color: 'text-macs-amber-600',
      bgColor: 'bg-macs-amber-100',
      title: 'New Review'
    },
    message_received: {
      icon: MessageSquare,
      color: 'text-macs-blue-600',
      bgColor: 'bg-macs-blue-100',
      title: 'New Message'
    },
    reminder: {
      icon: Clock,
      color: 'text-macs-gray-600',
      bgColor: 'bg-macs-gray-100',
      title: 'Reminder'
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'booking', label: 'Bookings' },
    { value: 'payment', label: 'Payments' },
    { value: 'review', label: 'Reviews' },
    { value: 'message', label: 'Messages' }
  ];

  useEffect(() => {
    loadNotifications();
    // Set up polling for new notifications
    const interval = setInterval(loadNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // const response = await apiService.notifications.getNotifications();
      // setNotifications(response.data || []);
      
      // Mock notifications for development
      const mockNotifications = [
        {
          id: 1,
          type: 'booking_request',
          title: 'New Booking Request',
          message: 'Sarah Johnson wants to book a Portrait Session on July 15th at 2:00 PM',
          data: {
            clientName: 'Sarah Johnson',
            serviceType: 'Portrait Session',
            date: '2024-07-15',
            time: '14:00',
            price: 150
          },
          read: false,
          createdAt: '2024-07-10T10:30:00Z'
        },
        {
          id: 2,
          type: 'booking_confirmed',
          title: 'Booking Confirmed',
          message: 'Your booking with Michael Chen for Music Collaboration has been confirmed',
          data: {
            clientName: 'Michael Chen',
            serviceType: 'Music Collaboration',
            date: '2024-07-18',
            time: '16:00'
          },
          read: false,
          createdAt: '2024-07-09T15:45:00Z'
        },
        {
          id: 3,
          type: 'payment_received',
          title: 'Payment Received',
          message: 'Payment of $75 received for Art Tutoring session with Emma Davis',
          data: {
            amount: 75,
            clientName: 'Emma Davis',
            serviceType: 'Art Tutoring'
          },
          read: true,
          createdAt: '2024-07-08T09:20:00Z'
        },
        {
          id: 4,
          type: 'review_received',
          title: 'New Review',
          message: 'Emma Davis left a 5-star review for your Art Tutoring session',
          data: {
            rating: 5,
            clientName: 'Emma Davis',
            serviceType: 'Art Tutoring',
            review: 'Amazing session! Learned so much about watercolor techniques.'
          },
          read: true,
          createdAt: '2024-07-07T14:30:00Z'
        },
        {
          id: 5,
          type: 'reminder',
          title: 'Upcoming Session',
          message: 'You have a Portrait Session with Sarah Johnson tomorrow at 2:00 PM',
          data: {
            clientName: 'Sarah Johnson',
            serviceType: 'Portrait Session',
            date: '2024-07-15',
            time: '14:00'
          },
          read: false,
          createdAt: '2024-07-14T09:00:00Z'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // await apiService.notifications.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // await apiService.notifications.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // await apiService.notifications.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle different notification types
    switch (notification.type) {
      case 'booking_request':
        // Navigate to booking management
        window.location.href = '/dashboard?tab=bookings';
        break;
      case 'booking_confirmed':
      case 'booking_cancelled':
      case 'booking_completed':
        // Navigate to specific booking
        window.location.href = `/dashboard?tab=bookings&booking=${notification.data.bookingId}`;
        break;
      case 'message_received':
        // Navigate to messages
        window.location.href = '/dashboard?tab=messages';
        break;
      default:
        // Default action
        break;
    }
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      switch (filter) {
        case 'unread':
          return !notification.read;
        case 'booking':
          return notification.type.includes('booking');
        case 'payment':
          return notification.type.includes('payment');
        case 'review':
          return notification.type.includes('review');
        case 'message':
          return notification.type.includes('message');
        default:
          return true;
      }
    });
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-macs-gray-600 hover:text-macs-blue-600 hover:bg-macs-blue-50 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-macs-xl border border-macs-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-macs-gray-200">
            <h3 className="text-lg font-semibold text-macs-gray-900">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-macs-blue-600 hover:text-macs-blue-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1 text-macs-gray-400 hover:text-macs-gray-600 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 p-2 border-b border-macs-gray-200 overflow-x-auto">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === option.value
                    ? 'bg-macs-blue-600 text-white'
                    : 'text-macs-gray-600 hover:bg-macs-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-start space-x-3">
                    <div className="w-10 h-10 bg-macs-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-macs-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-macs-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-macs-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-macs-gray-900 mb-2">
                  No notifications
                </h4>
                <p className="text-macs-gray-600">
                  {filter === 'all' 
                    ? "You're all caught up!" 
                    : `No ${filter} notifications found.`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-macs-gray-100">
                {filteredNotifications.map(notification => {
                  const config = notificationTypes[notification.type] || notificationTypes.reminder;
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-macs-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-macs-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-macs-gray-900' : 'text-macs-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-macs-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-macs-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-macs-gray-600 mb-2">
                            {notification.message}
                          </p>
                          
                          {/* Notification Data */}
                          {notification.data && (
                            <div className="flex items-center space-x-4 text-xs text-macs-gray-500">
                              {notification.data.clientName && (
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {notification.data.clientName}
                                </div>
                              )}
                              {notification.data.date && (
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(notification.data.date).toLocaleDateString()}
                                </div>
                              )}
                              {notification.data.price && (
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  ${notification.data.price}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-macs-gray-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-macs-gray-200">
            <button
              onClick={() => {
                setShowDropdown(false);
                window.location.href = '/dashboard?tab=notifications';
              }}
              className="w-full text-center text-sm text-macs-blue-600 hover:text-macs-blue-700 font-medium"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

// Notification Toast Component
export const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    booking_request: {
      icon: Calendar,
      color: 'text-macs-blue-600',
      bgColor: 'bg-macs-blue-100',
      borderColor: 'border-macs-blue-200'
    },
    booking_confirmed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    booking_cancelled: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    },
    payment_received: {
      icon: DollarSign,
      color: 'text-macs-amber-600',
      bgColor: 'bg-macs-amber-100',
      borderColor: 'border-macs-amber-200'
    }
  }[notification.type] || {
    icon: Bell,
    color: 'text-macs-gray-600',
    bgColor: 'bg-macs-gray-100',
    borderColor: 'border-macs-gray-200'
  };

  const Icon = config.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`bg-white rounded-lg shadow-macs-lg border-l-4 ${config.borderColor} p-4 max-w-sm`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-macs-gray-900 mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-macs-gray-600">
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1 text-macs-gray-400 hover:text-macs-gray-600 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;

