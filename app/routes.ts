import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("*", "routes/404.tsx"),
  index("routes/HomePage.tsx"),
  route("projects", "routes/ProjectsPage.tsx"),
  route("about", "routes/AboutPage.tsx"),
  route("blog", "routes/blog/index.tsx", [
    route("posts/[slug]", "routes/blog/posts/[slug].tsx"),
  ]),
] satisfies RouteConfig;
