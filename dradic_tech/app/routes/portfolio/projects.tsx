import { useState } from "react";
import { SearchBar } from "~/components/SearchBar";

export default function Projects() {
  const data = [
    {
      name: "Compression algorithm analysis applied to DNA sequences",
      description:
        "This project is a compression algorithm analysis applied to DNA sequences.",
      link: "https://github.com/sdradic/Bioinformatics",
      tags: ["Bioinformatics", "Compression", "Algorithms"],
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = data.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 mt-4 text-center pt-4 pb-8">
      <h1 className="text-4xl md:text-6xl font-semibold">Projects</h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 mt-4">
        These are research projects I have worked on.
      </p>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search projects"
      />
      <div className="flex flex-col gap-4 mt-4">
        <p className="text-gray-500 dark:text-gray-400 text-left font-semibold">
          All Projects
        </p>
        <div className="separator" />
        <div className="flex flex-col gap-2 text-left">
          {filteredData.map((project) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              description={project.description}
              link={project.link}
              tags={project.tags}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const ProjectCard = ({
  name,
  description,
  link,
  tags,
}: {
  name: string;
  description: string;
  link: string;
  tags: string[];
}) => {
  return (
    <div
      className="flex flex-col gap-4 mt-4 border bg-gray-50 dark:bg-dark-400 border-gray-200 dark:border-gray-800 rounded-lg p-4 w-full max-w-2xl mx-auto cursor-pointer"
      onClick={() => {
        window.open(link, "_blank");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(link, "_blank");
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${name} project`}
    >
      <h2 className="text-2xl font-semibold">{name}</h2>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
      <div className="flex flex-row flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300"
          >
            <div className="size-2 rounded-full bg-primary-300 dark:bg-primary-700" />
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
