import { useEffect, useState } from "react";

import type { Group } from "~/modules/types";
import { groupsApi } from "~/modules/apis";
import { useAuth } from "~/contexts/AuthContext";

export default function DailyExpenses() {
  // Fetch all groups for user
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    try {
      groupsApi
        .getAll(useAuth().user?.groups[0].group_id)
        .then((groups) => {
          setGroups(groups);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      setIsLoading(false);
    }
  }, [useAuth().user]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-lg ">Group Expenses</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          Add Group
        </button>
      </div>
      <div className="flex flex-col gap-4 p-4 dark:bg-gray-800">
        {groups.map((group) => (
          <div key={group.id}>{group.name}</div>
        ))}
      </div>
    </div>
  );
}
