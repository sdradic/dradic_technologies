import SimpleDonutGraph, {
  type SimpleDonutGraphProps,
} from "~/components/SimpleDonutGraph";
import SimpleTable, { type SimpleTableProps } from "~/components/SimpleTable";
import { PlusIconOutline } from "~/components/Icons";

interface MonthlyChartsProps {
  donutGraphData: SimpleDonutGraphProps;
  tableData: SimpleTableProps;
  onAddExpense: () => void;
  onRowClick: (row: { [key: string]: string | number }) => void;
}

export function MonthlyCharts({
  donutGraphData,
  tableData,
  onAddExpense,
  onRowClick,
}: MonthlyChartsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-4">
      <div className="w-full lg:w-1/2">
        <SimpleDonutGraph
          title={donutGraphData.title}
          description={donutGraphData.description}
          data={donutGraphData.data}
        />
      </div>
      <div className="w-full lg:w-1/2">
        <SimpleTable
          title={tableData.title}
          description={tableData.description}
          columns={tableData.columns}
          data={tableData.data}
          hasButton={true}
          buttonProps={{
            buttonText: "Add expense",
            buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
            buttonClassName: "btn-primary",
            onClick: onAddExpense,
          }}
          tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[420px] overflow-x-auto"
          tableClassName="w-full p-6"
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
}
