import { TallyUpLogo } from "~/components/Icons";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <TallyUpLogo
        className="w-24 h-24 stroke-primary-500 fill-primary-500 cursor-pointer"
        onClick={() => (window.location.href = "/")}
      />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl dark:text-white">404</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Page not found
        </p>
      </div>
    </div>
  );
}
