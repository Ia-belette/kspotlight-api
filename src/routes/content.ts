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

const TmdbIdSchema = z.object({
  tmdbId: z.string().openapi({
    param: {
      name: 'tmdbId',
      in: 'path',
      description: 'The TMDB ID of the content',
      required: true,
    },
    example: '12345',
  }),
});

const ContentResponseSchema = z
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

const RecommendedContentResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'content789' }),
    title: z.string().openapi({ example: 'A Recommended Movie' }),
  })
  .array()
  .openapi('RecommendedContents');

const allContentsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Contents'],
  request: {
    query: QuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z
            .array(
              z.object({
                id: z.string().openapi({ example: 'content123' }),
                title: z.string().openapi({ example: 'A Great Movie' }),
              })
            )
            .openapi('AllContents'),
        },
      },
      description: 'List of all contents',
    },
    400: { description: 'Invalid query parameters' },
    500: { description: 'Internal server error' },
  },
});

app.openapi(allContentsRoute, async (c) => {
  try {
    const { pageSize, after } = c.req.valid('query');
    const parsedPageSize = pageSize ? parseInt(pageSize, 10) : 20;

    const contentServices = new ContentServices(c.env.XATA_API_KEY, 'main');
    const data = await contentServices.getAllContents(parsedPageSize, after);

    return c.json(data);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: 'Failed to fetch contents',
      cause: error.message,
    });
  }
});

const contentByIdRoute = createRoute({
  method: 'get',
  path: '/{tmdbId}',
  tags: ['Contents'],
  request: {
    params: TmdbIdSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ContentResponseSchema,
        },
      },
      description: 'Details of a specific content',
    },
    400: { description: 'Invalid TMDB ID' },
    404: { description: 'Content not found' },
    500: { description: 'Internal server error' },
  },
});

app.openapi(contentByIdRoute, async (c) => {
  try {
    const { tmdbId } = c.req.valid('param');

    const contentServices = new ContentServices(c.env.XATA_API_KEY, 'main');
    const data = await contentServices.getContentById(tmdbId);

    if (!data) {
      throw new HTTPException(404, { message: 'Content not found' });
    }

    const similarContents = await contentServices.getSimilarContents(
      data?.category?.category_id || null,
      tmdbId
    );

    const response = {
      ...data,
      similarContents,
    };

    return c.json(response);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: 'Failed to fetch content by ID',
      cause: error.message,
    });
  }
});

const recommendedContentsRoute = createRoute({
  method: 'get',
  path: '/recommended',
  tags: ['Contents'],
  request: {
    query: QuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RecommendedContentResponseSchema,
        },
      },
      description: 'List of recommended contents',
    },
    400: { description: 'Invalid query parameters' },
    500: { description: 'Internal server error' },
  },
});

app.openapi(recommendedContentsRoute, async (c) => {
  try {
    const { pageSize, after } = c.req.valid('query');
    const parsedPageSize = pageSize ? parseInt(pageSize, 10) : 20;

    const contentServices = new ContentServices(c.env.XATA_API_KEY, 'main');
    const data = await contentServices.getRecommendedContents(
      parsedPageSize,
      after
    );

    return c.json(data);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: 'Failed to fetch recommended contents',
      cause: error.message,
    });
  }
});

export default app;
