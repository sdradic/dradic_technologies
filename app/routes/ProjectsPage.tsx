import Footer from "~/components/Footer";
import SectionHeader from "~/components/SectionHeader";
import { projects } from "module/projectsConfig";
import Navbar from "~/components/Navbar";

// Define the Project type
interface Project {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

function ProjectContainer({ project }: { project: Project }) {
  return (
    <div className="flex flex-col items-center border border-gray-200 rounded-2xl h-64 w-64 p-4 cursor-pointer bg-white hover:scale-105 transition-all duration-300">
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        <h3 className="text-3xl text-center font-semibold mb-6 text-gray-800">
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
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col justify-center items-center py-12 max-w-6xl mx-auto">
        <SectionHeader title="Projects" />
        <ul className="flex flex-row gap-8 flex-wrap justify-center">
          {projects.map((project) => (
            <li key={project.name}>
              <ProjectContainer project={project} />
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
