import { headers } from "next/headers";

import { auth as authHandler } from "@/lib/better-auth";

export { authHandler };

export const auth = async () => {
  return authHandler.api.getSession({
    headers: await headers(),
  });
};
