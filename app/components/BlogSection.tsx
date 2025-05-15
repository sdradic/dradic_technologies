import SectionHeader from "./SectionHeader";

export default function BlogSection() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionHeader title="Blog" />
      <div className="flex flex-col items-center justify-center h-full">
        <p>Read my posts about coding, projects, and tech adventures.</p>
        <button
          className="btn-primary px-4 py-2 mt-8"
          onClick={() => window.open("https://blog.dradic.com", "_blank")}
        >
          Go to Blog
        </button>
      </div>
    </div>
  );
}
