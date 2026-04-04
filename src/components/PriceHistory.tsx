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

function PriceTag({ tag: Tag, price, currency }: { tag: 'a' | 'b'; price: string; currency: string }) {
  return <Tag class="ggdeals_price">{price} {currency}</Tag>;
}

export function PriceHistory({ url, prices }: PriceHistoryProps) {
  return (
    <a href={url} class="ggdeals_price_history">
      <img src="https://raw.githubusercontent.com/Juzlus/GG.deals-on-Steam/refs/heads/server/icons/ggdeals_logo_white.png" alt="icon"/>
      <div>
        <p class="ggdeals_current">
          Current price is{' '}
          <PriceTag tag="b" price={prices.currentRetail} currency={prices.currency} />
          {' '}at Official shops
          {prices.currentKeyshops && (
            <>
              {' '}and <PriceTag tag="b" price={prices.currentKeyshops} currency={prices.currency} />
              {' '}at Keyshops
            </>
          )}
        </p>
        <p class="ggdeals_lowest">
          The lowest price recorded is{' '}
          <PriceTag tag="a" price={prices.historicalRetail} currency={prices.currency} />
          {' '}at Official shops
          {prices.historicalKeyshops && (
            <>
              {' '}and <PriceTag tag="a" price={prices.historicalKeyshops} currency={prices.currency} />
              {' '}at Keyshops
            </>
          )}
        </p>
      </div>
    </a>
  );
}
