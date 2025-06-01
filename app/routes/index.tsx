import HeroSection from "~/components/HeroSection";
import ProjectSection from "~/components/ProjectSection";
import SectionContainer from "~/components/SectionContainer";

export default function App() {
  return (
    <div className="h-full w-full">
      <SectionContainer id="home" className="min-h-screen">
        <HeroSection />
      </SectionContainer>

      <SectionContainer id="projects" className="min-h-screen">
        <ProjectSection />
      </SectionContainer>
    </div>
  );
}
