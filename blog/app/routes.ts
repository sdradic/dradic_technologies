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
    route("/:id", "routes/post.tsx"),
  ]),
] satisfies RouteConfig;
