import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, AlertCircle, X, ArrowLeft, ArrowRight } from 'lucide-react';
import AvailabilityCalendar from './AvailabilityCalendar';
import bookingService from '../services/bookingService';

const BookingFlow = ({ artistId, artistName, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
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
    { id: 'ceramic', name: 'Custom Ceramic Piece', duration: '2-3 hours', price: '150 MACS' },
    { id: 'consultation', name: 'Art Consultation', duration: '1 hour', price: '75 MACS' },
    { id: 'workshop', name: 'Workshop Session', duration: '3-4 hours', price: '200 MACS' },
    { id: 'portrait', name: 'Portrait Session', duration: '2 hours', price: '120 MACS' },
    { id: 'collaboration', name: 'Collaborative Project', duration: '4-6 hours', price: '300 MACS' },
    { id: 'commission', name: 'Art Commission', duration: 'Variable', price: 'Quote' },
    { id: 'lesson', name: 'Private Lesson', duration: '1.5 hours', price: '90 MACS' },
    { id: 'tour', name: 'Gallery Tour', duration: '1 hour', price: '50 MACS' }
  ];

  const steps = [
    { id: 1, title: 'Select Date', description: 'Choose your preferred date' },
    { id: 2, title: 'Choose Time', description: 'Pick an available time slot' },
    { id: 3, title: 'Service Details', description: 'Select service and provide details' },
    { id: 4, title: 'Confirmation', description: 'Review and submit your request' }
  ];

  const handleDateSelect = (date, slots) => {
    setSelectedDate(date);
    setAvailableSlots(slots);
    setSelectedTime('');
    if (slots.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(3);
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 3) {
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

      if (!formData.service) {
        newErrors.service = 'Please select a service';
      }

      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'Please provide more details (at least 10 characters)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3 && !validateStep(3)) {
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        artistId: artistId,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
        dateTime: bookingService.formatDateTime(selectedDate.toISOString().split('T')[0], selectedTime),
        service: formData.service,
        message: formData.message.trim(),
        status: 'pending'
      };

      await bookingService.createBooking(bookingData);
      
      setShowSuccess(true);
      
      // Auto-close success message after 4 seconds
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 4000);

    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({
        submit: error.message || 'Failed to submit booking request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedService = () => {
    return services.find(s => s.id === formData.service);
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
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 font-gliker">
            Request Sent Successfully!
          </h3>
          <p className="text-gray-600 mb-6 font-gliker">
            Awaiting artist confirmation. You'll be notified once {artistName} responds to your booking request.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 font-gliker">Next Steps:</h4>
            <ul className="text-sm text-blue-800 space-y-1 font-gliker">
              <li>• Check your email for confirmation</li>
              <li>• Visit "My Bookings" to track status</li>
              <li>• Artist will respond within 24 hours</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2 font-gliker">Booking Summary:</h4>
            <div className="text-sm text-gray-600 space-y-1 font-gliker">
              <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Service:</strong> {getSelectedService()?.name}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowSuccess(false);
              if (onSuccess) onSuccess();
              if (onClose) onClose();
            }}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-gliker font-medium"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-gliker">
              Book a Session with {artistName}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-gliker">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-gliker
                  ${currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium font-gliker ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 font-gliker">Booking Failed</p>
                <p className="text-sm text-red-700 mt-1 font-gliker">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-gliker">
                Select Your Preferred Date
              </h3>
              <AvailabilityCalendar
                artistId={artistId}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                mode="booking"
              />
            </div>
          )}

          {/* Step 2: Time Selection */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-gliker">
                Choose Your Time Slot
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-blue-800 font-gliker">
                  <strong>Selected Date:</strong> {formatDate(selectedDate)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => handleTimeSelect(slot)}
                    className={`
                      p-4 rounded-lg border transition-all duration-200 font-gliker
                      ${selectedTime === slot
                        ? 'bg-blue-100 border-blue-300 text-blue-800 ring-2 ring-blue-500'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }
                    `}
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

          {/* Step 3: Service Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 font-gliker">
                Service Details & Contact Information
              </h3>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-gliker">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-gliker ${
                      errors.clientName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.clientName && (
                    <p className="text-sm text-red-600 mt-1 font-gliker">{errors.clientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-gliker">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-gliker ${
                      errors.clientEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.clientEmail && (
                    <p className="text-sm text-red-600 mt-1 font-gliker">{errors.clientEmail}</p>
                  )}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 font-gliker">
                  Service Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                      className={`
                        p-4 rounded-lg border text-left transition-all duration-200
                        ${formData.service === service.id
                          ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500'
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 font-gliker">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 font-gliker">{service.duration}</p>
                        </div>
                        <span className="text-sm font-semibold text-blue-600 font-gliker">
                          {service.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.service && (
                  <p className="text-sm text-red-600 mt-2 font-gliker">{errors.service}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-gliker">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Project Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-gliker ${
                    errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Please describe your project, goals, or any specific requirements..."
                />
                {errors.message && (
                  <p className="text-sm text-red-600 mt-1 font-gliker">{errors.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1 font-gliker">
                  {formData.message.length}/500 characters
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-gliker">
                Review Your Booking Request
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 font-gliker">Booking Details</h4>
                    <div className="space-y-2 text-sm font-gliker">
                      <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                      <p><strong>Service:</strong> {getSelectedService()?.name}</p>
                      <p><strong>Duration:</strong> {getSelectedService()?.duration}</p>
                      <p><strong>Price:</strong> {getSelectedService()?.price}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 font-gliker">Contact Information</h4>
                    <div className="space-y-2 text-sm font-gliker">
                      <p><strong>Name:</strong> {formData.clientName}</p>
                      <p><strong>Email:</strong> {formData.clientEmail}</p>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mt-4 mb-2 font-gliker">Project Details</h4>
                    <p className="text-sm text-gray-600 font-gliker">{formData.message}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 mt-6 border border-amber-200">
                <p className="text-sm text-amber-800 font-gliker">
                  <strong>Please note:</strong> This is a booking request. The artist will review and confirm your booking within 24 hours. 
                  You'll receive an email notification once the booking is confirmed or if any changes are needed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-gliker"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex space-x-3">
            {currentStep < 4 && (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedDate) ||
                  (currentStep === 2 && !selectedTime) ||
                  (currentStep === 3 && (!formData.clientName || !formData.clientEmail || !formData.service || !formData.message))
                }
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-gliker font-medium"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-gliker font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Send Booking Request
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;

