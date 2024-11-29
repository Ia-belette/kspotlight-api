import { z } from '@hono/zod-openapi';

export const RecommendedContentResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'content789' }),
    title: z.string().openapi({ example: 'A Recommended Movie' }),
  })
  .array()
  .openapi('RecommendedContents');
