import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ToggleLeft, ToggleRight, Save, RefreshCw } from 'lucide-react';
import bookingService from '../services/bookingService';

const AvailabilityManager = ({ artistId = '1' }) => {
  const [availability, setAvailability] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [bulkAction, setBulkAction] = useState('available'); // 'available' or 'unavailable'

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    loadAvailability();
  }, [currentDate, artistId]);

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
      } else {
        // Initialize with default availability
        const defaultAvailability = {};
        for (let day = 1; day <= endDate.getDate(); day++) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateStr = date.toISOString().split('T')[0];
          defaultAvailability[dateStr] = 'available';
        }
        setAvailability(defaultAvailability);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAvailability = async () => {
    setIsSaving(true);
    try {
      const response = await bookingService.updateAvailability(artistId, availability);
      
      if (response.success) {
        if (window.showToast) {
          window.showToast('Availability updated successfully!', 'success');
        }
      } else {
        if (window.showToast) {
          window.showToast('Failed to update availability. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      if (window.showToast) {
        window.showToast('Error saving availability. Please check your connection.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDateAvailability = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const currentStatus = availability[dateStr] || 'available';
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    
    setAvailability(prev => ({
      ...prev,
      [dateStr]: newStatus
    }));
  };

  const selectDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const applyBulkAction = () => {
    const updates = {};
    selectedDates.forEach(dateStr => {
      updates[dateStr] = bulkAction;
    });
    
    setAvailability(prev => ({
      ...prev,
      ...updates
    }));
    
    setSelectedDates([]);
    
    if (window.showToast) {
      window.showToast(
        `${selectedDates.length} dates marked as ${bulkAction}`,
        'success'
      );
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDates([]);
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

  const getDateClass = (day) => {
    if (!day) return '';
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const dateAvailability = availability[dateStr] || 'available';
    const isSelected = selectedDates.includes(dateStr);
    const today = new Date();
    const isPast = date < today;
    
    let baseClass = 'p-3 text-center text-sm font-gliker font-medium rounded-lg transition-all duration-200 cursor-pointer min-h-[40px] flex items-center justify-center relative';
    
    if (isPast) {
      return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    
    if (isSelected) {
      return `${baseClass} bg-macs-teal-200 text-macs-teal-900 border-2 border-macs-teal-400`;
    }
    
    switch (dateAvailability) {
      case 'available':
        return `${baseClass} bg-green-100 text-green-800 hover:bg-green-200 border border-green-300`;
      case 'unavailable':
        return `${baseClass} bg-red-100 text-red-800 hover:bg-red-200 border border-red-300`;
      default:
        return `${baseClass} bg-white text-macs-brown hover:bg-macs-brown/5 border border-gray-200`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-macs-teal-600" />
          <div>
            <h2 className="text-h3 text-macs-gray-900 font-gliker">Availability Management</h2>
            <p className="text-sm text-macs-gray-600 font-gliker">
              Manage your available and unavailable dates
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadAvailability}
            disabled={isLoading}
            className="btn-ghost flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={saveAvailability}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <div className="spinner w-4 h-4"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDates.length > 0 && (
        <div className="card-macs p-4 bg-macs-teal-50 border border-macs-teal-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-gliker text-macs-teal-800">
                {selectedDates.length} dates selected
              </span>
              
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="input-macs text-sm"
              >
                <option value="available">Mark as Available</option>
                <option value="unavailable">Mark as Unavailable</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={applyBulkAction}
                className="btn-primary text-sm"
              >
                Apply to Selected
              </button>
              
              <button
                onClick={() => setSelectedDates([])}
                className="btn-ghost text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth(-1)}
          className="btn-ghost"
        >
          ← Previous
        </button>
        
        <h3 className="text-h4 text-macs-gray-900 font-gliker">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="btn-ghost"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="card-macs p-6">
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {daysOfWeek.map(day => (
            <div key={day} className="p-2 text-center text-sm font-gliker font-medium text-macs-brown/70">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {getDaysInMonth().map((day, index) => (
            <div
              key={index}
              onClick={() => day && selectDate(day)}
              onDoubleClick={() => day && toggleDateAvailability(day)}
              className={getDateClass(day)}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-macs-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm font-gliker">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-macs-teal-200 border border-macs-teal-400 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
          
          <p className="text-center text-xs text-macs-gray-500 mt-2 font-gliker">
            💡 Click to select dates, double-click to toggle availability
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;

