import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "./app.css";
import Loader from "~/components/Loader";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";

export function HydrateFallback() {
  return (
    <RootLayout>
      <AuthProvider>
        <ThemeProvider>
          <div className="flex flex-col items-center justify-center">
            <Loader />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </RootLayout>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Dradic Blog CMS is a CMS for the Dradic Blog."
        />
        <meta
          name="keywords"
          content="Dradic Technologies, Dradic, Technologies, IoT, Electronics, Embedded Systems, Hardware, Software, Blog, CMS"
        />
        <meta name="title" content="Dradic Blog CMS" />
        <Meta />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <RootLayout>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <Outlet />
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </RootLayout>
  );
}
