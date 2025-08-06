export default function EmptyState({
  title = "Such empty...",
  description = "You don't have any expenses yet.",
  button = {
    text: "Button",
    icon: null,
    onClick: () => {},
  },
}: {
  title?: string;
  description?: string;
  button?: {
    text: string;
    icon: React.ReactNode | null;
    onClick: () => void;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      {button && (
        <button className="btn-primary mt-4" onClick={button.onClick}>
          {button.icon}
          {button.text}
        </button>
      )}
    </div>
  );
}
