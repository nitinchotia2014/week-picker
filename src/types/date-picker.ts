export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  weekendDates?: Date[];
}

export interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange) => void;
  presetRanges?: {
    label: string;
    range: DateRange;
  }[];
  initialDateRange?: DateRange;
}

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
