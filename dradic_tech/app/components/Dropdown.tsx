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

// Uses Dradic color palette (brand-* as in index.tsx)
export const Dropdown = ({
  id,
  defaultValue,
  onChange,
  disabled = false,
  className = "w-full px-4 py-3 border border-brand-300 dark:border-brand-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer transition-colors",
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
        className={`${className} flex items-center justify-between group`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select option. Current value: ${defaultValue || "none"}`}
      >
        <span>
          {defaultValue ? (
            defaultValue
          ) : (
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              Select a category...
            </span>
          )}
        </span>
        <DynamicChevronIcon
          className={`size-4 stroke-2 stroke-brand-600 dark:stroke-brand-400 group-hover:stroke-brand-500 dark:group-hover:stroke-brand-400 transition-transform ${
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
          <div className="absolute z-10 w-full max-h-60 overflow-y-auto mt-2 bg-white dark:bg-slate-950 border border-brand-200 dark:border-brand-700 rounded-xl shadow-xl">
            <div
              className="py-1 divide-y divide-brand-100 dark:divide-brand-800"
              role="listbox"
            >
              {data.map((item) => (
                <div
                  key={item}
                  className={`px-4 py-3 cursor-pointer transition-colors
                    ${
                      defaultValue === item
                        ? "bg-brand-50 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-bold"
                        : "hover:bg-brand-100 dark:hover:bg-brand-800 text-slate-800 dark:text-slate-100"
                    }
                  `}
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
