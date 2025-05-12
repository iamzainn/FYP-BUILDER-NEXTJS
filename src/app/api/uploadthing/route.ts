import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Determine base URL based on environment
// Check if VERCEL_URL already includes http/https prefix
const baseUrl = process.env.NODE_ENV === 'production' 
  ? process.env.VERCEL_URL
  : "http://localhost:3000";

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
