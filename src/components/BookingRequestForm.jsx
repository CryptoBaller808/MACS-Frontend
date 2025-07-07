import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle,
  X,
  Loader
} from 'lucide-react';
import bookingService from '../services/bookingService';
import AvailabilityCalendar from './AvailabilityCalendar';

const BookingRequestForm = ({ artistId = '1', artistName = 'Keoni Nakamura', onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    service: '',
    message: '',
    selectedDate: null,
    selectedTime: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [availability, setAvailability] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});

  const services = [
    'Custom Ceramic Piece',
    'Art Consultation',
    'Workshop Session',
    'Portrait Session',
    'Collaborative Project',
    'Art Lessons',
    'Gallery Showing',
    'Other'
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    if (formData.selectedDate) {
      loadAvailabilityForDate();
    }
  }, [formData.selectedDate]);

  const loadAvailabilityForDate = async () => {
    try {
      const dateStr = formData.selectedDate.toISOString().split('T')[0];
      const startDate = dateStr;
      const endDate = dateStr;
      
      const response = await bookingService.getAvailability(artistId, startDate, endDate);
      if (response.success) {
        setAvailability(response.availability || {});
        setBookedSlots(response.bookedSlots || {});
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }

    // Service validation
    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    // Date validation
    if (!formData.selectedDate) {
      newErrors.selectedDate = 'Please select a date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (formData.selectedDate < today) {
        newErrors.selectedDate = 'Please select a future date';
      }
    }

    // Time validation
    if (!formData.selectedTime) {
      newErrors.selectedTime = 'Please select a time';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a brief message about your request';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, selectedDate: date, selectedTime: '' }));
    setShowCalendar(false);
    
    // Clear date and time errors
    setErrors(prev => ({ 
      ...prev, 
      selectedDate: '', 
      selectedTime: '' 
    }));
  };

  const getAvailableTimeSlotsForDate = () => {
    if (!formData.selectedDate) return [];
    
    const dateStr = formData.selectedDate.toISOString().split('T')[0];
    const availableSlots = availability[dateStr] || timeSlots;
    const bookedTimes = bookedSlots[dateStr] || [];
    
    return availableSlots.filter(time => !bookedTimes.includes(time));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the date and time for the API
      const dateTime = bookingService.formatDateTime(formData.selectedDate, formData.selectedTime);
      
      const bookingData = {
        artistId,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
        dateTime,
        service: formData.service,
        message: formData.message.trim()
      };

      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        setShowSuccess(true);
        
        // Reset form after a delay
        setTimeout(() => {
          setFormData({
            clientName: '',
            clientEmail: '',
            service: '',
            message: '',
            selectedDate: null,
            selectedTime: ''
          });
          setShowSuccess(false);
          
          if (onSuccess) {
            onSuccess(response.booking);
          }
        }, 3000);
      } else {
        setErrors({ submit: response.error || 'Failed to create booking request' });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({ submit: error.message || 'Failed to submit booking request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSelectedDate = () => {
    if (!formData.selectedDate) return '';
    return formData.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (showSuccess) {
    return (
      <div className="card-macs p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-h4 text-macs-gray-900 mb-2">Request Sent Successfully!</h3>
        <p className="text-macs-gray-600 mb-4">
          Your booking request has been sent to {artistName}. You'll receive an email confirmation shortly.
        </p>
        <div className="text-sm text-macs-gray-500">
          <strong>What's next?</strong><br />
          The artist will review your request and respond within 24 hours.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-macs p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-macs-teal-600" />
            <h2 className="text-h3 text-macs-gray-900">Book a Session</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-macs-gray-500 hover:text-macs-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-6 p-4 bg-macs-teal-50 rounded-lg">
          <p className="text-sm text-macs-teal-800">
            <strong>Booking with {artistName}</strong><br />
            Fill out the form below to request a booking. The artist will review and respond to your request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-h5 text-macs-gray-900 border-b border-macs-gray-200 pb-2">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className={`input-macs ${errors.clientName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.clientName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  className={`input-macs ${errors.clientEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.clientEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.clientEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              Service Type *
            </label>
            <select
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className={`input-macs ${errors.service ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            {errors.service && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.service}
              </p>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="space-y-4">
            <h3 className="text-h5 text-macs-gray-900 border-b border-macs-gray-200 pb-2">
              Date & Time
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Preferred Date *
                </label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`input-macs text-left ${errors.selectedDate ? 'border-red-500' : ''}`}
                >
                  {formData.selectedDate ? formatSelectedDate() : 'Select a date'}
                </button>
                {errors.selectedDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.selectedDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Preferred Time *
                </label>
                <select
                  value={formData.selectedTime}
                  onChange={(e) => handleInputChange('selectedTime', e.target.value)}
                  className={`input-macs ${errors.selectedTime ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={!formData.selectedDate}
                >
                  <option value="">Select a time</option>
                  {getAvailableTimeSlotsForDate().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.selectedTime && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.selectedTime}
                  </p>
                )}
                {formData.selectedDate && getAvailableTimeSlotsForDate().length === 0 && (
                  <p className="mt-1 text-sm text-macs-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    No available time slots for this date
                  </p>
                )}
              </div>
            </div>

            {/* Calendar */}
            {showCalendar && (
              <div className="mt-4">
                <AvailabilityCalendar
                  artistId={artistId}
                  onDateSelect={handleDateSelect}
                  selectedDate={formData.selectedDate}
                  mode="view"
                />
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className={`input-macs resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Please describe your project or what you'd like to discuss during the session..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </p>
            )}
            <p className="mt-1 text-sm text-macs-gray-500">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Booking Request
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-macs-gray-50 rounded-lg">
          <p className="text-sm text-macs-gray-600">
            <strong>Note:</strong> This is a booking request, not a confirmed appointment. 
            The artist will review your request and respond within 24 hours via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingRequestForm;

