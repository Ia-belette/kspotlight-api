import { z } from '@hono/zod-openapi';

export const QuerySchema = z.object({
  pageSize: z
    .string()
    .regex(/^\d+$/, { message: 'pageSize must be a valid number' })
    .optional()
    .openapi({
      param: {
        name: 'pageSize',
        in: 'query',
        description: 'Number of items per page (default: 20, max: 100)',
        required: false,
      },
      example: '20',
    }),
  after: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'after',
        in: 'query',
        description: 'Cursor for pagination',
        required: false,
      },
    }),
});

export const ContentResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'content123' }),
    title: z.string().openapi({ example: 'A Great Movie' }),
  })
  .array()
  .openapi('ContentList');
