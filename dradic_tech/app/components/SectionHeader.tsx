export default function SectionHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={`text-5xl font-bold mb-6 justify-start ${className} text-gray-800`}
    >
      {title}
    </h2>
  );
}
