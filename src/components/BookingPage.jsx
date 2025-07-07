import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, AlertCircle, X, ArrowLeft } from 'lucide-react';
import AvailabilityCalendar from './AvailabilityCalendar';
import bookingService from '../services/bookingService';

const BookingPage = ({ artistId, artistName, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Calendar, 2: Form
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    service: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleDateSelect = (date, slots) => {
    setSelectedDate(date);
    setAvailableSlots(slots);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(2);
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }

    if (!selectedTime) {
      newErrors.time = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        dateTime: bookingService.formatDateTime(selectedDate, selectedTime),
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

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
          <div className="flex items-center">
            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="p-2 hover:bg-macs-gray-100 rounded-lg transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-macs-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-macs-gray-900">
                Book a Session with {artistName}
              </h2>
              <p className="text-sm text-macs-gray-600 mt-1">
                {currentStep === 1 ? 'Step 1: Select Date & Time' : 'Step 2: Booking Details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-macs-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-macs-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-macs-gray-50">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-macs-blue-600 text-white' : 'bg-macs-gray-300 text-macs-gray-600'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`flex-1 h-1 mx-4 ${
              currentStep >= 2 ? 'bg-macs-blue-600' : 'bg-macs-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-macs-blue-600 text-white' : 'bg-macs-gray-300 text-macs-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? 'text-macs-blue-600 font-medium' : 'text-macs-gray-600'}>
              Select Date & Time
            </span>
            <span className={currentStep >= 2 ? 'text-macs-blue-600 font-medium' : 'text-macs-gray-600'}>
              Booking Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 ? (
            <div className="space-y-6">
              {/* Calendar */}
              <AvailabilityCalendar
                artistId={artistId}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                mode="booking"
              />

              {/* Time Slot Selection */}
              {selectedDate && availableSlots.length > 0 && (
                <div className="bg-macs-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-macs-gray-900 mb-4">
                    Available Times for {formatDate(selectedDate)}
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => handleTimeSelect(slot)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          selectedTime === slot
                            ? 'border-macs-blue-600 bg-macs-blue-100 text-macs-blue-800'
                            : 'border-macs-gray-200 bg-white hover:border-macs-blue-300 hover:bg-macs-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="font-medium">{slot}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && availableSlots.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">No Available Times</h3>
                  <p className="text-amber-700">
                    This date is fully booked. Please select another date.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Date & Time Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Selected Appointment</h3>
                <div className="flex items-center text-green-700">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="mr-4">{formatDate(selectedDate)}</span>
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{selectedTime}</span>
                </div>
              </div>

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
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 btn-ghost"
                  disabled={isSubmitting}
                >
                  Back to Calendar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

