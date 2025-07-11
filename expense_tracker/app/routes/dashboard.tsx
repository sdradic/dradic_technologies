import PageHeader from "~/components/PageHeader";
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
        <HeaderControls />
        <div className="separator my-4" />
      </div>
    </div>
  );
}
