import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, AlertCircle, X } from 'lucide-react';
import bookingService from '../services/bookingService';

const BookingRequestForm = ({ artistId, artistName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    date: '',
    time: '',
    service: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const services = [
    'Custom Ceramic Piece',
    'Art Consultation',
    'Workshop Session',
    'Portrait Session',
    'Collaborative Project',
    'Art Commission',
    'Private Lesson',
    'Gallery Tour'
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Load available time slots when date changes
  useEffect(() => {
    if (formData.date && artistId) {
      loadAvailableSlots(formData.date);
    }
  }, [formData.date, artistId]);

  const loadAvailableSlots = async (date) => {
    setIsLoadingSlots(true);
    try {
      const response = await bookingService.getAvailability(artistId, date, date);
      const availability = response.availability || {};
      const bookedSlots = response.bookedSlots || {};
      
      const dateSlots = availability[date] || timeSlots;
      const dateBooked = bookedSlots[date] || [];
      
      const available = dateSlots.filter(slot => !dateBooked.includes(slot));
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error loading availability:', error);
      // Fallback to all time slots if API fails
      setAvailableSlots(timeSlots);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = 'Name must be at least 2 characters';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    } else if (availableSlots.length > 0 && !availableSlots.includes(formData.time)) {
      newErrors.time = 'Selected time slot is not available';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide more details (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear time when date changes
    if (name === 'date' && formData.time) {
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        artistId: artistId,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
        dateTime: bookingService.formatDateTime(formData.date, formData.time),
        service: formData.service,
        message: formData.message.trim(),
        status: 'pending'
      };

      await bookingService.createBooking(bookingData);
      
      setShowSuccess(true);
      
      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({
        submit: error.message || 'Failed to submit booking request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-macs-gray-900 mb-2">
            Request Sent Successfully!
          </h3>
          <p className="text-macs-gray-600 mb-4">
            Awaiting artist confirmation. You'll be notified once {artistName} responds to your booking request.
          </p>
          <div className="bg-macs-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-macs-blue-800">
              <strong>Next Steps:</strong><br />
              • Check your email for confirmation<br />
              • Visit "My Bookings" to track status<br />
              • Artist will respond within 24 hours
            </p>
          </div>
          <button
            onClick={() => {
              setShowSuccess(false);
              if (onSuccess) onSuccess();
              if (onClose) onClose();
            }}
            className="btn-primary w-full"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-macs-gray-900">
              Book a Session
            </h2>
            <p className="text-sm text-macs-gray-600 mt-1">
              Request a booking with {artistName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-macs-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-macs-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Booking Failed</p>
                <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-macs-blue-500 ${
                  errors.clientName ? 'border-red-300 bg-red-50' : 'border-macs-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.clientName && (
                <p className="text-sm text-red-600 mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-macs-blue-500 ${
                  errors.clientEmail ? 'border-red-300 bg-red-50' : 'border-macs-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.clientEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.clientEmail}</p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getMinDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-macs-blue-500 ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-macs-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-sm text-red-600 mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Preferred Time *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                disabled={!formData.date || isLoadingSlots}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-macs-blue-500 ${
                  errors.time ? 'border-red-300 bg-red-50' : 'border-macs-gray-300'
                } ${(!formData.date || isLoadingSlots) ? 'bg-macs-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {isLoadingSlots ? 'Loading slots...' : 'Select time'}
                </option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="text-sm text-red-600 mt-1">{errors.time}</p>
              )}
              {formData.date && availableSlots.length === 0 && !isLoadingSlots && (
                <p className="text-sm text-amber-600 mt-1">
                  No available slots for this date. Please select another date.
                </p>
              )}
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              Service Type *
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-macs-blue-500 ${
                errors.service ? 'border-red-300 bg-red-50' : 'border-macs-gray-300'
              }`}
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="text-sm text-red-600 mt-1">{errors.service}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-macs-blue-500 resize-none ${
                errors.message ? 'border-red-300 bg-red-50' : 'border-macs-gray-300'
              }`}
              placeholder="Please describe your project, goals, or any specific requirements..."
            />
            {errors.message && (
              <p className="text-sm text-red-600 mt-1">{errors.message}</p>
            )}
            <p className="text-xs text-macs-gray-500 mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (formData.date && availableSlots.length === 0)}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Request...
                </div>
              ) : (
                'Send Booking Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestForm;

