import { Page } from '@xata.io/client';
import { HTTPException } from 'hono/http-exception';

import { ContentServiceProtocol } from '@/interfaces/content';
import { validateCursor, validateId, validatePageSize } from '@/utils';
import { ContentRecord, XataClient } from '@/xata';

import { TmdbService } from './tmdb';

export class ContentServices implements ContentServiceProtocol {
  private xata: XataClient;

  constructor(
    apiKey: string,
    private branch: string = 'main'
  ) {
    this.xata = new XataClient({ apiKey, branch });
  }

  async searchContents(query: string, pageSize: number = 20, after?: string) {
    pageSize = validatePageSize(pageSize);
    after = validateCursor(after);

    return await this.xata.db.content
      .select(['*'])
      .filter({
        $any: {
          original_title: {
            $iContains: query,
          },
          title: {
            $iContains: query,
          },
        },
      })
      .getPaginated({
        pagination: { size: pageSize, after },
      });
  }

  async getAllContents(
    pageSize: number = 20,
    after?: string
  ): Promise<Page<ContentRecord>> {
    pageSize = validatePageSize(pageSize);
    after = validateCursor(after);

    return await this.xata.db.content
      .select(['*', 'category.name'])
      .getPaginated({
        pagination: { size: pageSize, after },
      });
  }

  async getContentById(tmdbId: string): Promise<ContentRecord | null> {
    tmdbId = validateId(tmdbId, 'tmdbId');

    return await this.xata.db.content
      .filter('content_id', parseInt(tmdbId))
      .getFirst();
  }

  async getRecommendedContents(
    pageSize: number = 20,
    after?: string
  ): Promise<Page<ContentRecord>> {
    pageSize = validatePageSize(pageSize);
    after = validateCursor(after);

    return await this.xata.db.content
      .select(['*', 'category.name'])
      .filter('recommended', true)
      .getPaginated({
        pagination: { size: pageSize, after },
      });
  }

  async getSimilarContents(
    currentCategory: number | null,
    tmdbId: string
  ): Promise<Page<ContentRecord>> {
    tmdbId = validateId(tmdbId, 'tmdbId');

    return await this.xata.db.content
      .sort('xata.createdAt', 'asc')
      .select(['*', 'category.*'])
      .filter('category.category_id', currentCategory)
      .filter('content_id', parseInt(tmdbId))
      .getPaginated({
        pagination: { size: 8 },
      });
  }

  async addContent(
    tmdbId: string,
    type: string,
    recommended: boolean,
    tmdbApiKey: string
  ) {
    try {
      const tmdbApi = new TmdbService(tmdbApiKey);

      const { providers, contentDetails } = await tmdbApi.fetchContentInfo(
        tmdbId,
        type
      );

      const {
        genres,
        release_date,
        backdrop_path,
        original_title,
        poster_path,
        title,
        tagline,
        overview,
        vote_average,
      } = contentDetails || {};

      const existingContent = await this.xata.db.content
        .filter({ content_id: parseInt(tmdbId) })
        .getFirst();

      if (existingContent) {
        throw new HTTPException(400, { message: 'Content already exists' });
      }

      let newContent;

      if (!existingContent) {
        let category = null;
        if (genres && genres.length > 0) {
          const mainGenre = genres[0];
          let existingCategory = await this.xata.db.categories
            .filter({ category_id: mainGenre.id })
            .getFirst();

          if (!existingCategory) {
            existingCategory = await this.xata.db.categories.create({
              category_id: mainGenre.id,
              name: mainGenre.name,
            });
          }

          category = existingCategory.id;
        }
        newContent = await this.xata.db.content.create({
          content_id: parseInt(tmdbId),
          title: title || original_title || 'Titre inconnu',
          original_title: original_title || 'Titre original inconnu',
          tagline: tagline || '',
          release_date: release_date ? new Date(release_date) : null,
          poster_url: poster_path
            ? `https://image.tmdb.org/t/p/original${poster_path}`
            : null,
          backdrop_url: backdrop_path
            ? `https://image.tmdb.org/t/p/original${backdrop_path}`
            : null,
          type: 'movie',
          category: category,
          overview: overview,
          vote_average: String(vote_average),
        });
      } else {
        newContent = existingContent;
      }

      return {
        message: 'Content added successfully',
        content: newContent,
      };
    } catch (error: any) {
      throw new HTTPException(500, {
        message: 'Failed to add content',
        cause: error.message,
      });
    }
  }
}
