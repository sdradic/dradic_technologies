import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("projects", "routes/projects/index.tsx"),
  route("blog", "routes/blog/index.tsx", [
    route("posts/[slug]", "routes/blog/posts/[slug].tsx"),
  ]),
  route("about", "routes/about/index.tsx"),
] satisfies RouteConfig;
