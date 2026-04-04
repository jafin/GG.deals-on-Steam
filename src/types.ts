export interface AppPrices {
  currentRetail: string | null;
  historicalRetail: string | null;
  currentKeyshops: string | null;
  historicalKeyshops: string | null;
  currency: string;
}

export interface AppData {
  url?: string;
  prices?: AppPrices;
}

export type AppMap = Record<string, AppData>;

export type PriceType = 'official' | 'keyshop';

export type Subpage = 'app' | 'wishlist' | 'bundle' | 'cart' | 'search' | 'recommended';

