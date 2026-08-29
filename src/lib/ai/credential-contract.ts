import { z } from "zod";

export const aiCredentialStatusSchema = z
  .object({
    configured: z.boolean(),
    dismissed: z.boolean(),
    credential: z
      .object({
        provider: z.string(),
        baseUrl: z.string().url(),
        modelId: z.string().min(1),
        keyHint: z.string().min(1),
        verifiedAt: z.string().datetime(),
      })
      .strict()
      .nullable(),
  })
  .strict();

export type AiCredentialStatus = z.infer<typeof aiCredentialStatusSchema>;
