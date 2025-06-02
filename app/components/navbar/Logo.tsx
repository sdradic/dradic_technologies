import { useNavigate } from "react-router";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="h-24 flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src="/dradic_tech_logo_w_title.png"
        alt="Dradic Technologies"
        className={`hidden sm:block h-16 w-auto object-contain ${className}`}
      />
      <img
        src="/dradic_tech_logo.png"
        alt="Dradic Technologies"
        className={`sm:hidden h-16 w-auto object-contain ${className}`}
      />
    </div>
  );
};
