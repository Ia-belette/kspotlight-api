import { Page } from '@xata.io/client';

import { ContentRecord } from '@/xata';

export interface ContentServiceProtocol {
  searchContents(
    query: string,
    pageSize?: number,
    after?: string
  ): Promise<Page<ContentRecord>>;

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

  addContent(
    tmdbId: string,
    type: string,
    recommended: boolean,
    tmdbApiKey: string
  ): Promise<{
    message: string;
    content: ContentRecord;
  }>;
}
