export default function Loader({
  message,
  size = [8, 8],
}: {
  message?: string;
  size?: Array<number>;
}) {
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-4">
      <div
        className={`animate-spin rounded-full h-${size[0]} w-${size[1]} border-b-2 border-primary-500 dark:border-primary-400`}
      ></div>
      {message && (
        <span className="text-gray-500 dark:text-gray-400 text-2xl">
          {message}
        </span>
      )}
    </div>
  );
}
