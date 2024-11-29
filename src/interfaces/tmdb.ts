import { FetchContentInfoResponse } from '@/types/tmdb';

export interface TdbmContentProtocol {
  fetchContentInfo(
    tmdbId: string,
    contentType: string,
    apiKey: string
  ): Promise<FetchContentInfoResponse>;
}
