import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle, XCircle, Calendar, Grid, List } from 'lucide-react';
import bookingService from '../services/bookingService';

const AvailabilityCalendar = ({ artistId, onDateSelect, selectedDate, mode = 'view' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    if (artistId) {
      loadAvailability();
    }
  }, [artistId, currentDate]);

  const loadAvailability = async () => {
    setIsLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await bookingService.getAvailability(
        artistId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      if (response.success) {
        setAvailability(response.availability || {});
        setBookedSlots(response.bookedSlots || {});
      } else {
        // Fallback to mock data
        const mockData = bookingService.getMockAvailability();
        setAvailability(mockData.availability);
        setBookedSlots(mockData.bookedSlots);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      // Fallback to mock data
      const mockData = bookingService.getMockAvailability();
      setAvailability(mockData.availability);
      setBookedSlots(mockData.bookedSlots);
    } finally {
      setIsLoading(false);
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

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDateString = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const getDateStatus = (date) => {
    if (!date) return 'unavailable';
    
    const dateStr = getDateString(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Past dates are unavailable
    if (date < today) {
      return 'past';
    }

    const availableSlots = availability[dateStr] || [];
    const bookedSlotsForDate = bookedSlots[dateStr] || [];
    const availableCount = availableSlots.filter(slot => !bookedSlotsForDate.includes(slot)).length;

    if (availableCount === 0) {
      return 'fully-booked';
    } else if (availableCount < availableSlots.length) {
      return 'partially-booked';
    } else {
      return 'available';
    }
  };

  const getDateStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'partially-booked':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200';
      case 'fully-booked':
        return 'bg-red-100 text-red-800 cursor-not-allowed border-red-200';
      case 'past':
        return 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200';
    }
  };

  const handleDateClick = (date) => {
    if (!date) return;
    
    const status = getDateStatus(date);
    if (status === 'past' || status === 'fully-booked') return;

    const dateStr = getDateString(date);
    const availableSlots = availability[dateStr] || timeSlots;
    const bookedSlotsForDate = bookedSlots[dateStr] || [];
    const freeSlots = availableSlots.filter(slot => !bookedSlotsForDate.includes(slot));

    setSelectedTimeSlots(freeSlots);
    setShowTimeSlots(true);

    if (onDateSelect) {
      onDateSelect(date, freeSlots);
    }
  };

  const navigateDate = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + direction);
      } else if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction * 7));
      } else if (viewMode === 'day') {
        newDate.setDate(prev.getDate() + direction);
      }
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 font-gliker">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-3"></div>;
          }

          const status = getDateStatus(date);
          const statusColor = getDateStatusColor(status);
          const canClick = status !== 'past' && status !== 'fully-booked';

          return (
            <button
              key={index}
              onClick={() => canClick && handleDateClick(date)}
              disabled={!canClick}
              className={`
                p-3 text-sm rounded-lg transition-all duration-200 relative border font-gliker
                ${statusColor}
                ${isToday(date) ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                ${isSelected(date) ? 'ring-2 ring-purple-600 bg-purple-100 border-purple-300' : ''}
                ${canClick ? 'hover:scale-105 hover:shadow-md' : ''}
              `}
            >
              {date.getDate()}
              {isToday(date) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const status = getDateStatus(date);
            const statusColor = getDateStatusColor(status);
            const canClick = status !== 'past' && status !== 'fully-booked';

            return (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2 font-gliker">
                  {daysOfWeek[index]}
                </div>
                <button
                  onClick={() => canClick && handleDateClick(date)}
                  disabled={!canClick}
                  className={`
                    w-full p-4 rounded-xl transition-all duration-200 border font-gliker
                    ${statusColor}
                    ${isToday(date) ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    ${isSelected(date) ? 'ring-2 ring-purple-600 bg-purple-100 border-purple-300' : ''}
                    ${canClick ? 'hover:scale-105 hover:shadow-md' : ''}
                  `}
                >
                  <div className="text-lg font-semibold">{date.getDate()}</div>
                  <div className="text-xs mt-1">
                    {status === 'available' && '✓ Available'}
                    {status === 'partially-booked' && '⚠ Partial'}
                    {status === 'fully-booked' && '✗ Booked'}
                    {status === 'past' && '— Past'}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const status = getDateStatus(currentDate);
    const dateStr = getDateString(currentDate);
    const availableSlots = availability[dateStr] || timeSlots;
    const bookedSlotsForDate = bookedSlots[dateStr] || [];

    return (
      <div className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
          <h3 className="text-2xl font-bold text-gray-900 font-gliker">
            {daysOfWeekFull[currentDate.getDay()]}
          </h3>
          <p className="text-lg text-gray-600 font-gliker">
            {months[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
          </p>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getDateStatusColor(status)}`}>
            {status === 'available' && '✓ Available'}
            {status === 'partially-booked' && '⚠ Partially Booked'}
            {status === 'fully-booked' && '✗ Fully Booked'}
            {status === 'past' && '— Past Date'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {timeSlots.map(slot => {
            const isBooked = bookedSlotsForDate.includes(slot);
            const isAvailable = availableSlots.includes(slot) && !isBooked;
            const isPast = status === 'past';

            return (
              <button
                key={slot}
                onClick={() => isAvailable && handleDateClick(currentDate)}
                disabled={!isAvailable || isPast}
                className={`
                  p-4 rounded-lg border transition-all duration-200 font-gliker
                  ${isAvailable ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100 hover:scale-105' : ''}
                  ${isBooked ? 'bg-red-50 border-red-200 text-red-800 cursor-not-allowed' : ''}
                  ${isPast ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">{slot}</span>
                </div>
                <div className="text-xs mt-1">
                  {isAvailable && 'Available'}
                  {isBooked && 'Booked'}
                  {isPast && 'Past'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const getNavigationLabel = () => {
    if (viewMode === 'month') {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays(currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${daysOfWeekFull[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center font-gliker">
            <Calendar className="w-6 h-6 mr-3 text-blue-600" />
            Availability Calendar
          </h3>
          <p className="text-sm text-gray-600 mt-1 font-gliker">
            {mode === 'booking' ? 'Select a date to view available time slots' : 'Click on available dates to view time slots'}
          </p>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-gliker ${
                viewMode === 'month' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4 mr-1 inline" />
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-gliker ${
                viewMode === 'week' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 mr-1 inline" />
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-gliker ${
                viewMode === 'day' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 mr-1 inline" />
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateDate(-1)}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-gliker"
          disabled={isLoading}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>
        
        <h4 className="text-lg font-semibold text-gray-900 text-center font-gliker">
          {getNavigationLabel()}
        </h4>
        
        <button
          onClick={() => navigateDate(1)}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-gliker"
          disabled={isLoading}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
          <span className="text-gray-600 font-gliker">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded mr-2"></div>
          <span className="text-gray-600 font-gliker">Partially Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
          <span className="text-gray-600 font-gliker">Fully Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
          <span className="text-gray-600 font-gliker">Unavailable</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 font-gliker">Loading availability...</span>
        </div>
      )}

      {/* Calendar Views */}
      {!isLoading && (
        <div className="min-h-[300px]">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </div>
      )}

      {/* Time Slots Modal */}
      {showTimeSlots && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 font-gliker">
                Available Time Slots
              </h4>
              <button
                onClick={() => setShowTimeSlots(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {selectedTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {selectedTimeSlots.map(slot => (
                  <div
                    key={slot}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-center hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800 font-gliker">{slot}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="text-gray-600 font-gliker">No available time slots for this date.</p>
                <p className="text-sm text-gray-500 mt-1 font-gliker">Please select another date.</p>
              </div>
            )}

            <button
              onClick={() => setShowTimeSlots(false)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-gliker font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 font-gliker">
          <strong>How to book:</strong> Click on available dates (green) to view time slots. 
          Green dates have full availability, amber dates are partially booked, and red dates are fully booked.
        </p>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

