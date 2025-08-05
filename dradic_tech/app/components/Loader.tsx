export default function Loader({
  message,
  loaderSize = [8, 8],
  loaderColor = "border-primary-500 dark:border-primary-400",
  textSize = "text-2xl",
}: {
  message?: string;
  loaderSize?: Array<number>;
  loaderColor?: string;
  textSize?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-4 animate-fade-in">
      <div
        className={`animate-spin rounded-full h-${loaderSize[0]} w-${loaderSize[1]} border-b-2 ${loaderColor}`}
      ></div>
      {message && (
        <span className={`${textSize} text-gray-500 dark:text-gray-400`}>
          {message}
        </span>
      )}
    </div>
  );
}
