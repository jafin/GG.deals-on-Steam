import { DEFAULT_COLORS } from './constants';

export function applyColors(c: readonly string[]): void {
  document.documentElement.style.setProperty('--priceColor', c[0] ?? DEFAULT_COLORS[0]);
  document.documentElement.style.setProperty('--hoverPriceColor', c[1] ?? DEFAULT_COLORS[1]);
  document.documentElement.style.setProperty('--priceBgColor', c[2] ?? DEFAULT_COLORS[2]);
}
