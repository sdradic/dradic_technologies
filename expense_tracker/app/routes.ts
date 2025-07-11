import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("*", "routes/404.tsx", { index: true }),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("signup", "routes/signup.tsx"),
  route("", "routes/_layout.tsx", [
    route("", "routes/dashboard.tsx"),
    route("about", "routes/about.tsx"),
    route("settings", "routes/settings.tsx"),
    route("expenses", "routes/expenses.tsx"),
    route("incomes", "routes/incomes.tsx"),
  ]),
] satisfies RouteConfig;
