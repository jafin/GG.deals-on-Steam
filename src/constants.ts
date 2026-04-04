import type { PriceType, Subpage } from './types';

export const STORAGE_KEYS = {
  token: 'token',
  region: 'region',
  lastAppIds: 'lastAppIds',
  firstUpdate: 'firstUpdate',
  colors: 'colors',
  activeSubpages: 'activeSubpages',
  priceType: 'priceType',
  latestVersion: 'latestVersion',
  rateLimitLimit: 'x-ratelimit-limit',
  rateLimitRemaining: 'x-ratelimit-remaining',
  rateLimitReset: 'x-ratelimit-reset',
} as const;

export const DEFAULT_SUBPAGES: Subpage[] = ['app', 'wishlist', 'bundle', 'cart', 'search', 'recommended'];

export const DEFAULT_PRICE_TYPE: PriceType[] = ['official', 'keyshop'];

export const DEFAULT_COLORS = ['#BEEE11', '#a6cc1b', '#344654'];

export const DEFAULT_REGION = 'us';
