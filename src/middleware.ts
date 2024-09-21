import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect,
  } from "@convex-dev/auth/nextjs/server";
  
  // Define public pages that do not require authentication (e.g., /Auth for login)
  const isPublicPage = createRouteMatcher(["/Auth"]);
  
  export default convexAuthNextjsMiddleware((request) => {
    const isAuthenticated = isAuthenticatedNextjs(); // Check if the user is authenticated
    const requestUrl = request.url;
  
    // Avoid unnecessary redirects:
    // 1. If the user is unauthenticated and accessing a non-public page, redirect to /Auth (login page)
    if (!isPublicPage(request) && !isAuthenticated) {
      if (requestUrl !== "/Auth") {
        return nextjsMiddlewareRedirect(request, "/Auth");
      }
    }
  
    // 2. If the user is authenticated and tries to access the login page (/Auth), redirect to the home page
    if (isPublicPage(request) && isAuthenticated) {
      if (requestUrl !== "/") {
        return nextjsMiddlewareRedirect(request, "/");
      }
    }
  
    // No redirect needed, proceed with the current request
  });
  
  export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  };
  