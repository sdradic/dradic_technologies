import { DradicTechLogo } from "./Icons";
import { SimpleInput } from "./SimpleInput";
import { ThemeToggle } from "./ThemeToggle";

export default function Footer() {
  return (
    <>
      <footer className="flex flex-col items-center justify-center w-full h-full pt-4 mt-16 dark:bg-dark-400 bg-gray-100 max-w-6xl mx-auto sm:rounded-xl">
        <div className="flex flex-col items-center justify-center ">
          <div className="flex flex-row items-center justify-center">
            <DradicTechLogo className="h-18 stroke-4 stroke-primary-500 dark:stroke-primary-500 dark:fill-dark-400" />
            <div className="h-0.5 w-8 bg-primary-500 rounded-full rotate-90" />
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Dradic</span>
              <span className="text-sm text-gray-500">Technologies</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full py-4 px-8">
            <span className="text-md text-gray-500 dark:text-gray-400">
              Subscribe to our newsletter
            </span>
            <SimpleInput />
            <div className="md:hidden flex separator mt-4"></div>
          </div>
          <div className="md:hidden flex flex-row items-center justify-center gap-2 w-full max-w-6xl mx-auto my-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Dradic Technologies.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
      <div className="hidden md:flex flex-row items-center justify-center gap-2 w-full max-w-6xl mx-auto mt-2 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Dradic Technologies.
        </p>
        <ThemeToggle />
      </div>
    </>
  );
}
