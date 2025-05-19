import { useRef } from "react";
import AboutSection from "~/components/AboutSection";
import BlogSection from "~/components/BlogSection";
import HeroSection from "~/components/HeroSection";
import Navbar from "~/components/Navbar";
import ProjectSection from "~/components/ProjectSection";
import { projects } from "module/projectsConfig";
import Footer from "~/components/Footer";

export default function App() {
  const homeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  return (
    <div className="font-sans text-dark-800 snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* Navbar */}
      <Navbar
        homeRef={homeRef}
        projectsRef={projectsRef}
        blogRef={blogRef}
        aboutRef={aboutRef}
      />

      {/* Hero Section */}
      <div className="w-full gradient-background snap-start">
        <div className="max-w-[1000px] mx-auto">
          <section
            className="h-screen flex flex-col items-center justify-center text-center px-4"
            id="hero"
            ref={homeRef}
          >
            <HeroSection projectsRef={projectsRef} />
          </section>
        </div>
      </div>

      {/* Projects Section */}
      <div className="w-full inverted-gradient-background snap-start">
        <div className="max-w-[1000px] mx-auto">
          <section
            ref={projectsRef}
            className="h-screen flex flex-col items-center justify-center text-center px-4"
            id="projects"
          >
            <ProjectSection projects={projects} />
          </section>
        </div>
      </div>

      {/* Blog Section */}
      <div className="w-full gradient-background snap-start">
        <div className="max-w-[1000px] mx-auto">
          <section
            ref={blogRef}
            className="h-screen flex flex-col items-center justify-center text-center px-4"
            id="blog"
          >
            <BlogSection />
          </section>
        </div>
      </div>

      {/* About Section */}
      <div
        className="w-full inverted-gradient-background snap-start"
        ref={aboutRef}
      >
        <div className="max-w-[1000px] mx-auto">
          <section
            className="min-h-screen flex flex-col items-center justify-between text-center px-4 py-8"
            id="about"
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <AboutSection />
            </div>
            <Footer />
          </section>
        </div>
      </div>
    </div>
  );
}
