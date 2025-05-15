import { useRef } from "react";

export default function App() {
  const projectsRef = useRef(null);
  const blogRef = useRef(null);
  const aboutRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">My Portfolio</h1>
          <div className="space-x-4">
            <button onClick={() => scrollToSection(projectsRef)}>
              Projects
            </button>
            <button onClick={() => scrollToSection(blogRef)}>Blog</button>
            <button onClick={() => scrollToSection(aboutRef)}>About</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="h-screen flex items-center justify-center bg-gray-100"
        id="hero"
      >
        <h2 className="text-4xl font-semibold">Welcome to My World</h2>
      </section>

      {/* Projects Section */}
      <section
        ref={projectsRef}
        className="min-h-screen px-6 py-20 bg-white"
        id="projects"
      >
        <h2 className="text-3xl font-bold mb-6">Projects</h2>
        <ul className="space-y-4">
          <li>
            <span className="font-medium">Project Foo</span> –{" "}
            <a
              href="https://project-foo.example.com"
              className="text-blue-600 underline"
            >
              Visit
            </a>
          </li>
          <li>
            <span className="font-medium">Project Bar</span> –{" "}
            <a
              href="https://project-bar.example.com"
              className="text-blue-600 underline"
            >
              Visit
            </a>
          </li>
        </ul>
      </section>

      {/* Blog Section */}
      <section
        ref={blogRef}
        className="min-h-screen px-6 py-20 bg-gray-50"
        id="blog"
      >
        <h2 className="text-3xl font-bold mb-6">Blog</h2>
        <p>Read my posts about coding, projects, and tech adventures.</p>
        <a
          href="https://blog.yourdomain.com"
          className="text-blue-600 underline mt-4 inline-block"
        >
          Go to Blog
        </a>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="min-h-screen px-6 py-20 bg-white"
        id="about"
      >
        <h2 className="text-3xl font-bold mb-6">About Me</h2>
        <p>
          I'm a developer building modular systems with React, FastAPI, and
          Markdown-based content workflows. Check out my blog and projects to
          see what I'm up to.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 bg-gray-100">
        &copy; {new Date().getFullYear()} Your Name. All rights reserved.
      </footer>
    </div>
  );
}
