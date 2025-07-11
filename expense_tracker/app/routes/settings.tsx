import { HeaderControls } from "~/components/HeaderControls";

export default function Settings() {
  return (
    <div className="p-4 rounded-xl">
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
        <HeaderControls />
        <div className="separator my-4" />
      </div>
    </div>
  );
}
