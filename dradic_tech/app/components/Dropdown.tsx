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
  className = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer",
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
          className={`size-4 stroke-2 stroke-slate-500 dark:stroke-slate-400 group-hover:stroke-brand-500 dark:group-hover:stroke-brand-400 transition-transform ${
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
          <div className="absolute z-10 w-full max-h-42 overflow-y-auto mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg">
            <div
              className="py-1 divide-y divide-slate-200 dark:divide-slate-700"
              role="listbox"
            >
              {data.map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
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
