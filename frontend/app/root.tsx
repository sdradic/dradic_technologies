import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "./app.css";
import Loader from "./components/Loader";

export function HydrateFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen inverse-gradient-background">
      <Loader showText={true} />
    </div>
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
          content="Dradic Technologies is a company that specializes in IoT, Embedded Systems, and Hardware-Software Integration."
        />
        <meta
          name="keywords"
          content="Dradic Technologies, Dradic, Technologies, IoT, Electronics, Embedded Systems, Hardware, Software"
        />
        <meta name="title" content="Dradic Technologies" />
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
      <Outlet />
    </RootLayout>
  );
}
