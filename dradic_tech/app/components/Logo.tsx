import { DradicTechLogo } from "./Icons";
import { useNavigate } from "react-router";

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <DradicTechLogo className="h-18 stroke-4 stroke-primary-500 dark:stroke-primary-500 dark:fill-dark-500" />
      <div className="hidden md:flex items-center">
        <div className="h-0.5 w-8 bg-primary-500 rounded-full rotate-90" />
        <div className="flex flex-col">
          <span className="text-2xl font-semibold">Dradic</span>
          <span className="text-sm text-gray-500">Technologies</span>
        </div>
      </div>
    </div>
  );
};
