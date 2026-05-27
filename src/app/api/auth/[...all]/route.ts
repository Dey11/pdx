import { toNextJsHandler } from "better-auth/next-js";

import { authHandler } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(authHandler);
