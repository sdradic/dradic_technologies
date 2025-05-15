import type { Project } from "module/models";
import ProjectContainer from "./ProjectContainer";
import SectionHeader from "./SectionHeader";

export default function ProjectSection({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center">
      <SectionHeader title="Projects" />
      <ul className="flex flex-row gap-8 flex-wrap justify-center mt-10">
        {projects.map((project) => (
          <li key={project.name}>
            <ProjectContainer project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
