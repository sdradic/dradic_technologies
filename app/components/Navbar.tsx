import { useState } from "react";

type NavItem = {
  label: string;
  ref: React.RefObject<HTMLDivElement | null>;
};

type NavConfig = NavItem[];

interface NavbarProps {
  homeRef: React.RefObject<HTMLDivElement | null>;
  projectsRef: React.RefObject<HTMLDivElement | null>;
  blogRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export default function Navbar({
  homeRef,
  projectsRef,
  blogRef,
  aboutRef,
  currentSection,
  setCurrentSection,
}: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navConfig: NavConfig = [
    { label: "Home", ref: homeRef },
    { label: "Projects", ref: projectsRef },
    { label: "Blog", ref: blogRef },
    { label: "About", ref: aboutRef },
  ];

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement | null>,
    section: string
  ) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setCurrentSection(section);
    setIsSidebarOpen(false);
  };

  const NavButton = ({ item }: { item: NavItem }) => (
    <button
      className="text-gray-800 cursor-pointer hover:text-gray-700"
      onClick={() => scrollToSection(item.ref, item.label.toLowerCase())}
    >
      {item.label}
    </button>
  );

  const MobileNavButton = ({ item }: { item: NavItem }) => (
    <button
      className="text-gray-600 text-left text-lg hover:text-gray-800 cursor-pointer hover:bg-gray-100 rounded-md p-2"
      onClick={() => scrollToSection(item.ref, item.label.toLowerCase())}
    >
      {item.label}
    </button>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 w-full nav-background shadow z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">
            <span className="hidden sm:inline">Dradic Technologies</span>
            <span className="sm:hidden">DT</span>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navConfig.map((item) => (
              <NavButton key={item.label} item={item} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4 mt-16">
          {navConfig.map((item) => (
            <MobileNavButton key={item.label} item={item} />
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-lg z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
