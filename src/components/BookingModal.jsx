import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, MessageSquare, Send, Loader } from 'lucide-react';
import bookingService from '../services/bookingService';

const BookingModal = ({ isOpen, onClose, selectedDate, artistId, artistName, onBookingSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    requestedTime: '10:00'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Check for existing bookings at this time slot
      const checkResponse = await bookingService.checkTimeSlotAvailability(
        artistId,
        selectedDate,
        formData.requestedTime
      );

      if (!checkResponse.available) {
        setSubmitStatus('error');
        if (window.showToast) {
          window.showToast('This time slot is no longer available. Please select a different time.', 'warning');
        }
        setIsSubmitting(false);
        return;
      }

      const bookingData = {
        artistId: '1',
        clientName: formData.name,
        clientEmail: formData.email,
        service: 'General Booking',
        dateTime: `${selectedDate}T${formData.requestedTime}:00Z`,
        message: formData.message,
        status: 'pending'
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        setSubmitStatus('success');
        
        // Show success toast with tracking info
        if (window.showToast) {
          window.showToast(`Booking request sent successfully! Reference: ${response.bookingId || 'MACS-' + Date.now()}`, 'success');
        }
        
        setTimeout(() => {
          onBookingSubmitted && onBookingSubmitted();
          onClose();
          // Reset form
          setFormData({
            name: '',
            email: '',
            message: '',
            requestedTime: '10:00'
          });
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
        if (window.showToast) {
          window.showToast('Failed to submit booking request. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
      if (window.showToast) {
        window.showToast('Error submitting booking. Please check your connection.', 'error');
      }
    } finally {
      setIsSubmitting(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-macs-teal to-macs-teal-dark p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-white" />
              <h2 className="text-xl font-gliker font-bold text-white">
                Book with {artistName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-macs-amber transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-macs-teal-light mt-2 font-gliker">
            {formatDate(selectedDate)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-gliker font-medium text-macs-brown mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-macs-brown/20 rounded-lg focus:ring-2 focus:ring-macs-teal focus:border-transparent font-gliker"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-gliker font-medium text-macs-brown mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-macs-brown/20 rounded-lg focus:ring-2 focus:ring-macs-teal focus:border-transparent font-gliker"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-gliker font-medium text-macs-brown mb-2">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-macs-brown/20 rounded-lg focus:ring-2 focus:ring-macs-teal focus:border-transparent font-gliker resize-none"
              placeholder="Describe what you'd like to book (e.g., Portrait session, Art consultation, Custom artwork)"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-gliker font-medium text-macs-brown mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Preferred Time
            </label>
            <select
              name="requestedTime"
              value={formData.requestedTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-macs-brown/20 rounded-lg focus:ring-2 focus:ring-macs-teal focus:border-transparent font-gliker"
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-gliker text-center">
                ✅ Booking request sent successfully! Awaiting artist confirmation.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-gliker text-center">
                ❌ Error submitting booking. Please try again.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-macs-teal to-macs-teal-dark text-white py-3 px-6 rounded-lg font-gliker font-medium hover:from-macs-teal-dark hover:to-macs-teal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send Booking Request</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-macs-brown/5 px-6 py-4 rounded-b-2xl">
          <p className="text-sm text-macs-brown/70 text-center font-gliker">
            Your booking request will be sent to the artist for confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

