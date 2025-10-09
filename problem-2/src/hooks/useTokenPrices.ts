import { useEffect, useState } from 'react';
import { getAvailableTokens } from '@/services/tokenService';
import { Token } from '@/types/token';

type UseTokenPricesReturn = {
  tokens: Token[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
};

export const useTokenPrices = (intervalMs: number = 30000): UseTokenPricesReturn => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTokens = async (isManualRefresh = false) => {
    if (isManualRefresh && (isLoading || isRefreshing)) {
      return;
    }

    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const fetchedTokens = await getAvailableTokens();
      setTokens(fetchedTokens);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token prices';
      setError(errorMessage);
      console.error('Error fetching tokens:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTokens();

    const interval = setInterval(fetchTokens, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  const handleRefresh = () => fetchTokens(true);

  return {
    tokens,
    isLoading,
    error,
    lastUpdated,
    refresh: handleRefresh,
    isRefreshing,
  };
};
