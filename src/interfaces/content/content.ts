import { Page } from '@xata.io/client';

import { CategoriesRecord, ContentRecord } from '@/xata';

export interface ContentServiceProtocol {
  getAllContents(
    pageSize?: number,
    after?: string
  ): Promise<Page<ContentRecord>>;

  getContentById(tmdbId: string): Promise<ContentRecord | null>;

  getRecommendedContents(
    pageSize?: number,
    after?: string
  ): Promise<Page<ContentRecord>>;

  getSimilarContents(
    currentCategory: number | null,
    tmdbId: string
  ): Promise<Page<ContentRecord>>;
}
