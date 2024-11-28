import { Page } from "@xata.io/client";
import { CategoriesRecord, ContentRecord } from "../xata";

export interface ContentServiceProtocol {
  getAllContents(
    pageSize?: number,
    after?: string
  ): Promise<Page<ContentRecord>>;

  getContentById(tmdbId: string): Promise<ContentRecord | null>;

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
