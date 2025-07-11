import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("*", "routes/404.tsx"),
  route("/", "routes/index.tsx", [
    route("", "routes/home.tsx", { index: true }),
  ]),
  route("/login", "routes/login.tsx"),
] satisfies RouteConfig;
