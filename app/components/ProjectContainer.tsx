import type { Project } from "~/module/models";

export default function ProjectContainer({ project }: { project: Project }) {
  return (
    <div className="border border-gray-200 rounded-2xl h-64 w-64 p-4 cursor-pointer bg-white hover:scale-105 transition-all duration-300">
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        <h3 className="text-3xl font-bold mb-6">{project.name}</h3>
        <p className="text-gray-700 hover:text-gray-800">
          {project.description}
        </p>
        <div className="flex justify-center items-center mt-8">
          {project.icon}
        </div>
      </a>
    </div>
  );
}
