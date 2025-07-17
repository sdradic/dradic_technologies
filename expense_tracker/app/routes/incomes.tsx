import { lazy, Suspense } from "react";
import { HeaderControls } from "~/components/HeaderControls";
import { HeaderButton } from "~/components/HeaderButton";
import { ReloadProvider, useReload } from "~/contexts/ReloadContext";
import { ReloadIcon } from "~/components/Icons";

const MonthlyIncomesPage = lazy(() =>
  import("../pages/MonthlyIncomesPage").then((module) => ({
    default: module.MonthlyIncomesPage,
  }))
);

function IncomesContent() {
  const { triggerReload, isReloading } = useReload();

  const handleReload = async () => {
    await triggerReload();
  };

  return (
    <div className="p-4 rounded-xl">
      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <HeaderControls>
          <HeaderButton
            onButtonClick={handleReload}
            isLoading={isReloading}
            loadingText="Reloading..."
            buttonText="Reload Data"
            className="btn-secondary flex items-center gap-2 min-w-32"
            buttonIcon={
              <ReloadIcon className="size-5 stroke-2 stroke-primary-400 dark:stroke-white" />
            }
          />
        </HeaderControls>
        <div className="separator my-4" />
        <div className="flex flex-col gap-4 p-4">
          <MonthlyIncomesPage />
        </div>
      </div>
    </div>
  );
}

export default function Incomes() {
  return (
    <ReloadProvider>
      <IncomesContent />
    </ReloadProvider>
  );
}
