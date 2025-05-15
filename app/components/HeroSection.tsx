import SectionHeader from "./SectionHeader";

export default function HeroSection({
  projectsRef,
}: {
  projectsRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionHeader title="Welcome the future of technology" />
      <p className="text-lg max-w-xl text-gray-600 text-wrap">
        We harness cutting-edge technology to solve your challenges. At dradic
        tech, we transform complex problems into simple, elegant solutions that
        work for you.
      </p>
      <div className="mt-8">
        <button
          className="btn-primary px-4 py-2"
          onClick={() =>
            projectsRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Explore Projects
        </button>
      </div>
    </div>
  );
}
