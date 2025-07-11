import { lazy } from "react";
import { HeaderControls } from "~/components/HeaderControls";

const MonthlyExpensesPage = lazy(() => import("../pages/MonthlyExpensesPage"));
export default function Expenses() {
  return (
    <div className="p-4 rounded-xl">
      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <HeaderControls />
        <div className="separator my-4" />
        <div className="flex flex-col gap-4 p-4">
          <MonthlyExpensesPage />
        </div>
      </div>
    </div>
  );
}
