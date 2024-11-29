import { z } from '@hono/zod-openapi';

export const SearchQuerySchema = z.object({
  query: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: 'query',
        in: 'query',
        description: 'Search keyword for the content',
        required: true,
      },
      example: 'Comedy',
    }),
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
      example: '10',
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
