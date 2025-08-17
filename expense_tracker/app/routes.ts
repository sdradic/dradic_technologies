import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("*", "routes/404.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("", "routes/dashboard.tsx"),
  route("contact", "routes/contact.tsx"),
  route("groups", "routes/groups.tsx"),
  route("settings", "routes/settings.tsx"),
  route("expenses", "routes/expenses.tsx"),
  route("incomes", "routes/incomes.tsx"),
] satisfies RouteConfig;
