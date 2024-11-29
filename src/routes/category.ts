import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';

import { Bindings } from '@/index';
import { ContentServices } from '@/services/content';
import { CategoryParamsSchema } from '@/schemas/category/category-schemas';
import {
  ContentResponseSchema,
  QuerySchema,
} from '@/schemas/category/query-schemas';
import { CategoryResponseSchema } from '@/schemas/category/category-response';

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const categoriesRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Categories'],
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

const categoryContentRoute = createRoute({
  method: 'get',
  path: '/{categoryId}',
  tags: ['Categories'],
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
