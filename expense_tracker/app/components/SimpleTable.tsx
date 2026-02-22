import type { acceptedCurrencies } from "~/modules/store";
import { formatCurrency } from "~/modules/utils";

export interface ButtonProps {
  buttonText: string;
  buttonIcon: React.ReactNode;
  onClick: () => void;
  buttonClassName?: string;
}

export interface SimpleTableProps {
  title?: string | null;
  description?: string | null;
  columns: string[];
  data: {
    [key: string]: string | number;
  }[];
  hasButton?: boolean;
  buttonProps?: ButtonProps;
  tableContainerClassName?: string;
  tableClassName?: string;
  tableHeadClassName?: string;
  tableRowClassName?: string;
  tableHeaderClassName?: string;
  tableCellClassName?: string;
  onRowClick?: (row: { [key: string]: string | number }) => void;
}

export default function SimpleTable({
  title = null,
  description = null,
  columns,
  data,
  hasButton = false,
  buttonProps,
  tableContainerClassName = "w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden",
  tableClassName = "w-full",
  tableHeadClassName = "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800",
  tableRowClassName = "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors",
  tableHeaderClassName = "",
  tableCellClassName = "",
  onRowClick,
}: SimpleTableProps) {
  const handleRowClick = (row: { [key: string]: string | number }) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className={tableContainerClassName}>
      <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-4">
          <div className="flex flex-col w-full items-left">
            {title && (
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-left">
                {description}
              </p>
            )}
          </div>
          {hasButton && (
            <button
              type="button"
              className={`flex items-center gap-2 ${buttonProps?.buttonClassName}`}
              onClick={buttonProps?.onClick}
            >
              {buttonProps?.buttonIcon}
              {buttonProps?.buttonText}
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className={tableClassName}>
          <thead className={tableHeadClassName}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className={`px-8 py-5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-left ${tableHeaderClassName}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={`${tableRowClassName} group ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className={`px-8 py-5 text-sm font-semibold text-gray-600 dark:text-gray-400 ${tableCellClassName}`}
                    >
                      {column.toLowerCase() === "amount" &&
                      typeof row[column.replace(/\s+/g, "_").toLowerCase()] ===
                        "number" &&
                      row.currency
                        ? formatCurrency(
                            Number(
                              row[column.replace(/\s+/g, "_").toLowerCase()],
                            ),
                            row.currency as (typeof acceptedCurrencies)[number],
                          )
                        : row[column.replace(/\s+/g, "_").toLowerCase()]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 opacity-20 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <p className="font-bold tracking-tight text-gray-500 dark:text-gray-400">
                      No records found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-row justify-end mt-8"></div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden">
        {data.length > 0 ? (
          data.map((row) => (
            <div
              key={row.id}
              className={`border-t border-gray-200 dark:border-gray-500 p-4 ${
                onRowClick
                  ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  : ""
              }`}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((column) => (
                <div
                  key={column}
                  className="flex justify-between items-center py-1"
                >
                  <span className=" text-gray-500 dark:text-gray-400">
                    {column}:
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    {column.toLowerCase() === "amount" &&
                    typeof row[column.replace(/\s+/g, "_").toLowerCase()] ===
                      "number" &&
                    row.currency
                      ? formatCurrency(
                          Number(
                            row[column.replace(/\s+/g, "_").toLowerCase()],
                          ),
                          row.currency as (typeof acceptedCurrencies)[number],
                        )
                      : row[column.replace(/\s+/g, "_").toLowerCase()]}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-8">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No records found
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-end mt-2"></div>
    </div>
  );
}
