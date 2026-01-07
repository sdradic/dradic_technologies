"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/log-workout", label: "Log Workout", icon: "💪" },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className="hidden md:flex md:flex-col h-screen w-64 bg-primary-50 dark:bg-gray-900 dark:border-r-2 dark:border-gray-800 p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          💪 Gym Tracker
        </h2>
      </div>

      <div className="separator mb-8" />

      <div className="flex-1">
        <h3 className="text-gray-500 dark:text-gray-500 px-4 mb-2 text-sm uppercase tracking-wide">
          Navigation
        </h3>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
                  pathname === item.path
                    ? "bg-primary-100 dark:bg-gray-700 border border-primary-200 dark:border-gray-800 text-gray-600 dark:text-white"
                    : "hover:bg-primary-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="separator my-4" />

      <div className="flex items-center justify-center mb-4">
        <ThemeToggle />
      </div>

      <div className="separator mb-4" />

      {user && (
        <div className="space-y-2">
          <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
          >
            <span className="text-xl mr-2">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
