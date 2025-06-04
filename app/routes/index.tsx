import { Route, Routes } from "react-router";
import { lazy } from "react";

const HomePage = lazy(() => import("./HomePage"));
const AboutPage = lazy(() => import("./AboutPage"));
const BlogPage = lazy(() => import("./blog/index"));
const BlogPost = lazy(() => import("./blog/post/[slug]"));
const ProjectsPage = lazy(() => import("./ProjectsPage"));
const NotFoundPage = lazy(() => import("./404"));

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/post/:slug" element={<BlogPost />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
