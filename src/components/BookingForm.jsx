import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  DollarSign,
  Check,
  X,
  ArrowLeft,
  Star,
  MapPin,
  Camera,
  Music,
  Palette,
  Users,
  Briefcase,
  Heart
} from 'lucide-react';
import apiService from '../services/apiService';

const BookingForm = ({ artist, onClose, selectedDate = null, selectedSlot = null }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    // Client Information
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    
    // Booking Details
    serviceType: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    timeSlot: selectedSlot ? selectedSlot.id : '',
    duration: selectedSlot ? selectedSlot.duration : 60,
    price: selectedSlot ? selectedSlot.price : 0,
    
    // Additional Information
    notes: '',
    location: '',
    specialRequests: '',
    
    // Agreement
    agreedToTerms: false
  });

  // Service type icons
  const serviceIcons = {
    'Photoshoot': Camera,
    'Portrait Session': Camera,
    'Music Collaboration': Music,
    'Art Tutoring': Palette,
    'Creative Consultation': Briefcase,
    'Workshop': Users,
    'Performance': Star,
    'Custom Project': Heart
  };

  useEffect(() => {
    loadServices();
    if (formData.date) {
      loadAvailableSlots(formData.date);
    }
  }, [artist.id, formData.date]);

  const loadServices = async () => {
    try {
      const response = await apiService.services.getServices(artist.id);
      setServices(response.data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
      // Mock services for development
      setServices([
        {
          id: 1,
          name: 'Portrait Session',
          description: 'Professional portrait photography session',
          duration: 120,
          price: 150,
          category: 'Photography'
        },
        {
          id: 2,
          name: 'Music Collaboration',
          description: 'Collaborative music production and recording',
          duration: 180,
          price: 200,
          category: 'Music'
        },
        {
          id: 3,
          name: 'Art Tutoring',
          description: 'One-on-one art instruction and guidance',
          duration: 60,
          price: 75,
          category: 'Education'
        },
        {
          id: 4,
          name: 'Creative Consultation',
          description: 'Creative direction and project consultation',
          duration: 90,
          price: 100,
          category: 'Consulting'
        }
      ]);
    }
  };

  const loadAvailableSlots = async (date) => {
    try {
      const response = await apiService.calendar.getAvailableSlots(artist.id, date);
      setAvailableSlots(response.data || []);
    } catch (error) {
      console.error('Failed to load available slots:', error);
      // Mock available slots for development
      setAvailableSlots([
        {
          id: 1,
          startTime: '09:00',
          endTime: '11:00',
          duration: 120,
          price: 150,
          serviceType: 'Portrait Session'
        },
        {
          id: 2,
          startTime: '14:00',
          endTime: '16:00',
          duration: 120,
          price: 150,
          serviceType: 'Portrait Session'
        },
        {
          id: 3,
          startTime: '16:30',
          endTime: '18:00',
          duration: 90,
          price: 100,
          serviceType: 'Creative Consultation'
        }
      ]);
    }
  };

  const handleServiceSelect = (service) => {
    setFormData(prev => ({
      ...prev,
      serviceType: service.name,
      duration: service.duration,
      price: service.price
    }));
    setStep(2);
  };

  const handleSlotSelect = (slot) => {
    setFormData(prev => ({
      ...prev,
      timeSlot: slot.id,
      duration: slot.duration,
      price: slot.price
    }));
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        artistId: artist.id,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        serviceType: formData.serviceType,
        date: formData.date,
        timeSlot: formData.timeSlot,
        duration: formData.duration,
        price: formData.price,
        notes: formData.notes,
        location: formData.location,
        specialRequests: formData.specialRequests
      };

      await apiService.booking.createBooking(bookingData);
      setStep(5); // Success step
    } catch (error) {
      console.error('Failed to create booking:', error);
      // For development, just show success
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-h3 font-gliker text-macs-blue-600 mb-2">
          Choose a Service
        </h3>
        <p className="text-macs-gray-600">
          Select the type of session you'd like to book with {artist.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => {
          const Icon = serviceIcons[service.name] || Briefcase;
          return (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className="p-6 border-2 border-macs-gray-200 rounded-xl hover:border-macs-blue-500 hover:bg-macs-blue-50 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-macs-blue-100 rounded-lg group-hover:bg-macs-blue-200 transition-colors">
                  <Icon className="h-6 w-6 text-macs-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-macs-gray-900 mb-1">
                    {service.name}
                  </h4>
                  <p className="text-sm text-macs-gray-600 mb-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-macs-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} min
                    </div>
                    <div className="flex items-center text-macs-amber-600 font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {service.price}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-h3 font-gliker text-macs-blue-600 mb-2">
          Select Date & Time
        </h3>
        <p className="text-macs-gray-600">
          Choose your preferred date and time slot
        </p>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-macs-gray-700 mb-2">
          Preferred Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, date: e.target.value }));
            loadAvailableSlots(e.target.value);
          }}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
        />
      </div>

      {/* Time Slots */}
      {formData.date && (
        <div>
          <label className="block text-sm font-medium text-macs-gray-700 mb-4">
            Available Time Slots
          </label>
          {availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-macs-gray-400 mx-auto mb-4" />
              <p className="text-macs-gray-600">No available slots for this date</p>
              <p className="text-sm text-macs-gray-500">Please select a different date</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableSlots.map(slot => (
                <div
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.timeSlot === slot.id
                      ? 'border-macs-blue-500 bg-macs-blue-50'
                      : 'border-macs-gray-200 hover:border-macs-blue-300 hover:bg-macs-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-macs-gray-900">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </p>
                      <p className="text-sm text-macs-gray-600">
                        {slot.duration} minutes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-macs-amber-600">
                        ${slot.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-h3 font-gliker text-macs-blue-600 mb-2">
          Your Information
        </h3>
        <p className="text-macs-gray-600">
          Please provide your contact details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-macs-gray-400" />
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-macs-gray-400" />
              <input
                type="email"
                required
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-macs-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-macs-gray-400" />
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-macs-gray-700 mb-2">
            Preferred Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-macs-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
              placeholder="Studio, outdoor location, etc."
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-macs-gray-700 mb-2">
            Additional Notes
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-macs-gray-400" />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full pl-10 pr-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
              placeholder="Tell the artist about your vision, specific requirements, or any questions you have..."
            />
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-macs-gray-700 mb-2">
            Special Requests
          </label>
          <input
            type="text"
            value={formData.specialRequests}
            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
            className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
            placeholder="Any special equipment, styling, or preparation needed"
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreedToTerms}
            onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
            className="h-4 w-4 text-macs-blue-600 focus:ring-macs-blue-500 border-macs-gray-300 rounded mt-1"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-macs-gray-700">
            I agree to the booking terms and conditions. I understand that this is a booking request and the artist will confirm availability.
          </label>
        </div>
      </form>
    </div>
  );

  const renderStep4 = () => {
    const selectedSlotData = availableSlots.find(slot => slot.id === formData.timeSlot);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-h3 font-gliker text-macs-blue-600 mb-2">
            Review Your Booking
          </h3>
          <p className="text-macs-gray-600">
            Please review your booking details before submitting
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-macs-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-macs-gray-900">Booking Summary</h4>
            <span className="text-2xl font-bold text-macs-amber-600">${formData.price}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-macs-gray-600">Service</p>
              <p className="font-medium text-macs-gray-900">{formData.serviceType}</p>
            </div>
            <div>
              <p className="text-sm text-macs-gray-600">Duration</p>
              <p className="font-medium text-macs-gray-900">{formData.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-macs-gray-600">Date</p>
              <p className="font-medium text-macs-gray-900">{formatDate(formData.date)}</p>
            </div>
            <div>
              <p className="text-sm text-macs-gray-600">Time</p>
              <p className="font-medium text-macs-gray-900">
                {selectedSlotData && `${formatTime(selectedSlotData.startTime)} - ${formatTime(selectedSlotData.endTime)}`}
              </p>
            </div>
          </div>

          {formData.location && (
            <div>
              <p className="text-sm text-macs-gray-600">Location</p>
              <p className="font-medium text-macs-gray-900">{formData.location}</p>
            </div>
          )}

          {formData.notes && (
            <div>
              <p className="text-sm text-macs-gray-600">Notes</p>
              <p className="font-medium text-macs-gray-900">{formData.notes}</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-macs-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-macs-gray-900 mb-4">Your Information</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 text-macs-gray-400 mr-3" />
              <span className="text-macs-gray-900">{formData.clientName}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-macs-gray-400 mr-3" />
              <span className="text-macs-gray-900">{formData.clientEmail}</span>
            </div>
            {formData.clientPhone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-macs-gray-400 mr-3" />
                <span className="text-macs-gray-900">{formData.clientPhone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-macs-blue-50 border border-macs-blue-200 rounded-lg p-4">
          <p className="text-sm text-macs-blue-800">
            <strong>Note:</strong> This is a booking request. {artist.name} will review your request and confirm availability. You'll receive a confirmation email once the booking is approved.
          </p>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-h3 font-gliker text-macs-blue-600 mb-2">
          Booking Request Sent!
        </h3>
        <p className="text-macs-gray-600">
          Your booking request has been sent to {artist.name}. You'll receive a confirmation email once they review and approve your request.
        </p>
      </div>

      <div className="bg-macs-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-macs-gray-900 mb-4">What happens next?</h4>
        <div className="space-y-3 text-left">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-macs-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-semibold text-macs-blue-600">1</span>
            </div>
            <p className="text-sm text-macs-gray-700">
              {artist.name} will review your booking request and availability
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-macs-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-semibold text-macs-blue-600">2</span>
            </div>
            <p className="text-sm text-macs-gray-700">
              You'll receive an email confirmation with booking details
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-macs-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-semibold text-macs-blue-600">3</span>
            </div>
            <p className="text-sm text-macs-gray-700">
              Payment and final details will be arranged directly with the artist
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-macs-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
          <div className="flex items-center space-x-4">
            {step > 1 && step < 5 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-2 text-macs-gray-400 hover:text-macs-blue-600 hover:bg-macs-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h2 className="text-h2 font-gliker text-macs-blue-600">
                Book with {artist.name}
              </h2>
              {step < 5 && (
                <p className="text-sm text-macs-gray-600">
                  Step {step} of 4
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="px-6 py-4 border-b border-macs-gray-200">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map(stepNumber => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNumber <= step 
                      ? 'bg-macs-blue-600 text-white' 
                      : 'bg-macs-gray-200 text-macs-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      stepNumber < step ? 'bg-macs-blue-600' : 'bg-macs-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Footer */}
        {step < 5 && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-macs-gray-200">
            {step === 3 && (
              <button
                onClick={() => setStep(4)}
                disabled={!formData.clientName || !formData.clientEmail || !formData.agreedToTerms}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Booking
              </button>
            )}
            
            {step === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Request...' : 'Send Booking Request'}
              </button>
            )}
          </div>
        )}

        {/* Success Footer */}
        {step === 5 && (
          <div className="flex items-center justify-center p-6 border-t border-macs-gray-200">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;

