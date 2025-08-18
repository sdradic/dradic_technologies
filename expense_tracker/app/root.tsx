import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLocation,
  Navigate,
} from "react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";

import type { Route } from "./+types/root";
import "./app.css";
import { Suspense } from "react";
import Loader from "./components/Loader";
import { TallyUpLogo } from "./components/Icons";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function HydrateFallback() {
  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    </ThemeProvider>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="root">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/404"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Special handling for logout route - allow authenticated users to access it
  if (location.pathname === "/logout") {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  // For public routes, render without layout
  if (isPublicRoute) {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  // For authenticated routes, render with layout
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - only show on md and above */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {/* Mobile/Tablet Navbar - only show on screens smaller than md */}
        <div className="md:hidden">
          <Navbar />
        </div>
        <Suspense
          fallback={
            <div className="p-4 flex items-center justify-center">
              <Loader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RootLayout>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </RootLayout>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <RootLayout>
      <ThemeProvider>
        <main className="flex h-screen items-center justify-center flex-col gap-4">
          <TallyUpLogo
            className="w-24 h-24 stroke-primary-500 fill-primary-500 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl dark:text-white">{message}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {details}
            </p>
            {stack && (
              <pre className="w-full p-4 overflow-x-auto">
                <code>{stack}</code>
              </pre>
            )}
          </div>
        </main>
      </ThemeProvider>
    </RootLayout>
  );
}
