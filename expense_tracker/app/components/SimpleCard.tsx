import type { acceptedCurrencies } from "~/modules/store";
import { formatCurrency } from "~/modules/utils";

export interface SimpleCardProps {
  title: string;
  description?: string | null;
  value: number;
  currency?: (typeof acceptedCurrencies)[number];
  previousValue?: number | null;
  canEdit?: boolean;
  onValueChange?: (newValue: number) => void;
  inCarrousel?: boolean;
}

export default function SimpleCard({
  title,
  description = null,
  value,
  currency = "CLP",
  previousValue = null,
}: SimpleCardProps) {
  const isIncrease = value > (previousValue ?? 0);
  const percentageChange =
    value && previousValue
      ? ((value - previousValue) / previousValue) * 100
      : null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6 w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl mb-2">{title}</h2>
        {description && (
          <p className="text-sm sm:text-base text-gray-400 dark:text-gray-600 mb-4">
            {description}
          </p>
        )}
        <div className="flex flex-col items-center justify-center md:flex-row gap-2 sm:gap-4 w-full">
          <p
            className={`text-lg sm:text-xl md:text-2xl w-full ${
              value >= 0 ? "" : "text-red-500"
            }`}
          >
            {formatCurrency(value, currency)}
          </p>
          {percentageChange && (
            <p
              className={`text-sm w-full ${
                isIncrease
                  ? "text-primary-500 dark:text-primary-400"
                  : "text-red-400 dark:text-red-400"
              }`}
            >
              {isIncrease ? "+" : null}
              {percentageChange.toFixed(2)}%
            </p>
          )}
        </div>
      </div>
    </>
  );
}
