import { HeaderControls } from "~/components/HeaderControls";
import EmptyState from "~/components/EmptyState";
import { PlusIconOutline } from "~/components/Icons";

export default function GroupSettings() {
  return (
    <div className="p-4 rounded-xl">
      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <HeaderControls />
        <div className="separator my-4" />
        {/* Group settings */}

        <EmptyState
          title="You do not belong to any group"
          description="Create a new group to manage your team's expenses"
          button={{
            text: "Create Group",
            icon: (
              <PlusIconOutline className="size-6 stroke-white dark:stroke-white" />
            ),
            onClick: () => {},
          }}
        />
      </div>
    </div>
  );
}
