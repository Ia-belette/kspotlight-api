import { z } from '@hono/zod-openapi';

export const CategoryParamsSchema = z.object({
  categoryId: z
    .string()
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: 'invalid_type',
          expected: 'number',
          received: 'string',
          message: 'Invalid categoryId',
        });
        return z.NEVER;
      }
      return parsed;
    })
    .openapi({
      param: {
        name: 'categoryId',
        in: 'path',
        description: 'ID of the category',
        required: true,
      },
      example: '18',
    }),
});
