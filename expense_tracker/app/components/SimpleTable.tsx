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
  tableContainerClassName = "w-full bg-white dark:bg-gray-800 rounded-lg",
  tableClassName = "w-full p-6",
  tableHeadClassName = "border-b bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-500",
  tableRowClassName = "border-b border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700",
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
      <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-4">
          <div className="flex flex-col w-full items-left">
            <h2 className="text-xl sm:text-2xl text-left text-gray-800 dark:text-white  mb-2">
              {title}
            </h2>
            {description && (
              <p className="text-sm sm:text-base text-gray-400 dark:text-gray-600 text-left mb-4">
                {description}
              </p>
            )}
          </div>
          {hasButton && (
            <div
              className={` ${buttonProps?.buttonClassName}`}
              onClick={buttonProps?.onClick}
            >
              {buttonProps?.buttonIcon}
              {buttonProps?.buttonText}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <table className={tableClassName}>
          <thead className={tableHeadClassName}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className={`px-4 py-2 ${tableHeaderClassName}`}
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
                  className={`${tableRowClassName} ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className={`px-4 py-2 ${tableCellClassName}`}
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
                <td colSpan={columns.length} className="px-4 py-2 pt-8">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No records found
                  </p>
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
              className={`border-y border-gray-200 dark:border-gray-500 p-4 ${
                onRowClick
                  ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  : ""
              }`}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((column) => (
                <div
                  key={column}
                  className="flex justify-between items-center py-2"
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
