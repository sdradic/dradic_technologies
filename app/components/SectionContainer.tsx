import type { ReactNode } from "react";

interface SectionContainerProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function SectionContainer({
  id,
  children,
  className = "",
}: SectionContainerProps) {
  return (
    <div className="w-full">
      <div className="max-w-[1000px] mx-auto">
        <section
          className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${className}`}
          id={id}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
