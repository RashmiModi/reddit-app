import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router

export const runtime = "nodejs";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
config: {
    callbackUrl: "http://localhost:3000/api/uploadthing",
  },
  // Apply an (optional) custom config:
  // config: { ... },
});
