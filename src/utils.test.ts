import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLowestPrice, checkPrice, waitForElm } from './utils';
import type { AppData, PriceType } from './types';

const BOTH: PriceType[] = ['official', 'keyshop'];
const OFFICIAL_ONLY: PriceType[] = ['official'];
const KEYSHOP_ONLY: PriceType[] = ['keyshop'];

describe('getLowestPrice', () => {
  it('returns the lower of two prices', () => {
    expect(getLowestPrice('9.99', '7.50', 'USD', BOTH)).toBe('7.50 USD');
  });

  it('returns official when it is lower', () => {
    expect(getLowestPrice('5.00', '7.50', 'USD', BOTH)).toBe('5.00 USD');
  });

  it('returns official when keyshop is null', () => {
    expect(getLowestPrice('9.99', null, 'EUR', BOTH)).toBe('9.99 EUR');
  });

  it('returns keyshop when official is null', () => {
    expect(getLowestPrice(null, '7.50', 'EUR', BOTH)).toBe('7.50 EUR');
  });

  it('returns N/A when both are null', () => {
    expect(getLowestPrice(null, null, 'USD', BOTH)).toBe('N/A');
  });

  it('returns official only when priceType is official', () => {
    expect(getLowestPrice('9.99', '5.00', 'USD', OFFICIAL_ONLY)).toBe('9.99 USD');
  });

  it('returns keyshop only when priceType is keyshop', () => {
    expect(getLowestPrice('5.00', '9.99', 'USD', KEYSHOP_ONLY)).toBe('9.99 USD');
  });

  it('returns N/A for official-only when official is null', () => {
    expect(getLowestPrice(null, '5.00', 'USD', OFFICIAL_ONLY)).toBe('N/A');
  });

  it('returns N/A for keyshop-only when keyshop is null', () => {
    expect(getLowestPrice('5.00', null, 'USD', KEYSHOP_ONLY)).toBe('N/A');
  });

  it('picks official when prices are equal', () => {
    expect(getLowestPrice('10.00', '10.00', 'USD', BOTH)).toBe('10.00 USD');
  });
});

describe('checkPrice', () => {
  const makeApp = (overrides: Partial<AppData['prices']> = {}): AppData => ({
    url: 'https://gg.deals/game/123',
    prices: {
      currentRetail: '19.99',
      historicalRetail: '14.99',
      currentKeyshops: '12.00',
      historicalKeyshops: '10.00',
      currency: 'USD',
      ...overrides,
    },
  });

  it('returns formatted price for a normal game', () => {
    expect(checkPrice(makeApp(), BOTH)).toBe('12.00 USD');
  });

  it('returns null for undefined app', () => {
    expect(checkPrice(undefined, BOTH)).toBeNull();
  });

  it('returns null for app without prices', () => {
    expect(checkPrice({}, BOTH)).toBeNull();
  });

  it('returns null for free-to-play game', () => {
    const freeApp = makeApp({
      currentRetail: '0.00',
      historicalRetail: '0.00',
      currentKeyshops: null,
      historicalKeyshops: null,
    });
    expect(checkPrice(freeApp, BOTH)).toBeNull();
  });

  it('returns price when currentRetail is 0.00 but keyshops exist', () => {
    const app = makeApp({
      currentRetail: '0.00',
      historicalRetail: '0.00',
      currentKeyshops: '5.00',
      historicalKeyshops: null,
    });
    expect(checkPrice(app, BOTH)).toBe('0.00 USD');
  });

  it('returns null when getLowestPrice returns N/A', () => {
    const app = makeApp({
      currentRetail: '19.99',
      currentKeyshops: null,
    });
    expect(checkPrice(app, KEYSHOP_ONLY)).toBeNull();
  });
});

describe('waitForElm', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('resolves immediately when element already exists', async () => {
    document.body.innerHTML = '<div id="target"></div>';
    const el = await waitForElm('#target');
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el?.id).toBe('target');
  });

  it('resolves when element is added later', async () => {
    const promise = waitForElm('#later');

    // Add element after a microtask
    queueMicrotask(() => {
      const div = document.createElement('div');
      div.id = 'later';
      document.body.appendChild(div);
    });

    const el = await promise;
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el?.id).toBe('later');
  });

  it('resolves null on timeout', async () => {
    const el = await waitForElm('#nonexistent', 50);
    expect(el).toBeNull();
  });
});
