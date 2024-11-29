import { z } from '@hono/zod-openapi';

const QuerySchema = z.object({
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

