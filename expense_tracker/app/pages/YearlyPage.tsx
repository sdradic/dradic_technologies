import { useState } from "react";
import SimpleCard, { type SimpleCardProps } from "~/components/SimpleCard";
import SimpleTable, { type SimpleTableProps } from "~/components/SimpleTable";
import { formatCurrency } from "~/modules/utils";

export default function YearlyExpenses() {
  const [cards, setCards] = useState<SimpleCardProps[]>([
    {
      title: "Total Income",
      description: "Total income for the year",
      value: 3000000 * 12,
      currency: "CLP",
      symbol: "$",
      previousValue: 2000000 * 12,
    },
    {
      title: "Total Expenses",
      description: "Total expenses for the year",
      value: 1000000 * 12,
      currency: "CLP",
      symbol: "$",
      previousValue: 800000 * 12,
    },
    {
      title: "Total Savings",
      description: "Total savings for the year",
      value: 50000 * 12,
      currency: "CLP",
      symbol: "$",
      previousValue: 1000000 * 12,
    },
  ]);
  const [tableData, setTableData] = useState<SimpleTableProps>({
    title: new Date().toLocaleString("default", { year: "numeric" }),
    description: "Click on a month to view the expenses.",
    columns: ["Month", "Total Income", "Total Expenses", "Total Savings"],
    data: [
      {
        id: 1,
        month: "January",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 2,
        month: "February",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 3,
        month: "March",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 4,
        month: "April",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 5,
        month: "May",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 6,
        month: "June",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 7,
        month: "July",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 8,
        month: "August",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 9,
        month: "September",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 10,
        month: "October",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 11,
        month: "November",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
      {
        id: 12,
        month: "December",
        total_income: formatCurrency(100000, "CLP"),
        total_expenses: formatCurrency(200000, "CLP"),
        total_savings: formatCurrency(300000, "CLP"),
      },
    ],
  });
  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <SimpleCard
            key={card.title}
            title={card.title}
            description={card.description}
            value={card.value}
            currency={card.currency}
            symbol={card.symbol}
            previousValue={card.previousValue}
          />
        ))}
      </div>
      <div className="mt-4">
        <SimpleTable
          title={tableData.title}
          description={tableData.description}
          columns={tableData.columns}
          data={tableData.data}
          tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg"
          tableClassName="w-full p-6"
        />
      </div>
    </div>
  );
}
