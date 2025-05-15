import SectionHeader from "./SectionHeader";

export default function HeroSection({
  projectsRef,
}: {
  projectsRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionHeader title="Welcome to My World" />
      <p className="text-lg max-w-xl text-gray-600 text-wrap">
        I'm a developer passionate about building modular ecosystems with clean
        architecture and smooth user experiences. Explore my projects, read my
        blog, or get to know me.
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
