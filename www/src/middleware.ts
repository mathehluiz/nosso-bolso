export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/transactions", "/reports", "/dashboard", "/settings"],
  redirect: "/",
};
