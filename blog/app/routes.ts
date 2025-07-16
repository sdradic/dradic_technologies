import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("*", "routes/404.tsx"),
  index("routes/home.tsx"),
  route("/about", "routes/about.tsx"),
  ...prefix("blog", [
    index("routes/blog.tsx"),
    route("/:slug", "routes/post.tsx"),
  ]),
  ...prefix("admin", [
    route("/login", "routes/admin/login.tsx"),
    index("routes/admin/home.tsx"),
    route("/new-post", "routes/admin/new-post.tsx"),
    route("/:slug", "routes/admin/post.tsx"),
  ]),
] satisfies RouteConfig;
