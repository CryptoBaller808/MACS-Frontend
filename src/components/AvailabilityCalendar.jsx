import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar, 
  Grid, 
  List,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import bookingService from '../services/bookingService';
import BookingModal from './BookingModal';

const AvailabilityCalendar = ({ artistId, artistName, onDateSelect, selectedDate, mode = 'view', showBookingModal = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [selectedDay, setSelectedDay] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState(null);

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
        // Fallback to mock data for demo
        const mockAvailability = generateMockAvailability();
        setAvailability(mockAvailability.availability);
        setBookedSlots(mockAvailability.bookedSlots);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      // Fallback to mock data
      const mockAvailability = generateMockAvailability();
      setAvailability(mockAvailability.availability);
      setBookedSlots(mockAvailability.bookedSlots);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAvailability = () => {
    const availability = {};
    const bookedSlots = {};
    const today = new Date();
    
    // Generate availability for current month
    for (let day = 1; day <= 31; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      if (date.getMonth() === currentDate.getMonth()) {
        const dateStr = date.toISOString().split('T')[0];
        
        // Random availability pattern
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isPast = date < today;
        
        if (isPast) {
          availability[dateStr] = 'unavailable';
        } else if (isWeekend) {
          availability[dateStr] = Math.random() > 0.7 ? 'available' : 'unavailable';
        } else {
          const rand = Math.random();
          if (rand > 0.8) availability[dateStr] = 'booked';
          else if (rand > 0.6) availability[dateStr] = 'partial';
          else availability[dateStr] = 'available';
        }

        // Generate some booked slots
        if (availability[dateStr] === 'partial' || availability[dateStr] === 'booked') {
          bookedSlots[dateStr] = timeSlots.slice(0, Math.floor(Math.random() * 4) + 1);
        }
      }
    }
    
    return { availability, bookedSlots };
  };

  const handleDateClick = (day) => {
    if (!day) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = clickedDate.toISOString().split('T')[0];
    const dateAvailability = availability[dateStr];
    const today = new Date();
    const isPast = clickedDate < today;
    
    // Prevent selection of past dates
    if (isPast) {
      if (window.showToast) {
        window.showToast('Cannot book past dates', 'warning');
      }
      return;
    }
    
    // Prevent selection of unavailable dates
    if (dateAvailability === 'unavailable') {
      if (window.showToast) {
        window.showToast('This date is marked as unavailable by the artist', 'warning');
      }
      return;
    }
    
    // Prevent selection of fully booked dates
    if (dateAvailability === 'booked') {
      if (window.showToast) {
        window.showToast('This date is fully booked', 'warning');
      }
      return;
    }
    
    // Only allow booking on available or partially available dates
    if (showBookingModal && (dateAvailability === 'available' || dateAvailability === 'partial')) {
      setSelectedBookingDate(dateStr);
      setIsBookingModalOpen(true);
    } else if (mode === 'manage') {
      // For artist management mode, allow toggling availability
      toggleAvailability(dateStr);
    }
    
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };

  const toggleAvailability = (dateStr) => {
    setAvailability(prev => {
      const current = prev[dateStr] || 'available';
      const next = current === 'available' ? 'unavailable' : 'available';
      return { ...prev, [dateStr]: next };
    });
  };

  const handleBookingSubmitted = () => {
    // Refresh availability after booking
    loadAvailability();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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
      days.push(day);
    }

    return days;
  };

  const getDateAvailabilityClass = (day) => {
    if (!day) return '';
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const dateAvailability = availability[dateStr] || 'available';
    const hasBookedSlots = bookedSlots[dateStr] && bookedSlots[dateStr].length > 0;
    const today = new Date();
    const isPast = date < today;
    
    if (isPast) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
    
    // Check if this date has confirmed bookings
    if (hasBookedSlots) {
      return 'bg-green-200 text-green-900 border-2 border-green-400 font-bold cursor-pointer hover:bg-green-300';
    }
    
    switch (dateAvailability) {
      case 'available':
        return showBookingModal 
          ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer border-2 border-green-300' 
          : 'bg-green-100 text-green-800';
      case 'partial':
        return showBookingModal 
          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer border-2 border-amber-300' 
          : 'bg-amber-100 text-amber-800';
      case 'booked':
        return 'bg-red-100 text-red-800 cursor-not-allowed';
      case 'unavailable':
        return 'bg-gray-200 text-gray-600 cursor-not-allowed border border-gray-300';
      default:
        return 'bg-white text-macs-brown hover:bg-macs-brown/5';
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth();
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysOfWeek.map(day => (
          <div key={day} className="p-2 text-center text-sm font-gliker font-medium text-macs-brown/70">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day)}
            className={`
              p-3 text-center text-sm font-gliker font-medium rounded-lg transition-all duration-200
              ${getDateAvailabilityClass(day)}
              ${day ? 'min-h-[40px] flex items-center justify-center' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    // Get the start of the week for current date
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const dateAvailability = availability[dateStr] || 'available';
            
            return (
              <div key={index} className="text-center">
                <div className="text-sm font-gliker font-medium text-macs-brown/70 mb-2">
                  {daysOfWeekFull[day.getDay()]}
                </div>
                <div
                  onClick={() => handleDateClick(day.getDate())}
                  className={`
                    p-4 rounded-lg text-lg font-gliker font-bold transition-all duration-200
                    ${getDateAvailabilityClass(day.getDate())}
                  `}
                >
                  {day.getDate()}
                </div>
                
                {/* Time slots for the day */}
                <div className="mt-2 space-y-1">
                  {timeSlots.slice(0, 3).map(time => {
                    const isBooked = bookedSlots[dateStr]?.includes(time);
                    return (
                      <div
                        key={time}
                        className={`
                          text-xs p-1 rounded font-gliker
                          ${isBooked 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                          }
                        `}
                      >
                        {time}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayBookedSlots = bookedSlots[dateStr] || [];
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-gliker font-bold text-macs-brown">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map(time => {
            const isBooked = dayBookedSlots.includes(time);
            return (
              <div
                key={time}
                className={`
                  p-4 rounded-lg text-center font-gliker font-medium transition-all duration-200
                  ${isBooked 
                    ? 'bg-red-100 text-red-800 cursor-not-allowed' 
                    : showBookingModal 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer border-2 border-green-300'
                      : 'bg-green-100 text-green-800'
                  }
                `}
                onClick={() => {
                  if (!isBooked && showBookingModal) {
                    setSelectedBookingDate(dateStr);
                    setIsBookingModalOpen(true);
                  }
                }}
              >
                <Clock className="h-4 w-4 mx-auto mb-1" />
                {time}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 font-gliker">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-macs-teal" />
          <h2 className="text-2xl font-gliker font-bold text-macs-brown">
            Availability Calendar
          </h2>
        </div>
        
        {/* View Mode Selector */}
        <div className="flex items-center space-x-2 bg-macs-brown/10 rounded-lg p-1">
          {['Month', 'Week', 'Day'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode.toLowerCase())}
              className={`
                px-3 py-1 rounded-md text-sm font-gliker font-medium transition-all duration-200
                ${viewMode === mode.toLowerCase()
                  ? 'bg-macs-teal text-white'
                  : 'text-macs-brown hover:bg-macs-brown/10'
                }
              `}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            if (viewMode === 'month') navigateMonth(-1);
            else if (viewMode === 'week') navigateWeek(-1);
            else navigateDay(-1);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-macs-teal text-white rounded-lg hover:bg-macs-teal-dark transition-colors font-gliker"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        <h3 className="text-xl font-gliker font-bold text-macs-brown">
          {viewMode === 'month' && `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString()}`}
          {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        <button
          onClick={() => {
            if (viewMode === 'month') navigateMonth(1);
            else if (viewMode === 'week') navigateWeek(1);
            else navigateDay(1);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-macs-teal text-white rounded-lg hover:bg-macs-teal-dark transition-colors font-gliker"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-macs-teal"></div>
        </div>
      ) : (
        <div className="mb-6">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-gliker">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-macs-brown">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-macs-brown">Partially Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-macs-brown">Fully Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <Minus className="h-4 w-4 text-gray-500" />
          <span className="text-macs-brown">Unavailable</span>
        </div>
      </div>

      {/* Instructions */}
      {showBookingModal && (
        <div className="mt-4 p-4 bg-macs-teal/10 rounded-lg">
          <p className="text-center text-macs-brown font-gliker">
            💡 <strong>How to book:</strong> Click on available dates (green) to view time slots and make a booking request.
          </p>
        </div>
      )}

      {mode === 'manage' && (
        <div className="mt-4 p-4 bg-macs-amber/10 rounded-lg">
          <p className="text-center text-macs-brown font-gliker">
            ⚡ <strong>Double-click on dates to toggle availability</strong>
          </p>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDate={selectedBookingDate}
        artistId={artistId}
        artistName={artistName}
        onBookingSubmitted={handleBookingSubmitted}
      />
    </div>
  );
};

export default AvailabilityCalendar;

