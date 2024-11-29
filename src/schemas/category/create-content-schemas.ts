import { z } from '@hono/zod-openapi';

export const RequestBodySchema = z.object({
  tmdbId: z.string().openapi({
    description: 'The TMDB ID of the content',
    example: '12345',
  }),
  type: z.enum(['movie', 'tv']).openapi({
    description: 'The type of the content (movie or tv)',
    example: 'movie',
  }),
  recommended: z.boolean().openapi({
    description: 'Whether the content is recommended or not',
    example: true,
  }),
});
