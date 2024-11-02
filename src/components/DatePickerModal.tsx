import React from 'react';
import { DateRange } from '../types/date-picker';
import { DateRangePicker } from './DateRangePicker.tsx';

interface DatePickerModalProps {
  onClose: () => void;
  onDateRangeChange: (range: DateRange) => void;
  onOkClick: () => void;
  presetRanges: Array<{ label: string; range: DateRange }>;
  tempDateRange: DateRange;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  onClose,
  onDateRangeChange,
  onOkClick,
  presetRanges,
  tempDateRange,
}) => {
  return (
    <div 
      className="date-picker-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="date-picker-modal">
        <DateRangePicker 
          onDateRangeChange={onDateRangeChange}
          presetRanges={presetRanges}
          initialDateRange={tempDateRange}
        />
        <div className="modal-footer">
          <button 
            className="ok-button"
            onClick={onOkClick}
            disabled={!tempDateRange.startDate || !tempDateRange.endDate}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}; 