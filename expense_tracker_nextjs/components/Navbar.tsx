"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/expenses", label: "Expenses", icon: "💸" },
    { path: "/incomes", label: "Incomes", icon: "💰" },
  ];

  return (
    <nav className="md:hidden sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          💰 Expense Tracker
        </h1>
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-around px-2 pb-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors flex-1 mx-1 ${
              pathname === item.path
                ? "bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
