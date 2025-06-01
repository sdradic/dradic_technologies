import ProjectContainer from "./ProjectContainer";
import SectionHeader from "./SectionHeader";
import { projects } from "module/projectsConfig";

export default function ProjectSection() {
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
