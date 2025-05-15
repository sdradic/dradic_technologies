import SectionHeader from "./SectionHeader";

export default function BlogSection() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionHeader title="Blog" />
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg max-w-xl text-gray-600 text-wrap">
          Read about the projects and solutions we have delivered, and explore
          our continuous research in emerging technologies.
        </p>
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
