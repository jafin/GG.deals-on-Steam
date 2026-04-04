interface PriceHistoryPrices {
  currentRetail: string;
  historicalRetail: string;
  currentKeyshops: string | null;
  historicalKeyshops: string | null;
  currency: string;
}

interface PriceHistoryProps {
  url: string;
  prices: PriceHistoryPrices;
}

function formatDiff(current: string, historical: string): string | null {
  const diff = Number.parseFloat(current) - Number.parseFloat(historical);
  if (!Number.isFinite(diff) || diff <= 0) return null;
  return `+ ${diff.toFixed(2)}`;
}

function PriceTag({ tag: Tag, price, currency, diff }: Readonly<{ tag: 'span' | 'b'; price: string; currency: string; diff?: string | null }>) {
  return (
    <Tag class="ggdeals_price">
      {price} {currency}{diff && <span class="ggdeals_price_diff"> ({diff})</span>}
    </Tag>
  );
}

export function PriceHistory({ url, prices }: Readonly<PriceHistoryProps>) {
  return (
    <a href={url} class="ggdeals_price_history">
      <img src="https://raw.githubusercontent.com/Juzlus/GG.deals-on-Steam/refs/heads/server/icons/ggdeals_logo_white.png" alt="icon"/>
      <div>
        <p class="ggdeals_current">
          Current price is{' '}
          <PriceTag tag="b" price={prices.currentRetail} currency={prices.currency} diff={formatDiff(prices.currentRetail, prices.historicalRetail)} />
          {' '}at Official shops
          {prices.currentKeyshops && (
            <>
              {' '}and <PriceTag tag="b" price={prices.currentKeyshops} currency={prices.currency} diff={prices.historicalKeyshops ? formatDiff(prices.currentKeyshops, prices.historicalKeyshops) : null} />
              {' '}at Keyshops
            </>
          )}
        </p>
        <p class="ggdeals_lowest">
          Lowest price recorded is{' '}
          <PriceTag tag="span" price={prices.historicalRetail} currency={prices.currency} />
          {' '}at Official shops
          {prices.historicalKeyshops && (
            <>
              {' '}and <PriceTag tag="span" price={prices.historicalKeyshops} currency={prices.currency} />
              {' '}at Keyshops
            </>
          )}
        </p>
      </div>
    </a>
  );
}
