import { Logo } from "./navbar/Logo";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useAuth } from "~/contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className="flex flex-row items-center justify-between w-full px-4 max-w-6xl mx-auto">
        <Logo />
        <div className="flex justify-end items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
}
