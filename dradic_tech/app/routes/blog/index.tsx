import type { Route } from "./+types/index";
import { SimpleInput } from "~/components/SimpleInput";
import { PostsList } from "~/components/PostList";
import { useState, useCallback } from "react";
import { RefreshIcon } from "~/components/Icons";
import { localState } from "~/modules/utils";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies Blog" },
    { name: "description", content: "Welcome to Dradic Technologies Blog!" },
  ];
}

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    // Clear cache to force fresh data
    localState.clearBlogData();
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center pt-4 pb-8">
        <h1 className="text-4xl sm:text-6xl font-semibold">
          Weekly <span className="text-primary-500">embedded</span> +{" "}
          <span className="text-primary-500">programing</span> tech insights and
          tutorials
        </h1>
        <p className="text-lg sm:text-2xl text-gray-500 dark:text-gray-400 mt-4">
          Join us as we explore the latest trends in technology and share our
          insights with you.
        </p>
        {/* Subscribe Bar */}
        <SimpleInput
          placeholder="Enter your email"
          value=""
          onChange={() => {}}
          buttonText="Subscribe"
        />
      </div>
      {/* Recent Posts */}
      <div className="flex flex-col mt-6 justify-center text-left">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="font-semibold text-gray-600 dark:text-gray-400">
            Latest content
          </h2>
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400"
            title="Refresh posts"
          >
            <RefreshIcon className="w-4 h-4 stroke-gray-600 dark:stroke-gray-400" />
            Refresh
          </button>
        </div>
        <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
          <PostsList key={refreshKey} onRefresh={handleRefresh} />
        </ul>
      </div>
    </div>
  );
}
