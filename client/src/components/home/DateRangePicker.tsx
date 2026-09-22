import React, { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/src/style.css';
import { format, addDays, nextSaturday, nextSunday, nextMonday, startOfToday, isBefore, differenceInDays } from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw, Check, Sparkles } from 'lucide-react';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onDatesChange: (checkIn: string, checkOut: string, from?: Date, to?: Date) => void;
  onApply?: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onDatesChange,
  onApply,
}) => {
  const today = startOfToday();

  // Internal state for DayPicker
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(() => {
    // Default initial dates if not set or parse from standard Nov fallback
    const defaultFrom = addDays(today, 2);
    const defaultTo = addDays(today, 7);
    return { from: defaultFrom, to: defaultTo };
  });

  // Keep state in sync with props if checkIn and checkOut change externally
  const handleSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);

    if (range?.from && range?.to) {
      const formattedFrom = format(range.from, 'MMM d');
      const formattedTo = format(range.to, 'MMM d');
      onDatesChange(formattedFrom, formattedTo, range.from, range.to);
    } else if (range?.from) {
      const formattedFrom = format(range.from, 'MMM d');
      onDatesChange(formattedFrom, '', range.from, undefined);
    } else {
      onDatesChange('', '', undefined, undefined);
    }
  };

  // Quick preset shortcuts
  const handlePresetWeekend = () => {
    const sat = nextSaturday(today);
    const sun = nextSunday(sat);
    const nextThu = addDays(sat, 5); // 5-day getaway like screenshot Nov 14-19
    const range: DateRange = { from: sat, to: nextThu };
    setSelectedRange(range);
    onDatesChange(format(sat, 'MMM d'), format(nextThu, 'MMM d'), sat, nextThu);
  };

  const handlePresetNextWeek = () => {
    const mon = nextMonday(today);
    const sat = addDays(mon, 5);
    const range: DateRange = { from: mon, to: sat };
    setSelectedRange(range);
    onDatesChange(format(mon, 'MMM d'), format(sat, 'MMM d'), mon, sat);
  };

  const handleReset = () => {
    setSelectedRange(undefined);
    onDatesChange('', '', undefined, undefined);
  };

  const nightsCount =
    selectedRange?.from && selectedRange?.to
      ? differenceInDays(selectedRange.to, selectedRange.from)
      : 0;

  return (
    <div className="w-full space-y-4">
      {/* Popover Header with Title and Quick Preset Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-warm-200/60 dark:border-white/10 gap-3">
        <div>
          <h4 className="text-sm font-bold text-ink-950 dark:text-white flex items-center gap-1.5">
            <span>Select Dates</span>
            {nightsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sunset-gradient-subtle text-sunset-coral font-semibold">
                {nightsCount} night{nightsCount > 1 ? 's' : ''}
              </span>
            )}
          </h4>
          <p className="text-xs text-ink-500 dark:text-warm-400 mt-0.5">
            {selectedRange?.from && selectedRange?.to ? (
              <span className="text-ink-900 dark:text-white font-medium">
                {format(selectedRange.from, 'MMM d')} – {format(selectedRange.to, 'MMM d')}
              </span>
            ) : selectedRange?.from ? (
              <span className="text-sunset-coral font-medium">Select check-out date</span>
            ) : (
              'Flexible getaway dates'
            )}
          </p>
        </div>

        {/* Quick Selection Buttons matching user design */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePresetWeekend}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-sunset-gradient-subtle text-sunset-coral hover:bg-sunset-coral/20 active:scale-95 transition-all shadow-sm"
          >
            This Weekend
          </button>
          <button
            type="button"
            onClick={handlePresetNextWeek}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-warm-200/80 dark:bg-ink-800 text-ink-700 dark:text-warm-200 hover:bg-warm-300 dark:hover:bg-ink-700 active:scale-95 transition-all"
          >
            Next Week
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset dates"
            className="p-1.5 rounded-full text-ink-400 hover:text-ink-700 dark:hover:text-white hover:bg-warm-200/60 dark:hover:bg-ink-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* React DayPicker Calendar Styled with Wayfound Theme */}
      <div className="wayfound-calendar-wrapper flex justify-center py-1">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={{ before: today }}
          showOutsideDays={false}
          className="wayfound-daypicker"
        />
      </div>

      {/* Footer Info & Apply Button */}
      <div className="pt-3 border-t border-warm-200/60 dark:border-white/10 flex items-center justify-between text-xs">
        <div className="text-ink-500 dark:text-warm-400 font-medium">
          {checkIn ? (
            <span>
              Check-in: <strong className="text-ink-900 dark:text-white">{checkIn}</strong>
              {checkOut ? (
                <> · Check-out: <strong className="text-ink-900 dark:text-white">{checkOut}</strong></>
              ) : (
                <span className="text-sunset-coral italic"> (select check-out)</span>
              )}
            </span>
          ) : (
            'Select arrival date'
          )}
        </div>

        {onApply && (
          <button
            type="button"
            onClick={onApply}
            disabled={!selectedRange?.from || !selectedRange?.to}
            className="px-4 py-1.5 rounded-full bg-sunset-gradient text-white font-bold text-xs shadow-sm hover:shadow-glow-sunset active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
