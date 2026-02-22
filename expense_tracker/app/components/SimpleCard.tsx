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
    <div className="card-fintrack p-6 w-full hover:shadow-md transition-all text-left">
      <h3 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
        {title}
      </h3>
      {description && (
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
          {description}
        </span>
      )}
      <p
        className={`text-3xl font-extrabold text-gray-900 dark:text-white tracking-tighter mt-1 ${
          value >= 0 ? "" : "text-red-500"
        }`}
      >
        {formatCurrency(value, currency)}
      </p>
      {percentageChange != null && (
        <div className="mt-4 flex items-center text-xs font-bold">
          <span className={isIncrease ? "text-emerald-600" : "text-red-500"}>
            {isIncrease ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
          <span className="text-gray-400 dark:text-gray-500 font-medium ml-1.5">
            vs previous
          </span>
        </div>
      )}
    </div>
  );
}
