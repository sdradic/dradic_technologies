export default function EmptyState({
  title = "",
  description = "",
  icon = null,
  button = {
    text: "Button",
    icon: null,
    onClick: () => {},
  },
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode | null;
  button?: {
    text: string;
    icon: React.ReactNode | null;
    onClick: () => void;
  };
}) {
  const defaultIcon = (
    <svg
      className="w-12 h-12 opacity-20 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] mb-4">
        {icon ?? defaultIcon}
      </div>
      {title && (
        <p className="text-sm font-extrabold uppercase tracking-widest text-gray-700 dark:text-gray-300">
          {title}
        </p>
      )}
      {description && (
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 text-center">
          {description}
        </p>
      )}
      {button && (
        <button
          type="button"
          className="btn-primary mt-6 flex items-center gap-2"
          onClick={button.onClick}
        >
          {button.icon}
          {button.text}
        </button>
      )}
    </div>
  );
}
