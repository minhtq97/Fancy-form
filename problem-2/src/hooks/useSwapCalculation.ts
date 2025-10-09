import { useEffect } from 'react';
import { Token } from '@/types/token';

type UseSwapCalculationProps = {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  setToAmount: (amount: string) => void;
};

export const useSwapCalculation = ({
  fromToken,
  toToken,
  fromAmount,
  setToAmount,
}: UseSwapCalculationProps) => {
  const calculateExchangeRate = (from: Token, to: Token): number => {
    if (!from.price || !to.price) return 0;
    return from.price / to.price;
  };

  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      return amount.toFixed(2);
    } else if (amount >= 1) {
      return amount.toFixed(4);
    } else if (amount >= 0.01) {
      return amount.toFixed(6);
    } else {
      return amount.toFixed(8);
    }
  };

  useEffect(() => {
    if (fromToken && toToken && fromAmount !== '') {
      const rate = calculateExchangeRate(fromToken, toToken);
      const fromAmountFloat = parseFloat(fromAmount.replace(/,/g, ''));
      const convertedAmount = fromAmountFloat * rate;
      
      if (!isNaN(convertedAmount) && convertedAmount > 0) {
        const formattedAmount = formatAmount(convertedAmount);
        setToAmount(formattedAmount);
      }
    } else if (fromAmount === '') {
      setToAmount('');
    }
  }, [fromToken, toToken, fromAmount, setToAmount]);

  return {
    calculateExchangeRate,
    formatAmount,
  };
};
