import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          className: 'bg-green-50 border-green-200 text-green-800',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          icon: XCircle,
          className: 'bg-red-50 border-red-200 text-red-800',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          className: 'bg-macs-amber-50 border-macs-amber-200 text-macs-amber-800',
          iconColor: 'text-macs-amber-600'
        };
      default:
        return {
          icon: Info,
          className: 'bg-macs-teal-50 border-macs-teal-200 text-macs-teal-800',
          iconColor: 'text-macs-teal-600'
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${config.className} border rounded-lg p-4 shadow-lg font-gliker`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Manager Component
const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export { ToastNotification, ToastManager };
export default ToastNotification;

