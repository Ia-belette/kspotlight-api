import { z } from '@hono/zod-openapi';

export const TmdbIdSchema = z.object({
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
