import React, { useState, useCallback } from "react";
import "./App.css";
import { DateRange } from "./types/date-picker";
import { DatePickerModal } from './components/DatePickerModal.tsx';

function App() {
  // State for managing dates and modal visibility
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tempDateRange, setTempDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null
  });

  /**
   * Formats a date into YYYY/MM/DD string
   */
  const formatDate = useCallback((date: Date): string => (
    `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
  ), []);

  /**
   * Calculates a date range for the last N weekdays
   */
  const getLastNWeekdays = useCallback((n: number): DateRange => {
    const endDate = new Date();
    const startDate = new Date();
    let daysToSubtract = n - 1;
    
    // Adjust end date if it falls on weekend
    while (endDate.getDay() === 0 || endDate.getDay() === 6) {
      endDate.setDate(endDate.getDate() - 1);
    }
    
    startDate.setTime(endDate.getTime());
    
    // Find start date by counting backwards, skipping weekends
    while (daysToSubtract > 0) {
      startDate.setDate(startDate.getDate() - 1);
      if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
        daysToSubtract--;
      }
    }

    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };
  }, []);

  /**
   * Calculates the date range for the previous month
   */
  const getLastMonth = useCallback((): DateRange => {
    const today = new Date();
    return {
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), 0)
    };
  }, []);

  // Preset date ranges for quick selection
  const presetRanges = [
    { label: "Last 5 Weekdays", range: getLastNWeekdays(5) },
    { label: "Last 10 Weekdays", range: getLastNWeekdays(10) },
    { label: "Last 20 Weekdays", range: getLastNWeekdays(20) },
    { 
      label: "Current Month",
      range: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date()
      }
    },
    { label: "Last Month", range: getLastMonth() }
  ];

  /**
   * Handlers for date range changes and modal interactions
   */
  const handleDateRangeChange = useCallback((range: DateRange) => {
    setTempDateRange(range);
  }, []);

  const handleOkClick = useCallback(() => {
    if (tempDateRange.startDate && tempDateRange.endDate) {
      setStartDate(tempDateRange.startDate);
      setEndDate(tempDateRange.endDate);
      setIsPickerOpen(false);
    }
  }, [tempDateRange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    setTempDateRange({ startDate: null, endDate: null });
  }, []);

  const handleOpenPicker = useCallback(() => {
    setTempDateRange({ startDate, endDate });
    setIsPickerOpen(true);
  }, [startDate, endDate]);

  return (
    <div className="app-container">
      <div className="date-input-container">
        <h1 className="date-picker-title">Date Picker</h1>
        <div className="input-wrapper">
          <input
            type="text"
            className="date-input"
            placeholder="Select date range"
            onClick={handleOpenPicker}
            value={startDate && endDate ? `${formatDate(startDate)} ~ ${formatDate(endDate)}` : ""}
            readOnly
          />
          {(startDate || endDate) && (
            <button 
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear dates"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {isPickerOpen && (
        <DatePickerModal
          onClose={() => setIsPickerOpen(false)}
          onDateRangeChange={handleDateRangeChange}
          onOkClick={handleOkClick}
          presetRanges={presetRanges}
          tempDateRange={tempDateRange}
        />
      )}
    </div>
  );
}

export default App;