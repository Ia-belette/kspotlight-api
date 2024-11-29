import { Page } from '@xata.io/client';

import { CategoriesRecord, ContentRecord } from '@/xata';

export interface CategoryServiceProtocol {
  getCategories(
    pageSize?: number,
    after?: string
  ): Promise<Page<CategoriesRecord>>;

  getCategoryContents(
    categoryId: string,
    pageSize?: number,
    after?: string
  ): Promise<Page<ContentRecord>>;
}
