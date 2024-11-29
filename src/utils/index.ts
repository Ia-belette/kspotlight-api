export const validatePageSize = (pageSize: number): number => {
  if (pageSize <= 0 || pageSize > 100) {
    throw new Error('Page size must be between 1 and 100');
  }
  return pageSize;
};

export const validateCursor = (cursor?: string): string | undefined => {
  if (cursor && cursor.length > 100) {
    throw new Error('Invalid cursor: too long');
  }
  return cursor;
};

export const validateId = (id: string, fieldName: string): string => {
  if (!id || id.trim().length === 0) {
    throw new Error(`Invalid ${fieldName}: cannot be empty`);
  }
  return id.trim();
};
