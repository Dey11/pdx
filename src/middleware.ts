import { auth } from "@/lib/auth";

export default auth((req) => {
  const publicRoutes = ["/", "/pricing", "/public"];
  if (!req.auth && !publicRoutes.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
