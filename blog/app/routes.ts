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
    index("routes/blog/home.tsx"),
    route("/:slug", "routes/blog/post.tsx"),
  ]),
  ...prefix("admin", [
    route("/login", "routes/admin/login.tsx"),
    index("routes/admin/home.tsx"),
    route("/:slug", "routes/admin/post.tsx"),
    route("/new-post", "routes/admin/new-post.tsx"),
  ]),
] satisfies RouteConfig;
