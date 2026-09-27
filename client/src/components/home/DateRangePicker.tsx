import React, { useState, useEffect } from 'react';
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
  nextMonday,
  addDays,
  differenceInDays,
} from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface DateRangePickerProps {
  checkIn?: string;
  checkOut?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  focusedInput?: 'checkIn' | 'checkOut';
  onDatesChange: (
    checkIn: string,
    checkOut: string,
    nights?: number,
    start?: Date | null,
    end?: Date | null
  ) => void;
  onApply?: () => void;
  bookedDates?: string[];
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  startDate: propStartDate,
  endDate: propEndDate,
  focusedInput = 'checkIn',
  onDatesChange,
  onApply,
  bookedDates,
}) => {
  const today = startOfToday();

  const [activeInput, setActiveInput] = useState<'checkIn' | 'checkOut'>(focusedInput);
  const [startDate, setStartDate] = useState<Date | null>(propStartDate ?? null);
  const [endDate, setEndDate] = useState<Date | null>(propEndDate ?? null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    startOfMonth(propStartDate ?? today)
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Sync with props
  useEffect(() => {
    if (propStartDate !== undefined) {
      setStartDate(propStartDate);
    }
  }, [propStartDate]);

  useEffect(() => {
    if (propEndDate !== undefined) {
      setEndDate(propEndDate);
    }
  }, [propEndDate]);

  useEffect(() => {
    setActiveInput(focusedInput);
  }, [focusedInput]);

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
    const dayStr = format(day, 'yyyy-MM-dd');
    if (isBefore(day, today) || (bookedDates && bookedDates.includes(dayStr))) return;

    if (activeInput === 'checkIn') {
      // User is selecting check-in
      setStartDate(day);
      if (endDate && (isBefore(endDate, day) || isSameDay(endDate, day))) {
        setEndDate(null);
        onDatesChange(format(day, 'MMM d'), '', 0, day, null);
      } else if (endDate) {
        const nights = differenceInDays(endDate, day);
        onDatesChange(format(day, 'MMM d'), format(endDate, 'MMM d'), nights, day, endDate);
      } else {
        onDatesChange(format(day, 'MMM d'), '', 0, day, null);
      }
      // Automatically switch target to checkout
      setActiveInput('checkOut');
    } else {
      // User is selecting checkout
      if (startDate && isAfter(day, startDate)) {
        setEndDate(day);
        const nights = differenceInDays(day, startDate);
        onDatesChange(format(startDate, 'MMM d'), format(day, 'MMM d'), nights, startDate, day);
      } else {
        // If clicked on or before startDate, set as new startDate and stay on checkout
        setStartDate(day);
        setEndDate(null);
        onDatesChange(format(day, 'MMM d'), '', 0, day, null);
        setActiveInput('checkOut');
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
    const n = differenceInDays(thu, sat);
    onDatesChange(format(sat, 'MMM d'), format(thu, 'MMM d'), n, sat, thu);
    setActiveInput('checkOut');
  };

  const handlePresetNextWeek = () => {
    const mon = nextMonday(today);
    const sat = addDays(mon, 5);
    setStartDate(mon);
    setEndDate(sat);
    setCurrentMonth(startOfMonth(mon));
    const n = differenceInDays(sat, mon);
    onDatesChange(format(mon, 'MMM d'), format(sat, 'MMM d'), n, mon, sat);
    setActiveInput('checkOut');
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    onDatesChange('', '', 0, null, null);
    setActiveInput('checkIn');
  };

  // Calculate days in the current displayed month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.

  const nightsCount =
    startDate && endDate ? Math.max(0, differenceInDays(endDate, startDate)) : 0;

  return (
    <div className="w-full space-y-4 select-none">
      {/* 1. Header with Dynamic Dates & Preset Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-warm-200/60 dark:border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-ink-950 dark:text-white">
              Select Dates
            </h4>
            {nightsCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sunset-coral/15 text-sunset-coral dark:text-warm-100">
                {nightsCount} night{nightsCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-ink-500 dark:text-warm-400 mt-0.5">
            {activeInput === 'checkIn'
              ? 'Select check-in date'
              : 'Select check-out date'}
          </p>
        </div>

        {/* Preset Action Pills */}
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

      {/* 2. Check-In & Check-Out Interactive Focus Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-warm-100/90 dark:bg-ink-800/80 rounded-2xl border border-warm-200/60 dark:border-white/10">
        <button
          type="button"
          onClick={() => setActiveInput('checkIn')}
          className={`py-2 px-3.5 rounded-xl text-left transition-all ${
            activeInput === 'checkIn'
              ? 'bg-white dark:bg-ink-900 shadow-sm border border-sunset-coral/40 text-sunset-coral'
              : 'text-ink-600 dark:text-warm-300 hover:bg-white/50 dark:hover:bg-white/5'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            Check-In
          </span>
          <span className="text-xs font-bold block truncate">
            {startDate ? format(startDate, 'MMM d, yyyy') : 'Select date'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveInput('checkOut')}
          className={`py-2 px-3.5 rounded-xl text-left transition-all ${
            activeInput === 'checkOut'
              ? 'bg-white dark:bg-ink-900 shadow-sm border border-sunset-coral/40 text-sunset-coral'
              : 'text-ink-600 dark:text-warm-300 hover:bg-white/50 dark:hover:bg-white/5'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            Check-Out
          </span>
          <span className="text-xs font-bold block truncate">
            {endDate ? format(endDate, 'MMM d, yyyy') : 'Select date'}
          </span>
        </button>
      </div>

      {/* 3. Month Navigation Row */}
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

      {/* 4. Days of the Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-ink-400 dark:text-warm-400">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* 5. Calendar Days Grid */}
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
          const dayStr = format(day, 'yyyy-MM-dd');
          const isPast = isBefore(day, today);
          const isBooked = bookedDates ? bookedDates.includes(dayStr) : false;
          const isDisabled = isPast || isBooked;
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
            activeInput === 'checkOut' &&
            hoverDate &&
            isAfter(hoverDate, startDate) &&
            isAfter(day, startDate) &&
            (isBefore(day, hoverDate) || isSameDay(day, hoverDate));

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => !isDisabled && setHoverDate(day)}
              title={isBooked ? 'Already reserved' : undefined}
              className={`py-2 rounded-xl text-xs transition-all ${
                isEndpoint
                  ? 'bg-sunset-gradient text-white font-bold shadow-md scale-105 z-10'
                  : isInRange || isHoverRange
                  ? 'bg-sunset-coral/20 text-sunset-coral dark:text-warm-100 font-semibold'
                  : isBooked
                  ? 'text-rose-400 dark:text-rose-500/60 line-through opacity-40 cursor-not-allowed bg-rose-500/5'
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

      {/* 6. Footer with Current Dates and Done CTA */}
      <div className="pt-3 border-t border-warm-200/60 dark:border-white/10 flex items-center justify-between text-xs">
        <div className="text-ink-600 dark:text-warm-300 font-medium">
          {startDate ? (
            <span>
              Check-in: <strong className="text-ink-950 dark:text-white">{format(startDate, 'MMM d')}</strong>
              {endDate ? (
                <> · Check-out: <strong className="text-ink-950 dark:text-white">{format(endDate, 'MMM d')}</strong></>
              ) : (
                <span className="text-sunset-coral italic font-semibold"> &rarr; Now select check-out</span>
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
            className="px-5 py-2 rounded-full bg-sunset-gradient text-white font-bold text-xs shadow-sm hover:shadow-glow-sunset active:scale-95 transition-all"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
