import { useState, useCallback } from "react";
import { DateRange } from "../types/date-picker";

/**
 * Hook for managing date range selection logic
 * @param onDateRangeChange - Callback function when date range changes
 * @param initialDateRange - Optional initial date range
 * @returns Object containing date selection state and methods
 */
export const useDateSelection = (
  onDateRangeChange: (range: DateRange) => void,
  initialDateRange?: DateRange
) => {
  const [startDate, setStartDate] = useState<Date | null>(
    initialDateRange?.startDate || null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialDateRange?.endDate || null
  );
  const [isSelectingStart, setIsSelectingStart] = useState(true);

  /**
   * Checks if a date is a weekend (Saturday or Sunday)
   * @param date - Date to check
   * @returns boolean indicating if date is a weekend
   */
  const isWeekend = useCallback((date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  }, []);

  /**
   * Handles click on a date in the calendar
   * @param date - Selected date
   */
  const handleDateClick = useCallback(
    (date: Date) => {
      if (isWeekend(date)) return;

      if (isSelectingStart) {
        setStartDate(date);
        setEndDate(null);
        setIsSelectingStart(false);
      } else {
        const newStartDate = startDate as Date;
        if (date < newStartDate) {
          setStartDate(date);
          setEndDate(newStartDate);
        } else {
          setEndDate(date);
        }
        setIsSelectingStart(true);
      }

      onDateRangeChange({
        startDate: isSelectingStart ? date : startDate,
        endDate: isSelectingStart ? null : date,
      });
    },
    [isSelectingStart, startDate, onDateRangeChange, isWeekend]
  );

  /**
   * Handles selection of preset date range
   * @param range - Preset date range to apply
   * @returns The new start date or null
   */
  const handlePresetClick = useCallback(
    (range: DateRange): Date | null => {
      setStartDate(range.startDate);
      setEndDate(range.endDate);
      setIsSelectingStart(true);
      onDateRangeChange(range);
      return range.startDate;
    },
    [onDateRangeChange]
  );

  /**
   * Checks if a date is within the selected range
   * @param date - Date to check
   * @returns boolean indicating if date is in range
   */
  const isInRange = useCallback(
    (date: Date | null): boolean => {
      if (!startDate || !endDate || !date) return false;

      const normalizeDate = (d: Date): Date => {
        const normalized = new Date(d);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
      };

      const compareDate = normalizeDate(date);
      const rangeStart = normalizeDate(startDate);
      const rangeEnd = normalizeDate(endDate);

      return (
        compareDate >= rangeStart && compareDate <= rangeEnd && !isWeekend(date)
      );
    },
    [startDate, endDate, isWeekend]
  );

  /**
   * Gets all weekend dates within the selected range
   * @param start - Start date of range
   * @param end - End date of range
   * @returns Array of weekend dates
   */
  const getWeekendDatesInRange = useCallback(
    (start: Date, end: Date): Date[] => {
      const weekends: Date[] = [];
      const current = new Date(start);

      while (current <= end) {
        if (isWeekend(current)) {
          weekends.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }

      return weekends;
    },
    [isWeekend]
  );

  /**
   * Formats date for display
   * @param date - Date to format
   * @returns Formatted date string
   */
  const formatDate = useCallback((date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return {
    startDate,
    endDate,
    isSelectingStart,
    handleDateClick,
    handlePresetClick,
    isInRange,
    isWeekend,
    formatDate,
    getWeekendDatesInRange,
  };
};
