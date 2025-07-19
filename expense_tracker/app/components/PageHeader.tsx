interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full px-6 py-4">
      <div className="flex flex-col">
        <h1 className="text-center md:text-start text-3xl dark:text-white">
          {title}
        </h1>
        <p className="text-gray-400 dark:text-gray-600 text-left">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 ">
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
