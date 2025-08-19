import { HeaderControls } from "~/components/HeaderControls";
import EmptyState from "~/components/EmptyState";
import { PlusIconOutline } from "~/components/Icons";
import { useState } from "react";

import { groupsApi } from "~/modules/apis";
import { SimpleModal } from "~/components/SimpleModal";
import SimpleForm from "~/components/SimpleForm";

import SimpleTable from "~/components/SimpleTable";
import useGroups from "~/hooks/useGroups";
import Loader from "~/components/Loader";
import { useAuth } from "~/contexts/AuthContext";

// Separate component for groups content
function GroupsContent({
  reloadTrigger,
  setIsModalOpen,
}: {
  reloadTrigger: number;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const { data: groups, isLoading } = useGroups({ reloadTrigger });

  if (isLoading) {
    return <Loader message="Loading groups..." />;
  }

  return (
    <>
      {groups.length === 0 ? (
        <EmptyState
          title="You do not belong to any group"
          description="Create a new group to manage your team's expenses"
          button={{
            text: "Create Group",
            icon: (
              <PlusIconOutline className="size-6 stroke-white dark:stroke-white" />
            ),
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <SimpleTable
          title="Your Groups"
          description="Groups you belong to for managing shared expenses"
          columns={["Name", "Description", "Created"]}
          data={groups.map((group) => ({
            id: group.id,
            name: group.name,
            description: group.description || "No description",
            created: new Date(group.created_at).toLocaleDateString(),
          }))}
          hasButton={true}
          buttonProps={{
            buttonText: "Create Group",
            buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
            buttonClassName: "btn-primary",
            onClick: () => setIsModalOpen(true),
          }}
          tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-0 sm:min-h-[420px] overflow-x-auto"
          tableClassName="w-full p-6"
          onRowClick={() => {}}
        />
      )}
    </>
  );
}

export default function GroupSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { user } = useAuth();

  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleCreateGroup = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      await groupsApi.create({
        name: data.name,
        description: data.description || undefined,
      });
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      // Trigger reload to refresh the groups
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const fields = [
    {
      label: "Group Name",
      type: "text",
      id: "name",
      additionalProps: {
        value: formData.name,
        onChange: (value: string) =>
          setFormData((prev) => ({ ...prev, name: value })),
      },
    },
    {
      label: "Description (Optional)",
      type: "text",
      id: "description",
      additionalProps: {
        value: formData.description,
        onChange: (value: string) =>
          setFormData((prev) => ({ ...prev, description: value })),
      },
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="p-4 rounded-xl">
      <SimpleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-full max-w-md"
      >
        <SimpleForm
          title="Create New Group"
          description="Create a new group to manage shared expenses"
          fields={fields}
          action={handleCreateGroup}
          onCancel={handleCancel}
        />
      </SimpleModal>

      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <HeaderControls />
        <div className="separator my-4" />

        <GroupsContent
          reloadTrigger={reloadTrigger}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
}
