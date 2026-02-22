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
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 w-full">
      <div className="flex flex-col">
        <h1 className="text-center md:text-start text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
          {title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest text-center md:text-left">
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
