import { FC } from 'react';
import { Token } from '@/types/token';
import { IconRefresh } from '@/components/icons';

type ExchangeRateCardProps = {
  fromToken: Token | null;
  toToken: Token | null;
  exchangeRate: number;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export const ExchangeRateCard: FC<ExchangeRateCardProps> = ({
  fromToken,
  toToken,
  exchangeRate,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}) => {
  if (exchangeRate <= 0 || !fromToken || !toToken) {
    return null;
  }

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)}m ago`;
    } else {
      return `${Math.floor(diffSeconds / 3600)}h ago`;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-xs text-gray-600">Exchange rate</span>
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            ({formatLastUpdated(lastUpdated)})
          </span>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="ml-2 p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh prices"
            type='button'
          >
            <IconRefresh isSpinning={isRefreshing} />
          </button>
        )}
      </div>
      <div className="text-sm font-semibold text-gray-800">
        1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}
      </div>
    </div>
  );
};
