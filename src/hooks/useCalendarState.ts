import { useState, useCallback } from "react";

/**
 * Hook for managing calendar state and navigation
 * @param initialDate - Optional initial date to set the calendar view
 * @returns Object containing calendar state and methods
 */
export const useCalendarState = (initialDate?: Date | null) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialDate || new Date()
  );
  const [isSelectingYear, setIsSelectingYear] = useState(false);
  const [isSelectingMonth, setIsSelectingMonth] = useState(false);

  // Pre-computed array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /**
   * Generates an array of years around the current year
   * @returns Array of years for selection
   */
  const generateYearOptions = useCallback((): number[] => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  }, []);

  /**
   * Handles year selection
   * @param year - Selected year
   */
  const handleYearClick = useCallback((year: number) => {
    setCurrentMonth((prevMonth) => {
      const newDate = new Date(prevMonth);
      newDate.setFullYear(year);
      return newDate;
    });
    setIsSelectingYear(false);
  }, []);

  /**
   * Handles month selection
   * @param monthIndex - Index of selected month (0-11)
   */
  const handleMonthClick = useCallback((monthIndex: number) => {
    setCurrentMonth((prevMonth) => {
      const newDate = new Date(prevMonth);
      newDate.setMonth(monthIndex);
      return newDate;
    });
    setIsSelectingMonth(false);
  }, []);

  /**
   * Changes current month by specified offset
   * @param offset - Number of months to move forward (positive) or backward (negative)
   */
  const changeMonth = useCallback((offset: number) => {
    setCurrentMonth((prevMonth) => {
      const newDate = new Date(prevMonth);
      newDate.setMonth(prevMonth.getMonth() + offset);
      return newDate;
    });
  }, []);

  /**
   * Gets array of dates for current month view, including null for padding days
   * @returns Array of dates or null values for the current month grid
   */
  const getDaysInMonth = useCallback((): (Date | null)[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Create array with padding for start of month
    const days: (Date | null)[] = Array(firstDay.getDay()).fill(null);

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  return {
    currentMonth,
    setCurrentMonth,
    isSelectingYear,
    setIsSelectingYear,
    isSelectingMonth,
    setIsSelectingMonth,
    months,
    yearOptions: generateYearOptions(),
    handleYearClick,
    handleMonthClick,
    changeMonth,
    getDaysInMonth,
  };
};
