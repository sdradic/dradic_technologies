import { projects } from "module/projectsConfig";
import Footer from "~/components/Footer";
import ProjectContainer from "~/components/ProjectContainer";
import SectionHeader from "~/components/SectionHeader";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex flex-col w-full h-full justify-center items-center">
        <SectionHeader title="Projects" />
        <ul className="space-y-4 flex flex-wrap gap-4">
          {projects.map((project) => (
            <li key={project.name}>
              <ProjectContainer project={project} />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
