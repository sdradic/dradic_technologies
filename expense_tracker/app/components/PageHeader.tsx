interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="px-6 py-4 border-gray-200 dark:border-gray-800">
      <h1 className="text-start text-3xl dark:text-white">{title}</h1>
      <p className="text-gray-400 dark:text-gray-600 text-left">{subtitle}</p>
    </div>
  );
}
