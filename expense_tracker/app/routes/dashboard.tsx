import { HeaderControls } from "~/components/HeaderControls";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TallyUp" },
    { name: "description", content: "TallyUp your expense tracking app" },
  ];
}

export default function Dashboard() {
  return (
    <div className="p-4 rounded-xl">
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
        <HeaderControls></HeaderControls>
        <div className="separator my-4" />
        {/* Dashboard content will go here */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Coming soon... Your Savings and Expenses Overview.
          </p>
        </div>
      </div>
    </div>
  );
}
