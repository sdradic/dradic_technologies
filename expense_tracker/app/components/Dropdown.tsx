import { useState, useRef, useEffect } from "react";
import { ChevronWithTransform } from "./Icons";

interface DropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative inline-block text-left w-full ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`inline-flex justify-between w-full rounded-md border px-4 py-2 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-100
          border-gray-200 dark:border-gray-700
          ${!disabled ? "focus:outline-none cursor-pointer" : "cursor-not-allowed"}
          ${isOpen ? "ring-2 ring-primary-500 border-primary-500 dark:border-primary-500" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        tabIndex={0}
      >
        <div className="flex items-center justify-between w-full py-0.5">
          <span className="block truncate">
            {selectedOption?.label || placeholder}
          </span>
          <ChevronWithTransform
            className={`w-5 h-5 ml-2 transition-transform duration-200 text-gray-500 dark:text-gray-400 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 mb-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <ul className="py-1 max-h-32 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  value === option.value
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
