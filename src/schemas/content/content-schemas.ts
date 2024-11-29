import { z } from '@hono/zod-openapi';

export const ContentResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'content123' }),
    title: z.string().openapi({ example: 'A Great Movie' }),
    similarContents: z
      .array(
        z.object({
          id: z.string().openapi({ example: 'content456' }),
          title: z.string().openapi({ example: 'Another Great Movie' }),
        })
      )
      .optional()
      .openapi('SimilarContents'),
  })
  .openapi('ContentDetails');
