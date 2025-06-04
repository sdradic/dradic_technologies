import { Route, Routes } from "react-router";
import { lazy } from "react";

const HomePage = lazy(() => import("./HomePage"));
const AboutPage = lazy(() => import("./AboutPage"));
const BlogPostPage = lazy(() => import("./blog.$slug"));
const BlogPage = lazy(() => import("./BlogPage"));
const ProjectsPage = lazy(() => import("./ProjectsPage"));
const NotFoundPage = lazy(() => import("./404"));

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
