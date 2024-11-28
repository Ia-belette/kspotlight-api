import { CategoriesRecord, ContentRecord, XataClient } from "../xata";
import { Page } from "@xata.io/client";
import { ContentServiceProtocol } from "../interfaces/content";

export class ContentServices implements ContentServiceProtocol {
  private xata: XataClient;

  constructor(apiKey: string, private branch: string = "main") {
    this.xata = new XataClient({ apiKey, branch });
  }

  private validatePageSize(pageSize: number): number {
    if (pageSize <= 0 || pageSize > 100) {
      throw new Error("Page size must be between 1 and 100");
    }
    return pageSize;
  }

  private validateCursor(cursor?: string): string | undefined {
    if (cursor && cursor.length > 100) {
      throw new Error("Invalid cursor: too long");
    }
    return cursor;
  }

  private validateId(id: string, fieldName: string): string {
    if (!id || id.trim().length === 0) {
      throw new Error(`Invalid ${fieldName}: cannot be empty`);
    }
    return id.trim();
  }

  async getAllContents(
    pageSize: number = 20,
    after?: string
  ): Promise<Page<ContentRecord>> {
    pageSize = this.validatePageSize(pageSize);
    after = this.validateCursor(after);

    return await this.xata.db.content
      .select(["*", "category.name"])
      .getPaginated({
        pagination: { size: pageSize, after },
      });
  }

  async getContentById(tmdbId: string): Promise<ContentRecord | null> {
    tmdbId = this.validateId(tmdbId, "tmdbId");

    return await this.xata.db.content.filter("content_id", tmdbId).getFirst();
  }

  async getCategories(
    pageSize: number = 20,
    after?: string
  ): Promise<Page<CategoriesRecord>> {
    pageSize = this.validatePageSize(pageSize);
    after = this.validateCursor(after);

    return await this.xata.db.categories.getPaginated({
      pagination: { size: pageSize, after },
    });
  }

  async getCategoryContents(
    categoryId: string,
    pageSize: number = 20,
    after?: string
  ): Promise<Page<ContentRecord>> {
    categoryId = this.validateId(categoryId, "categoryId");
    pageSize = this.validatePageSize(pageSize);
    after = this.validateCursor(after);

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      throw new Error(`Invalid categoryId: ${categoryId}`);
    }

    return await this.xata.db.content
      .select(["*", "category.category_id"])
      .filter("category.category_id", parsedCategoryId)
      .getPaginated({
        pagination: { size: pageSize, after },
      });
  }
}
