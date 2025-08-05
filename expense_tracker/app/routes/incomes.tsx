import { HeaderControls } from "~/components/HeaderControls";
import { HeaderButton } from "~/components/HeaderButton";
import { ReloadIcon } from "~/components/Icons";
import { Suspense, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import Loader from "~/components/Loader";
import { CreateEditModal } from "~/components/CreateEditModal";
import { IncomesTableData } from "~/hooks/useIncomesTableData";

export default function Incomes() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleReload = () => setReloadTrigger((prev) => prev + 1);
  const handleSave = (data: any) => {
    console.log(data);
  };

  return (
    <div className="p-4 rounded-xl">
      <CreateEditModal
        mode="income"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={handleSave}
        userId={user?.id}
      />
      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <HeaderControls>
          <HeaderButton
            onButtonClick={handleReload}
            isLoading={false}
            disabled={false}
            loadingText="Reloading..."
            buttonText="Reload Data"
            className="btn-secondary flex items-center gap-2 min-w-32"
            buttonIcon={
              <ReloadIcon className="size-5 stroke-2 stroke-primary-400 dark:stroke-white" />
            }
          />
        </HeaderControls>
        <div className="separator my-4" />
        <div className="flex flex-col gap-4">
          <div className="p-4">
            <Suspense fallback={<Loader message="Loading incomes..." />}>
              <IncomesTableData
                setIsModalOpen={setIsModalOpen}
                reloadTrigger={reloadTrigger}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
