import { type acceptedCurrencies } from "./store";

export function formatCurrency(
  value: number,
  currency: (typeof acceptedCurrencies)[number]
) {
  // Ensure we have a valid currency, fallback to CLP if not
  const validCurrency = currency && currency.length === 3 ? currency : "CLP";

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: validCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
