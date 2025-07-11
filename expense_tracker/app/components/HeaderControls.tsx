import { useLocation } from "react-router";
import PageHeader from "./PageHeader";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";

interface PageHeader {
  title: string;
  subtitle: string;
}

export function HeaderControls() {
  const location = useLocation();
  const PageHeaderMapping = {
    about: {
      title: "About",
      subtitle: "About TallyUp",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Goals and savings",
    },
    expenses: {
      title: "Monthly Expenses",
      subtitle: "Manage your monthly expenses",
    },
    incomes: {
      title: "Incomes",
      subtitle: "Manage your incomes",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your settings",
    },
  };
  const [pageHeader, setPageHeader] = useState<PageHeader | null>(null);

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    if (path === "") {
      setPageHeader(PageHeaderMapping.dashboard);
      return;
    }
    const pageHeader =
      PageHeaderMapping[path as keyof typeof PageHeaderMapping];
    if (pageHeader) {
      setPageHeader(pageHeader);
    }
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between gap-2">
      <PageHeader
        title={pageHeader?.title ?? ""}
        subtitle={pageHeader?.subtitle ?? ""}
      />
      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        <button
          className={`btn-secondary w-32 ${
            pageHeader?.title === "Monthly Expenses" ? "block" : "hidden"
          }`}
        >
          Export data
        </button>
      </div>
    </div>
  );
}
