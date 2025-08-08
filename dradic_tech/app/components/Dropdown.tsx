import { useState } from "react";
import { DynamicChevronIcon } from "./Icons";

interface DropdownProps {
  id: string;
  defaultValue: string;
  onChange: (value: string) => void;
  data: string[];
  disabled?: boolean;
  className?: string;
}

export const Dropdown = ({
  id,
  defaultValue,
  onChange,
  disabled = false,
  className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100 cursor-pointer",
  data,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        id={id}
        onClick={disabled ? undefined : handleToggle}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          } else if (e.key === "Escape" && isOpen) {
            setIsOpen(false);
          }
        }}
        className={`${className} flex items-center justify-between`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select option. Current value: ${defaultValue || "none"}`}
      >
        <span>{defaultValue || "Select a category..."}</span>
        <DynamicChevronIcon
          className={`size-4 stroke-2 stroke-gray-500 dark:stroke-gray-100 group-hover:stroke-primary-500 dark:group-hover:stroke-primary-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            tabIndex={-1}
            role="presentation"
          />
          <div className="absolute z-10 w-full max-h-42 overflow-y-auto mt-1 bg-white dark:bg-dark-500 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
            <div
              className="py-1 divide-y divide-gray-200 dark:divide-gray-700"
              role="listbox"
            >
              {data.map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-400"
                  role="option"
                  tabIndex={0}
                  aria-selected={defaultValue === item}
                  onClick={() => {
                    onChange(item);
                    setIsOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChange(item);
                      setIsOpen(false);
                    }
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
