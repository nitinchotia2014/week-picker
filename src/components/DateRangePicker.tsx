import React from "react";
import { DateRange, DateRangePickerProps } from "../types/date-picker";
import { useCalendarState } from "../hooks/useCalendarState.ts";
import { useDateSelection } from "../hooks/useDateSelection.ts";

/**
 * DateRangePicker Component
 * Renders a calendar interface for selecting date ranges with weekend handling
 * and preset range options
 */
export function DateRangePicker({ 
  onDateRangeChange, 
  presetRanges,
  initialDateRange 
}: DateRangePickerProps) {
  // Calendar state management
  const {
    currentMonth,
    setCurrentMonth,
    isSelectingYear,
    setIsSelectingYear,
    isSelectingMonth,
    setIsSelectingMonth,
    months,
    yearOptions,
    handleYearClick,
    handleMonthClick,
    changeMonth,
    getDaysInMonth
  } = useCalendarState(initialDateRange?.startDate);

  // Date selection state and handlers
  const {
    startDate,
    endDate,
    handleDateClick,
    handlePresetClick,
    isInRange,
    isWeekend,
    formatDate,
    getWeekendDatesInRange
  } = useDateSelection(onDateRangeChange, initialDateRange);

  /**
   * Handles preset range selection and updates current month view
   */
  const handlePresetSelection = (range: DateRange) => {
    const newStartDate = handlePresetClick(range);
    if (newStartDate) {
      setCurrentMonth(new Date(newStartDate));
    }
  };

  /**
   * Formats date in YYYY/MM/DD format
   */
  const formatDateForDisplay = (date: Date): string => (
    `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
  );

  /**
   * Gets formatted weekend dates within selected range
   */
  const getWeekendDatesDisplay = (): string[] => {
    if (!startDate || !endDate) return [];
    return getWeekendDatesInRange(startDate, endDate)
      .map(formatDateForDisplay);
  };

  // Calendar header controls
  const renderCalendarHeader = () => (
    <div className="date-picker-header">
      <button onClick={() => changeMonth(-1)}>&lt;</button>
      <div className="date-picker-selectors">
        <button 
          className={`month-year-button ${isSelectingMonth ? 'active' : ''}`}
          onClick={() => {
            setIsSelectingMonth(!isSelectingMonth);
            setIsSelectingYear(false);
          }}
        >
          {currentMonth.toLocaleDateString("en-US", { month: "long" })}
        </button>
        <button 
          className={`month-year-button ${isSelectingYear ? 'active' : ''}`}
          onClick={() => {
            setIsSelectingYear(!isSelectingYear);
            setIsSelectingMonth(false);
          }}
        >
          {currentMonth.getFullYear()}
        </button>
      </div>
      <button onClick={() => changeMonth(1)}>&gt;</button>
    </div>
  );

  // Calendar day rendering with all necessary classes
  const renderDay = (date: Date | null, index: number) => (
    <div
      key={index}
      className={`day ${date ? "" : "empty"} 
        ${date && isWeekend(date) ? "weekend" : ""} 
        ${date && isInRange(date) ? "in-range" : ""} 
        ${date && date.getTime() === startDate?.getTime() ? "start-date" : ""} 
        ${date && date.getTime() === endDate?.getTime() ? "end-date" : ""}`}
      onClick={() => date && handleDateClick(date)}
    >
      {date ? date.getDate() : ""}
    </div>
  );

  return (
    <div className="date-picker">
      {renderCalendarHeader()}

      {isSelectingYear ? (
        <div className="year-selector">
          {yearOptions.map(year => (
            <div
              key={year}
              className={`year-option ${year === currentMonth.getFullYear() ? "selected" : ""}`}
              onClick={() => handleYearClick(year)}
            >
              {year}
            </div>
          ))}
        </div>
      ) : isSelectingMonth ? (
        <div className="month-selector">
          {months.map((month, index) => (
            <div
              key={month}
              className={`month-option ${index === currentMonth.getMonth() ? "selected" : ""}`}
              onClick={() => handleMonthClick(index)}
            >
              {month}
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
              <div key={day}>{day}</div>
            )}
          </div>
          <div className="days">
            {getDaysInMonth().map((date, index) => renderDay(date, index))}
          </div>
        </div>
      )}

      <div className="selected-dates">
        <p><b>Start Date:</b> {formatDate(startDate) || 'YYYY/MM/dd'}</p>
        <p><b>End Date:</b> {formatDate(endDate) || 'YYYY/MM/dd'}</p>
      </div>

      {startDate && endDate && (
        <div className="date-range-display">
          <div className="selected-range">
            <h4>Selected Range:</h4>
            <p>[{formatDateForDisplay(startDate)}, {formatDateForDisplay(endDate)}]</p>
          </div>
          <div className="weekend-dates">
            <h4>Weekend Dates:</h4>
            <p>[{getWeekendDatesDisplay().join(', ')}]</p>
          </div>
        </div>
      )}

      {presetRanges?.length > 0 && (
        <div className="preset-ranges">
          {presetRanges.map((preset, index) => (
            <button
              key={index}
              className="preset-range-button"
              onClick={() => handlePresetSelection(preset.range)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 