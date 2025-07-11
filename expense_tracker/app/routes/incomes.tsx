import { HeaderControls } from "~/components/HeaderControls";
import { MonthlyIncomesPage } from "~/pages/MonthlyIncomesPage";

export default function Incomes() {
  return (
    <div className="p-4 rounded-xl">
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
        <HeaderControls />
        <div className="separator my-4" />
        <div className="flex flex-col gap-4 p-4">
          <MonthlyIncomesPage />
        </div>
      </div>
    </div>
  );
}
