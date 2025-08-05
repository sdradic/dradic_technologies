import { useState, useRef, useEffect } from "react";
import { CalendarIcon, LeftArrowIcon, RightArrowIcon } from "./Icons";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
}

export const DatePicker = ({
  value,
  onChange,
  className = "",
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date(),
  );
  const [shouldFlip, setShouldFlip] = useState<boolean>(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkPosition = () => {
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 280; // Approximate height of the calendar dropdown
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If there's not enough space below but enough space above, flip the dropdown
      setShouldFlip(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
    }
  };

  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen) {
      // Check position before opening
      setTimeout(checkPosition, 0);
    }

    setIsOpen(!isOpen);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateSelect = (date: Date) => {
    if (disabled) return;
    setSelectedDate(date);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = formatDate(date) === value;
      const isDisabled = ((minDate && formatDate(date) < minDate) ||
        (maxDate && formatDate(date) > maxDate)) as boolean;

      days.push(
        <button
          key={day}
          type="button"
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-primary-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => !isDisabled && handleDateSelect(date)}
          disabled={isDisabled}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  return (
    <div
      className={`relative ${className} ${disabled ? "opacity-50" : ""}`}
      ref={datePickerRef}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full px-4 py-2 text-left bg-white dark:bg-gray-800 border rounded-lg transition-colors
          ${isOpen ? "border-primary-500 ring-2 ring-primary-500" : "border-gray-300 dark:border-gray-700"}
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
        disabled={disabled}
        tabIndex={0}
      >
        <div className="flex items-center justify-between">
          <span className="block truncate">{value || "Select a date"}</span>
          <CalendarIcon
            className={`w-5 h-5 ml-2 transition-transform duration-200 ${
              isOpen ? "stroke-primary-500" : "stroke-gray-500"
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg ${
            shouldFlip ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                disabled={disabled}
              >
                <LeftArrowIcon className="w-5 h-5" />
              </button>
              <div className="text-sm ">
                {selectedDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                disabled={disabled}
              >
                <RightArrowIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm  text-gray-500 dark:text-gray-400"
                >
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
