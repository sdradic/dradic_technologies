import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("*", "routes/404.tsx"),
  index("routes/index.tsx"),
  route("/team", "routes/team.tsx"),
  ...prefix("blog", [
    index("routes/blog/index.tsx"),
    route("/:slug", "routes/blog/post.tsx"),
  ]),
  ...prefix("admin", [
    route("/login", "routes/admin/login.tsx"),
    index("routes/admin/index.tsx"),
    route("/:slug", "routes/admin/post.tsx"),
    route("/new-post", "routes/admin/new-post.tsx"),
  ]),
  ...prefix("portfolio", [
    index("routes/portfolio/apps.tsx"),
    route("/projects", "routes/portfolio/projects.tsx"),
  ]),
] satisfies RouteConfig;
