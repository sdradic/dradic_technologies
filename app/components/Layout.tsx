import Navbar from "~/components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
