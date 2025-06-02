import Footer from "~/components/Footer";
import SectionHeader from "~/components/SectionHeader";
import { projects } from "module/projectsConfig";

// Define the Project type
interface Project {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

function ProjectContainer({ project }: { project: Project }) {
  return (
    <div className="border border-gray-200 rounded-2xl h-64 w-64 p-4 cursor-pointer bg-white hover:scale-105 transition-all duration-300">
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        <h3 className="text-3xl font-semibold mb-6 text-gray-800">
          {project.name}
        </h3>
        <p className="text-gray-700">{project.description}</p>
        <div className="flex justify-center items-center mt-8">
          {project.icon}
        </div>
      </a>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex flex-col w-full h-full justify-center items-center">
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
      </main>
      <Footer />
    </div>
  );
}
