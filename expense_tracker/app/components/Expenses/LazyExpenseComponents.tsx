import React, { Suspense } from "react";
import { CardsSkeleton, ChartsTableSkeleton } from "../SkeletonLoader";

// Lazy load the MonthlyCards component
const LazyMonthlyCards = React.lazy(() =>
  import("./Monthly/MonthlyCards").then((module) => ({
    default: module.MonthlyCards,
  })),
);

// Lazy load the MonthlyCharts component
const LazyMonthlyCharts = React.lazy(() =>
  import("./Monthly/MonthlyCharts").then((module) => ({
    default: module.MonthlyCharts,
  })),
);

interface LazyMonthlyCardsProps {
  cards: any[];
  isLoading?: boolean;
}

interface LazyMonthlyChartsProps {
  donutGraphData: any;
  tableData: any;
  onAddExpense: () => void;
  onRowClick: (row: { [key: string]: string | number }) => void;
  isLoading?: boolean;
}

export const LazyMonthlyCardsWrapper: React.FC<LazyMonthlyCardsProps> = ({
  cards,
  isLoading = false,
}) => {
  if (isLoading) {
    return <CardsSkeleton />;
  }

  return (
    <Suspense fallback={<CardsSkeleton />}>
      <LazyMonthlyCards cards={cards} />
    </Suspense>
  );
};

export const LazyMonthlyChartsWrapper: React.FC<LazyMonthlyChartsProps> = ({
  donutGraphData,
  tableData,
  onAddExpense,
  onRowClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return <ChartsTableSkeleton />;
  }

  return (
    <Suspense fallback={<ChartsTableSkeleton />}>
      <LazyMonthlyCharts
        donutGraphData={donutGraphData}
        tableData={tableData}
        onAddExpense={onAddExpense}
        onRowClick={onRowClick}
      />
    </Suspense>
  );
};
