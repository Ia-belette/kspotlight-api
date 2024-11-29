import { Page } from '@xata.io/client';

import { validateCursor, validateId, validatePageSize } from '@/utils';

import { ContentServiceProtocol } from '../interfaces/content/content';
import { ContentRecord, XataClient } from '../xata';

export class ContentServices implements ContentServiceProtocol {
  private xata: XataClient;

  constructor(
    apiKey: string,
    private branch: string = 'main'
  ) {
    this.xata = new XataClient({ apiKey, branch });
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
}
