import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Calendar as CalendarIcon,
  Settings,
  Check,
  X,
  Edit3,
  Trash2
} from 'lucide-react';
import apiService from '../services/apiService';

const Calendar = ({ artistId, isOwner = false, onSlotSelect = null }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availabilityForm, setAvailabilityForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    isRecurring: false,
    recurringDays: [],
    price: '',
    serviceType: ''
  });

  // Service types for booking
  const serviceTypes = [
    'Photoshoot',
    'Music Collaboration',
    'Art Tutoring',
    'Portrait Session',
    'Creative Consultation',
    'Workshop',
    'Performance',
    'Custom Project'
  ];

  // Days of the week for recurring availability
  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  useEffect(() => {
    loadCalendarData();
  }, [artistId, currentDate]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const [availabilityData, bookingsData] = await Promise.all([
        apiService.calendar.getAvailability(artistId),
        apiService.calendar.getCalendarEvents(artistId, startDate.toISOString(), endDate.toISOString())
      ]);
      
      setAvailability(availabilityData.data || []);
      setBookings(bookingsData.data || []);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
      // Use mock data for development
      setAvailability([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDateAvailability = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return availability.filter(slot => 
      slot.date === dateStr || 
      (slot.isRecurring && slot.recurringDays.includes(date.getDay()))
    );
  };

  const getDateBookings = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => 
      booking.date === dateStr && booking.status !== 'cancelled'
    );
  };

  const isDateAvailable = (date) => {
    const availability = getDateAvailability(date);
    const bookings = getDateBookings(date);
    return availability.length > 0 && availability.length > bookings.length;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onSlotSelect && !isOwner) {
      // Client view - show available slots for booking
      const availableSlots = getDateAvailability(date);
      if (availableSlots.length > 0) {
        onSlotSelect(date, availableSlots);
      }
    }
  };

  const handleAddAvailability = () => {
    setAvailabilityForm({
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      startTime: '',
      endTime: '',
      duration: 60,
      isRecurring: false,
      recurringDays: [],
      price: '',
      serviceType: serviceTypes[0]
    });
    setSelectedSlot(null);
    setShowAvailabilityModal(true);
  };

  const handleEditAvailability = (slot) => {
    setAvailabilityForm({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      isRecurring: slot.isRecurring,
      recurringDays: slot.recurringDays || [],
      price: slot.price,
      serviceType: slot.serviceType
    });
    setSelectedSlot(slot);
    setShowAvailabilityModal(true);
  };

  const handleSaveAvailability = async () => {
    try {
      if (selectedSlot) {
        await apiService.calendar.updateAvailability(selectedSlot.id, availabilityForm);
      } else {
        await apiService.calendar.setAvailability(availabilityForm);
      }
      setShowAvailabilityModal(false);
      loadCalendarData();
    } catch (error) {
      console.error('Failed to save availability:', error);
      // For development, just close modal
      setShowAvailabilityModal(false);
    }
  };

  const handleDeleteAvailability = async (slotId) => {
    try {
      await apiService.calendar.deleteAvailability(slotId);
      loadCalendarData();
    } catch (error) {
      console.error('Failed to delete availability:', error);
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-macs-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-macs-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-12 bg-macs-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-macs-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-macs-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-gliker">
            {isOwner ? 'Manage Availability' : 'Book a Session'}
          </h2>
          {isOwner && (
            <button
              onClick={handleAddAvailability}
              className="btn-secondary bg-white text-macs-blue-600 hover:bg-macs-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-macs-blue-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h3 className="text-xl font-semibold">{monthYear}</h3>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-macs-blue-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-macs-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-16"></div>;
            }

            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const hasAvailability = getDateAvailability(date).length > 0;
            const hasBookings = getDateBookings(date).length > 0;
            const isAvailable = isDateAvailable(date);

            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  h-16 border-2 rounded-lg cursor-pointer transition-all duration-200 p-2
                  ${isSelected 
                    ? 'border-macs-blue-500 bg-macs-blue-50' 
                    : 'border-macs-gray-200 hover:border-macs-blue-300'
                  }
                  ${isToday ? 'ring-2 ring-macs-amber-400' : ''}
                  ${hasAvailability ? 'bg-green-50' : ''}
                  ${hasBookings ? 'bg-macs-blue-50' : ''}
                `}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-medium ${isToday ? 'text-macs-amber-600' : 'text-macs-gray-900'}`}>
                    {date.getDate()}
                  </span>
                  
                  <div className="flex-1 flex flex-col justify-end">
                    {hasAvailability && (
                      <div className="w-2 h-2 bg-green-400 rounded-full mb-1"></div>
                    )}
                    {hasBookings && (
                      <div className="w-2 h-2 bg-macs-blue-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-macs-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            Available
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-macs-blue-400 rounded-full mr-2"></div>
            Booked
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-macs-amber-400 rounded-full mr-2"></div>
            Today
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t border-macs-gray-200 p-6">
          <h4 className="text-lg font-semibold text-macs-gray-900 mb-4">
            {formatDate(selectedDate)}
          </h4>
          
          {isOwner ? (
            // Artist view - manage availability
            <div className="space-y-4">
              {getDateAvailability(selectedDate).map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-macs-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-macs-gray-400" />
                    <div>
                      <p className="font-medium text-macs-gray-900">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-sm text-macs-gray-600">
                        {slot.serviceType} • ${slot.price}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditAvailability(slot)}
                      className="p-2 text-macs-gray-400 hover:text-macs-blue-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAvailability(slot.id)}
                      className="p-2 text-macs-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {getDateAvailability(selectedDate).length === 0 && (
                <p className="text-macs-gray-500 text-center py-4">
                  No availability set for this date
                </p>
              )}
            </div>
          ) : (
            // Client view - show available slots for booking
            <div className="space-y-4">
              {getDateAvailability(selectedDate).map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-macs-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-macs-gray-400" />
                    <div>
                      <p className="font-medium text-macs-gray-900">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-sm text-macs-gray-600">
                        {slot.serviceType} • ${slot.price}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onSlotSelect && onSlotSelect(selectedDate, slot)}
                    className="btn-primary"
                  >
                    Book Now
                  </button>
                </div>
              ))}
              
              {getDateAvailability(selectedDate).length === 0 && (
                <p className="text-macs-gray-500 text-center py-4">
                  No available slots for this date
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-macs-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
              <h3 className="text-h3 text-macs-blue-600 font-gliker">
                {selectedSlot ? 'Edit Availability' : 'Add Availability'}
              </h3>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={availabilityForm.date}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                />
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={availabilityForm.startTime}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={availabilityForm.endTime}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={availabilityForm.serviceType}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, serviceType: e.target.value }))}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                >
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={availabilityForm.price}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Session Duration (minutes)
                </label>
                <select
                  value={availabilityForm.duration}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>

              {/* Recurring */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={availabilityForm.isRecurring}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, isRecurring: e.target.checked }))}
                    className="h-4 w-4 text-macs-blue-600 focus:ring-macs-blue-500 border-macs-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-macs-gray-700">
                    Recurring weekly
                  </span>
                </label>
              </div>

              {/* Recurring Days */}
              {availabilityForm.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                    Repeat on
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map(day => (
                      <label key={day.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={availabilityForm.recurringDays.includes(day.value)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...availabilityForm.recurringDays, day.value]
                              : availabilityForm.recurringDays.filter(d => d !== day.value);
                            setAvailabilityForm(prev => ({ ...prev, recurringDays: days }));
                          }}
                          className="h-4 w-4 text-macs-blue-600 focus:ring-macs-blue-500 border-macs-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-macs-gray-700">
                          {day.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-macs-gray-200">
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvailability}
                className="btn-primary"
              >
                {selectedSlot ? 'Update' : 'Save'} Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

