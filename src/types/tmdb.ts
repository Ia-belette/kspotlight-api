export type ContentDetails = {
  genres: {
    id: number;
    name: string;
  };
  release_date?: string;
  first_air_date?: string;
  backdrop_path?: string;
  original_title?: string;
  poster_path?: string;
  title?: string;
  tagline?: string;
  overview?: string;
};

export type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
  link: string;
};

export type FetchContentInfoResponse = {
  providers: Provider[] | null;
  contentDetails: ContentDetails | null;
};

export type ProvidersResponse = {
  results?: {
    [key: string]: {
      flatrate: Provider[];
    };
  };
};
