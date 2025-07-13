import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("*", "routes/404.tsx"),
  index("routes/home.tsx"),
  ...prefix("posts", [
    index("routes/posts.tsx"),
    route("/:id", "routes/post.tsx"),
  ]),
] satisfies RouteConfig;
