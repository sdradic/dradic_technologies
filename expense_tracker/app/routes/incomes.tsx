import { HeaderControls } from "~/components/HeaderControls";
import { HeaderButton } from "~/components/HeaderButton";
import { ReloadIcon } from "~/components/Icons";
import { Suspense, useState } from "react";
import Loader from "~/components/Loader";
import { IncomesTableData } from "~/hooks/useIncomesTableData";
import IncomeModal from "~/components/IncomeModal";
import type { Income } from "~/modules/types";
import { months } from "~/modules/store";
import { Dropdown } from "~/components/Dropdown";

export default function Incomes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handleReload = () => setReloadTrigger((prev) => prev + 1);

  return (
    <div className="p-4 rounded-xl">
      {/* <IncomeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedIncome={selectedIncome}
      /> */}

      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <HeaderControls>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 sm:mt-0">
            <Dropdown
              options={months.map((month) => ({
                value: month,
                label: month,
              }))}
              value={months[month - 1]}
              onChange={(month) => {
                setMonth(months.indexOf(month) + 1);
                setReloadTrigger((prev) => prev + 1);
              }}
            />
            <HeaderButton
              onButtonClick={handleReload}
              isLoading={false}
              disabled={false}
              loadingText="Reloading..."
              buttonText="Reload Data"
              className="btn-secondary dark:bg-gray-800 dark:text-white bg-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 min-w-32"
              buttonIcon={
                <ReloadIcon className="size-5 stroke-2 stroke-primary-400 dark:stroke-white" />
              }
            />
          </div>
        </HeaderControls>
        <div className="separator my-4" />
        <div className="flex flex-col gap-4">
          <div className="p-4">
            <Suspense fallback={<Loader message="Loading incomes..." />}>
              <IncomesTableData
                setIsModalOpen={setIsModalOpen}
                reloadTrigger={reloadTrigger}
                setSelectedIncome={setSelectedIncome}
                year={year}
                month={month}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
