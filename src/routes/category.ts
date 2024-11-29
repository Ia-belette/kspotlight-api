import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';

import { Bindings } from '..';
import { ContentServices } from '../services/content';

const app = new OpenAPIHono<{ Bindings: Bindings }>();

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

const CategoryResponseSchema = z
  .object({
    id: z.string().openapi({ example: '18' }),
    name: z.string().openapi({ example: 'Drama' }),
  })
  .array()
  .openapi('CategoryList');

const ContentResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'content123' }),
    title: z.string().openapi({ example: 'A Great Movie' }),
  })
  .array()
  .openapi('ContentList');

const categoriesRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: QuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CategoryResponseSchema,
        },
      },
      description: 'List of categories',
    },
    400: { description: 'Invalid query parameters' },
    500: { description: 'Internal server error' },
  },
});

app.openapi(categoriesRoute, async (c) => {
  try {
    const { pageSize, after } = c.req.valid('query');
    const parsedPageSize = pageSize
      ? Math.min(parseInt(pageSize, 10), 100)
      : 20;

    const contentServices = new ContentServices(c.env.XATA_API_KEY, 'main');
    const data = await contentServices.getCategories(parsedPageSize, after);

    return c.json(data);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: 'Failed to fetch categories',
      cause: error.message || 'Internal Server Error',
    });
  }
});

const CategoryParamsSchema = z.object({
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

const categoryContentRoute = createRoute({
  method: 'get',
  path: '/{categoryId}',
  request: {
    query: QuerySchema,
    params: z.object({
      categoryId: CategoryParamsSchema.shape.categoryId,
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ContentResponseSchema,
        },
      },
      description: 'List of category contents',
    },
    400: { description: 'Invalid parameters' },
    500: { description: 'Internal server error' },
  },
});

app.openapi(categoryContentRoute, async (c) => {
  try {
    const { pageSize, after } = c.req.valid('query');
    const { categoryId } = c.req.valid('param');

    const parsedPageSize = pageSize ? parseInt(pageSize, 10) : 20;
    const contentServices = new ContentServices(c.env.XATA_API_KEY, 'main');
    const data = await contentServices.getCategoryContents(
      String(categoryId),
      parsedPageSize,
      after
    );

    return c.json(data);
  } catch (error: any) {
    console.error('Error:', error.message || 'Unknown error');
    throw new HTTPException(500, {
      message: 'Failed to fetch category content',
      cause: error.message || 'Internal Server Error',
    });
  }
});

export default app;
