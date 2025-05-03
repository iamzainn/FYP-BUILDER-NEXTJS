import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Determine base URL based on environment
// Check if VERCEL_URL already includes http/https prefix
const baseUrl = process.env.NODE_ENV === 'production' 
  ? process.env.VERCEL_URL
  : "http://localhost:3000";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl: `${baseUrl}/api/uploadthing`,
    // Use uploadthing token if provided
    token: process.env.UPLOADTHING_TOKEN
  },
});
