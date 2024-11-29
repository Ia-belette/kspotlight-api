import { CategoriesRecord, ContentRecord, XataClient } from "../xata";
import { Page } from "@xata.io/client";
import { ContentServiceProtocol } from "../interfaces/content/content";

export class ContentServices implements ContentServiceProtocol {
  private xata: XataClient;

  /**
   * Constructs an instance of the ContentServices class.
   *
   * @param {string} apiKey - The API key used to authenticate with Xata.
   * @param {string} [branch="main"] - The branch name to use for the Xata client.
   */
  constructor(apiKey: string, private branch: string = "main") {
    this.xata = new XataClient({ apiKey, branch });
  }

  /**
   * Validates the given page size by ensuring it is within the allowed range.
   *
   * @param {number} pageSize - The page size to validate.
   * @returns {number} The page size if valid.
   * @throws Will throw an error if the page size is outside the allowed range.
   */
  private validatePageSize(pageSize: number): number {
    if (pageSize <= 0 || pageSize > 100) {
      throw new Error("Page size must be between 1 and 100");
    }
    return pageSize;
  }

  /**
   * Validates the given cursor by ensuring it is not too long.
   *
   * @param {string} [cursor] - The cursor to validate.
   * @returns {string | undefined} The cursor if valid, undefined otherwise.
   * @throws Will throw an error if the cursor is too long.
   */
  private validateCursor(cursor?: string): string | undefined {
    if (cursor && cursor.length > 100) {
      throw new Error("Invalid cursor: too long");
    }
    return cursor;
  }

  /**
   * Validates the given ID by ensuring it is not empty or null.
   *
   * @param {string} id - The ID to validate.
   * @param {string} fieldName - The name of the field being validated, used in error messages.
   * @returns {string} The trimmed ID if valid.
   * @throws Will throw an error if the ID is null, empty, or only whitespace.
   */
  private validateId(id: string, fieldName: string): string {
    if (!id || id.trim().length === 0) {
      throw new Error(`Invalid ${fieldName}: cannot be empty`);
    }
    return id.trim();
  }

  /**
   * Retrieves a page of all content records.
   *
   * @param {number} [pageSize=20] Page size
   * @param {string} [after] Cursor to start from
   * @returns {Promise<Page<ContentRecord>>} Page of content records
   */
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

  /**
   * Retrieves a content record by its TMDB ID.
   *
   * @param {string} tmdbId TMDB ID of the content
   * @returns {Promise<ContentRecord | null>} Content record or null if not found
   */
  async getContentById(tmdbId: string): Promise<ContentRecord | null> {
    tmdbId = this.validateId(tmdbId, "tmdbId");

    return await this.xata.db.content
      .filter("content_id", parseInt(tmdbId))
      .getFirst();
  }

  /**
   * Retrieves a page of recommended content records.
   *
   * @param {number} [pageSize=20] Page size
   * @param {string} [after] Cursor to start from
   * @returns {Promise<Page<ContentRecord>>} Page of content records
   */
  async getRecommendedContents(
    pageSize: number = 20,
    after?: string
  ): Promise<Page<ContentRecord>> {
    pageSize = this.validatePageSize(pageSize);
    after = this.validateCursor(after);

    return await this.xata.db.content
      .select(["*", "category.name"])
      .filter("recommended", true)
      .getPaginated({
        pagination: { size: pageSize, after },
      });
  }

  /**
   * Retrieves a page of category records.
   *
   * @param {number} [pageSize=20] Page size
   * @param {string} [after] Cursor to start from
   * @returns {Promise<Page<CategoriesRecord>>} Page of category records
   */
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

  /**
   * Retrieves a page of content records for the given category.
   *
   * @param {string} categoryId Category ID
   * @param {number} [pageSize=20] Page size
   * @param {string} [after] Cursor to start from
   * @returns {Promise<Page<ContentRecord>>} Page of content records
   */
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

  /**
   * Retrieves a page of similar content records for the given TMDB ID.
   *
   * @param {string} currentCategory TMDB ID of the content
   * @param {number} [pageSize=20] Page size
   * @param {string} [after] Cursor to start from
   * @returns {Promise<Page<ContentRecord>>} Page of content records
   */
  async getSimilarContents(
    currentCategory: number | null,
    tmdbId: string
  ): Promise<Page<ContentRecord>> {
    tmdbId = this.validateId(tmdbId, "tmdbId");

    return await this.xata.db.content
      .sort("xata.createdAt", "asc")
      .select(["*", "category.*"])
      .filter("category.category_id", currentCategory)
      .filter("content_id", parseInt(tmdbId))
      .getPaginated({
        pagination: { size: 8 },
      });
  }
}
