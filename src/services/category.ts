import { Page } from '@xata.io/client';

import { CategoryServiceProtocol } from '@/interfaces/category';
import { validateCursor, validateId, validatePageSize } from '@/utils';
import { CategoriesRecord, ContentRecord, XataClient } from '@/xata';

export class CategoryServices implements CategoryServiceProtocol {
  private xata: XataClient;
  constructor(
    apiKey: string,
    private branch: string = 'main'
  ) {
    this.xata = new XataClient({ apiKey, branch });
  }

  async getCategories(
    pageSize: number = 20,
    after?: string
  ): Promise<Page<CategoriesRecord>> {
    pageSize = validatePageSize(pageSize);
    after = validateCursor(after);

    return await this.xata.db.categories.getPaginated({
      pagination: { size: pageSize, after },
    });
  }

  async getCategoryContents(
    categoryId: string,
    pageSize: number = 20,
    after?: string
  ): Promise<Page<ContentRecord>> {
    categoryId = validateId(categoryId, 'categoryId');
    pageSize = validatePageSize(pageSize);
    after = validateCursor(after);

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      throw new Error(`Invalid categoryId: ${categoryId}`);
    }

    return await this.xata.db.content
      .select(['*', 'category.category_id'])
      .filter('category.category_id', parsedCategoryId)
      .getPaginated({
        pagination: { size: pageSize, after },
      });
  }
}
