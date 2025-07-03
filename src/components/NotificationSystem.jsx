import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Bell, 
  DollarSign,
  Calendar,
  Target,
  Award,
  Heart,
  Users,
  Zap,
  Clock,
  ExternalLink,
  Trash2,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show as toast if it's important
    if (notification.showToast !== false) {
      addToast(newNotification);
    }
  };

  const addToast = (toast) => {
    const newToast = {
      id: Date.now() + Math.random(),
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(newToast.id);
    }, newToast.duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      toasts,
      unreadCount,
      addNotification,
      addToast,
      removeToast,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications
    }}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Individual Toast Component
const ToastNotification = ({ toast, onClose }) => {
  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-white border-gray-200 text-gray-800';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 shadow-lg animate-in slide-in-from-right-full ${getToastStyles(toast.type)}`}>
      <div className="flex items-start gap-3">
        {getIcon(toast.type)}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
          )}
          {toast.action && (
            <Button size="sm" variant="outline" className="mt-2" onClick={toast.action.onClick}>
              {toast.action.label}
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

// Notification Dropdown Component
const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const recentNotifications = notifications.slice(0, 5);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'booking':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'campaign':
        return <Target className="h-4 w-4 text-purple-500" />;
      case 'nft':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'social':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'system':
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Card className="w-80 border-0 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm">We'll notify you when something happens!</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      
                      {notification.action && (
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {notifications.length > 5 && (
          <div className="p-3 border-t bg-gray-50">
            <Button variant="ghost" size="sm" className="w-full">
              View all notifications
            </Button>
          </div>
        )}
        
        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="w-full text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Demo Component to test notifications
export const NotificationDemo = () => {
  const { addNotification } = useNotifications();

  const demoNotifications = [
    {
      type: 'success',
      category: 'payment',
      title: 'Payment Received',
      message: 'You received 450 MACS from Sarah Chen for "Ocean Dreams #3"',
      action: { label: 'View Transaction', onClick: () => console.log('View transaction') }
    },
    {
      type: 'info',
      category: 'booking',
      title: 'New Booking Request',
      message: 'Marcus Johnson wants to book you for an album cover design',
      action: { label: 'View Booking', onClick: () => console.log('View booking') }
    },
    {
      type: 'success',
      category: 'campaign',
      title: 'Campaign Milestone',
      message: 'Your "Ocean Dreams Collection" reached 50% funding!',
      action: { label: 'View Campaign', onClick: () => console.log('View campaign') }
    },
    {
      type: 'warning',
      category: 'booking',
      title: 'Booking Deadline',
      message: 'Album cover design is due in 2 days',
      action: { label: 'View Details', onClick: () => console.log('View details') }
    },
    {
      type: 'info',
      category: 'social',
      title: 'New Follower',
      message: 'Luna Rodriguez started following you',
      action: { label: 'View Profile', onClick: () => console.log('View profile') }
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Notification System Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {demoNotifications.map((notification, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => addNotification(notification)}
              className="justify-start"
            >
              {notification.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;

