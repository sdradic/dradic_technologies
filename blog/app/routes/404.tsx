import { NavLink } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full pt-16">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg">Page not found</p>
      <NavLink to="/" className="text-primary-500 hover:text-primary-600">
        Go back to home
      </NavLink>
    </div>
  );
}
