import { Outlet } from "react-router";

export default function BlogLayout() {
  return (
    <>
      <main className="px-4">
        <Outlet />
      </main>
    </>
  );
}
