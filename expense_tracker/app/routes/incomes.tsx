import { HeaderControls } from "~/components/HeaderControls";
import { HeaderButton } from "~/components/HeaderButton";
import { ReloadIcon, PlusIconOutline } from "~/components/Icons";
import { useState, Suspense } from "react";
import { CreateEditModal } from "~/components/CreateEditModal";
import type { Income } from "~/modules/types";
import { months } from "~/modules/store";
import { Dropdown } from "~/components/Dropdown";
import { incomeSourcesApi, incomesApi, formatDate } from "~/modules/apis";
import useIncomeSources from "~/hooks/useIncomeSources";
import { useAuth } from "~/contexts/AuthContext";
import Loader from "~/components/Loader";
import SimpleTable from "~/components/SimpleTable";
import { useIncomesTableData } from "~/hooks/useIncomesTableData";
import EmptyState from "~/components/EmptyState";

// Separate component that can suspend
function IncomesContent({
  reloadTrigger,
  year,
  month,
  setIsModalOpen,
  setSelectedIncome,
}: {
  reloadTrigger: number;
  year: number;
  month: number;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedIncome: (income: Income | null) => void;
}) {
  const { table, incomes, isLoading } = useIncomesTableData({
    reloadTrigger,
    year,
    month,
  });

  if (isLoading) {
    return <Loader message="Loading incomes..." />;
  }

  return (
    <>
      {!isLoading && table.data.length > 0 ? (
        <SimpleTable
          title={`${months[month - 1]} ${year}`}
          description="Click on an income to edit or delete."
          columns={[
            "Source",
            "Category",
            "Amount",
            "Date",
            "Description",
            "Recurring",
          ]}
          data={table.data.map((row: any) => ({
            id: row.id,
            source: row.name,
            category: row.category,
            amount: row.amount,
            date: formatDate(row.date),
            description: row.description,
            recurring: "recurring" in row && row.recurring ? "Yes" : "No",
          }))}
          hasButton={true}
          buttonProps={{
            buttonText: "Add income",
            buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
            buttonClassName: "btn-primary",
            onClick: () => {
              setSelectedIncome(null);
              setIsModalOpen(true);
            },
          }}
          tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-0 sm:min-h-[420px] overflow-x-auto"
          tableClassName="w-full p-6"
          onRowClick={(row: any) => {
            // Find the full income object from the incomes array
            const fullIncome = incomes.find(
              (income: Income) => income.id === row.id,
            );
            if (fullIncome) {
              // Use the full income object with all required fields
              const incomeToEdit: Income = {
                id: fullIncome.id,
                source_id: fullIncome.source_id,
                amount: fullIncome.amount,
                currency: fullIncome.currency,
                date: fullIncome.date,
                description: fullIncome.description || "",
                created_at: fullIncome.created_at,
                updated_at: fullIncome.updated_at,
              };
              setSelectedIncome(incomeToEdit);
            }
            setIsModalOpen(true);
          }}
        />
      ) : (
        <EmptyState
          title="No incomes yet"
          description="You don't have any incomes yet."
          button={{
            text: "Add income",
            icon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
            onClick: () => {
              setSelectedIncome(null);
              setIsModalOpen(true);
            },
          }}
        />
      )}
    </>
  );
}

export default function Incomes() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [year] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [sourcesReloadTrigger, setSourcesReloadTrigger] = useState(0);

  const handleReload = () => setReloadTrigger((prev) => prev + 1);

  // Use the hook to get income sources
  const { sources: incomeSources } = useIncomeSources({
    reloadTrigger: sourcesReloadTrigger,
  });

  const handleSave = async (data: any) => {
    try {
      if (data.mode === "income-source") {
        if (data.isEdit && data.editId) {
          // Update income source
          await incomeSourcesApi.update(data.editId, data);
        } else {
          // Create income source
          await incomeSourcesApi.create(data);
        }
        // Trigger reload to refresh the income sources
        setSourcesReloadTrigger((prev) => prev + 1);
      } else if (data.mode === "income") {
        if (data.isEdit && data.editId) {
          // Update income
          await incomesApi.update(data.editId, data);
        } else {
          // Create income
          await incomesApi.create(data);
        }
        // Trigger reload to refresh the data
        setReloadTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error saving:", error);
      // TODO: Add proper error handling/toast notification
    }
  };

  const handleDelete = async (id: string, mode: string) => {
    try {
      if (mode === "income-source") {
        // Delete income source
        await incomeSourcesApi.delete(id);
        // Trigger reload to refresh the income sources
        setSourcesReloadTrigger((prev) => prev + 1);
      } else if (mode === "income") {
        // Delete income
        await incomesApi.delete(id);
        // Trigger reload to refresh the data
        setReloadTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // TODO: Add proper error handling/toast notification
    }
  };

  return (
    <div className="p-4 rounded-xl">
      <CreateEditModal
        mode="income"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={handleSave}
        onDelete={handleDelete}
        userId={user?.id}
        editData={selectedIncome || undefined}
        incomeSources={incomeSources}
      />

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
        <div className="flex flex-col gap-4 p-4">
          <Suspense fallback={<Loader message="Loading incomes..." />}>
            <IncomesContent
              reloadTrigger={reloadTrigger}
              year={year}
              month={month}
              setIsModalOpen={setIsModalOpen}
              setSelectedIncome={setSelectedIncome}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
