/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Determine base URL based on environment
// Check if VERCEL_URL already includes http/https prefix

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
