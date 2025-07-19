import React, { Suspense } from "react";
import { TableSkeleton } from "../SkeletonLoader";
import type { SimpleTableProps } from "../SimpleTable";

// Lazy load the IncomeTable component
const LazyIncomeTable = React.lazy(() =>
  import("./IncomeTable").then((module) => ({
    default: module.IncomeTable,
  })),
);

interface LazyIncomeTableProps {
  tableData: SimpleTableProps;
  onAddIncome: () => void;
  onRowClick: (row: { [key: string]: string | number }) => void;
  isLoading?: boolean;
}

export const LazyIncomeTableWrapper: React.FC<LazyIncomeTableProps> = ({
  tableData,
  onAddIncome,
  onRowClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Suspense fallback={<TableSkeleton />}>
      <LazyIncomeTable
        tableData={tableData}
        onAddIncome={onAddIncome}
        onRowClick={onRowClick}
      />
    </Suspense>
  );
};
