import { TdbmContentProtocol } from '@/interfaces/tmdb';
import {
  ContentDetails,
  Provider,
  ProvidersResponse,
  FetchContentInfoResponse,
} from '@/types/tmdb';

export class TmdbService implements TdbmContentProtocol {
  private baseUrl = 'https://api.themoviedb.org/3/';
  private apiKey = '';
  private async getContentDetails(
    tmdbId: string,
    contentType: string
  ): Promise<ContentDetails | null> {
    try {
      const url = `${this.baseUrl}${contentType}/${tmdbId}?api_key=${this.apiKey}&language=fr-FR`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error('Erreur de requête pour les détails du contenu');
      const contentDetails: ContentDetails = await response.json();
      return contentDetails;
    } catch (error) {
      console.error(
        'Erreur lors de la sélection des détails du contenu:',
        error
      );
      return null;
    }
  }

  private async getKnownStreamingProviders(
    tmdbId: string,
    contentType: string
  ): Promise<Provider[] | null> {
    try {
      const url = `${this.baseUrl}${contentType}/${tmdbId}/watch/providers?api_key=${this.apiKey}&language=fr-FR`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error('Erreur de requête pour les fournisseurs');
      const providersData: ProvidersResponse = await response.json();

      const franceProviders = providersData?.results?.FR || null;
      const knownProviders = [
        'Netflix',
        'Disney+',
        'Apple TV',
        'Canal+',
        'Amazon Prime Video',
        'Max',
      ];
      const streamingProviders =
        franceProviders?.flatrate?.filter((provider: any) =>
          knownProviders.includes(provider.provider_name)
        ) || [];
      return streamingProviders.length > 0 ? streamingProviders : null;
    } catch (error) {
      console.error('Erreur lors de la/coporation des fournisseurs:', error);
      return null;
    }
  }

  async fetchContentInfo(
    tmdbId: string,
    contentType: string
  ): Promise<FetchContentInfoResponse> {
    const contentDetails = await this.getContentDetails(tmdbId, contentType);
    const providers = await this.getKnownStreamingProviders(
      tmdbId,
      contentType
    );
    return {
      providers,
      contentDetails,
    };
  }
}
