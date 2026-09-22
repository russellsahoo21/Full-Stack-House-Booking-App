import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
  isAfter,
  startOfToday,
  nextSaturday,
  nextSunday,
  nextMonday,
  addDays,
  differenceInDays,
} from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onDatesChange: (checkIn: string, checkOut: string) => void;
  onApply?: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onDatesChange,
  onApply,
}) => {
  const today = startOfToday();

  // Initial range: today + 2 to today + 7
  const [startDate, setStartDate] = useState<Date | null>(() => addDays(today, 2));
  const [endDate, setEndDate] = useState<Date | null>(() => addDays(today, 7));
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(today));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Month navigation
  const handlePrevMonth = () => {
    const prev = subMonths(currentMonth, 1);
    if (!isBefore(startOfMonth(prev), startOfMonth(today))) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Day click handler
  const handleDayClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (!startDate || (startDate && endDate)) {
      // Start a new selection
      setStartDate(day);
      setEndDate(null);
      onDatesChange(format(day, 'MMM d'), '');
    } else if (startDate && !endDate) {
      if (isBefore(day, startDate)) {
        // Clicked before start: reset start to clicked day
        setStartDate(day);
        setEndDate(null);
        onDatesChange(format(day, 'MMM d'), '');
      } else {
        // Complete range
        setEndDate(day);
        onDatesChange(format(startDate, 'MMM d'), format(day, 'MMM d'));
      }
    }
  };

  // Preset shortcuts
  const handlePresetWeekend = () => {
    const sat = nextSaturday(today);
    const thu = addDays(sat, 5);
    setStartDate(sat);
    setEndDate(thu);
    setCurrentMonth(startOfMonth(sat));
    onDatesChange(format(sat, 'MMM d'), format(thu, 'MMM d'));
  };

  const handlePresetNextWeek = () => {
    const mon = nextMonday(today);
    const sat = addDays(mon, 5);
    setStartDate(mon);
    setEndDate(sat);
    setCurrentMonth(startOfMonth(mon));
    onDatesChange(format(mon, 'MMM d'), format(sat, 'MMM d'));
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    onDatesChange('', '');
  };

  // Calculate days in the current displayed month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.

  const nightsCount =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  const formattedRangeText =
    startDate && endDate
      ? `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d')}`
      : startDate
      ? `${format(startDate, 'MMM d')} – Select check-out`
      : 'Flexible getaway dates';

  return (
    <div className="w-full space-y-4 select-none">
      {/* 1. Header with Title, Dynamic Dates, and Quick Preset Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-warm-200/60 dark:border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-ink-950 dark:text-white">
              Select Dates
            </h4>
            {nightsCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sunset-coral/15 text-sunset-coral dark:text-warm-100">
                {nightsCount} nights
              </span>
            )}
          </div>
          <p className="text-xs text-ink-500 dark:text-warm-400 mt-0.5">
            {formattedRangeText}
          </p>
        </div>

        {/* Preset Action Pills matching exact design */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePresetWeekend}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sunset-gradient-subtle text-sunset-coral hover:bg-sunset-coral/20 active:scale-95 transition-all shadow-sm"
          >
            This Weekend
          </button>
          <button
            type="button"
            onClick={handlePresetNextWeek}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-warm-200/80 dark:bg-ink-800 text-ink-700 dark:text-warm-200 hover:bg-warm-300 dark:hover:bg-ink-700 active:scale-95 transition-all"
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

      {/* 2. Month Navigation Row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-bold text-ink-950 dark:text-white tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isBefore(startOfMonth(currentMonth), startOfMonth(today))}
            className="w-7 h-7 rounded-full border border-warm-200 dark:border-white/10 flex items-center justify-center text-ink-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-ink-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-full border border-warm-200 dark:border-white/10 flex items-center justify-center text-ink-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-ink-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="font-bold text-ink-400 dark:text-warm-400 py-1">
            {d}
          </span>
        ))}
      </div>

      {/* 4. Calendar Day Grid matching user's original design */}
      <div
        className="grid grid-cols-7 gap-2 text-center text-xs"
        onMouseLeave={() => setHoverDate(null)}
      >
        {/* Leading empty days */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`empty-${i}`} className="py-2" />
        ))}

        {/* Month Days */}
        {daysInMonth.map((day) => {
          const isPast = isBefore(day, today);
          const isStart = startDate && isSameDay(day, startDate);
          const isEnd = endDate && isSameDay(day, endDate);
          const isEndpoint = isStart || isEnd;
          const isInRange =
            startDate &&
            endDate &&
            isAfter(day, startDate) &&
            isBefore(day, endDate);

          const isHoverRange =
            startDate &&
            !endDate &&
            hoverDate &&
            isAfter(hoverDate, startDate) &&
            isAfter(day, startDate) &&
            (isBefore(day, hoverDate) || isSameDay(day, hoverDate));

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => !isPast && setHoverDate(day)}
              className={`py-2 rounded-xl text-xs transition-all ${
                isEndpoint
                  ? 'bg-sunset-gradient text-white font-bold shadow-md scale-105 z-10'
                  : isInRange || isHoverRange
                  ? 'bg-sunset-coral/20 text-sunset-coral dark:text-warm-100 font-semibold'
                  : isPast
                  ? 'text-ink-300 dark:text-warm-600 opacity-20 cursor-not-allowed'
                  : 'hover:bg-warm-200 dark:hover:bg-ink-800 text-ink-700 dark:text-warm-200 font-medium'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* 5. Footer with Current Dates and Done CTA */}
      <div className="pt-3 border-t border-warm-200/60 dark:border-white/10 flex items-center justify-between text-xs">
        <div className="text-ink-600 dark:text-warm-300 font-medium">
          {startDate ? (
            <span>
              Check-in: <strong className="text-ink-950 dark:text-white">{format(startDate, 'MMM d')}</strong>
              {endDate ? (
                <> · Check-out: <strong className="text-ink-950 dark:text-white">{format(endDate, 'MMM d')}</strong></>
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
            disabled={!startDate || !endDate}
            className="px-5 py-2 rounded-full bg-sunset-gradient text-white font-bold text-xs shadow-sm hover:shadow-glow-sunset active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
