import Navbar from "~/components/Navbar";
import SectionHeader from "./SectionHeader";
import Footer from "~/components/Footer";
import { useLocation } from "react-router";

interface LayoutProps {
  children: React.ReactNode;
}

const sectionHeaders: Record<string, string> = {
  "/about": "About Dradic Technologies",
  "/blog": "Blog Posts",
  "/projects": "Projects",
  "/contact": "Contact Us",
};

export default function Layout({ children }: LayoutProps) {
  const currentPath = useLocation().pathname;
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full pt-16 flex flex-col">
        {currentPath !== "/" && (
          <header className="w-full max-w-7xl mx-auto px-4 py-6">
            <SectionHeader title={sectionHeaders[currentPath]} />
          </header>
        )}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
