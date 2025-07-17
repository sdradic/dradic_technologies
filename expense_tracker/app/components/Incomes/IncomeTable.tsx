import SimpleTable, { type SimpleTableProps } from "../SimpleTable";
import { PlusIconOutline } from "../Icons";

interface IncomeTableProps {
  tableData: SimpleTableProps;
  onAddIncome: () => void;
  onRowClick: (row: { [key: string]: string | number }) => void;
}

export function IncomeTable({
  tableData,
  onAddIncome,
  onRowClick,
}: IncomeTableProps) {
  return (
    <SimpleTable
      title={tableData.title}
      description={tableData.description}
      columns={tableData.columns}
      data={tableData.data}
      hasButton={true}
      buttonProps={{
        buttonText: "Add income",
        buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
        buttonClassName: "btn-primary",
        onClick: onAddIncome,
      }}
      tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[420px] overflow-x-auto"
      tableClassName="w-full p-6"
      onRowClick={onRowClick}
    />
  );
}
