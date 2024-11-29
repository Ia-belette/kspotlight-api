import { z } from '@hono/zod-openapi';

export const CategoryResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'content123' }),
    title: z.string().openapi({ example: 'A Great Movie' }),
  })
  .array()
  .openapi('ContentList');
