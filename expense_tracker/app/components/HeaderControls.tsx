import { useLocation } from "react-router";
import PageHeader from "./PageHeader";
import { useEffect, useState } from "react";

interface PageHeaderData {
  title: string;
  subtitle: string;
}

const PageHeaderMapping = {
  contact: {
    title: "Contact",
    subtitle: "Contact Us",
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
  groups: {
    title: "Group Settings",
    subtitle: "Manage your group settings",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your settings",
  },
};

export function HeaderControls({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const [pageHeader, setPageHeader] = useState<PageHeaderData | null>(null);

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
      >
        {children}
      </PageHeader>
    </div>
  );
}
