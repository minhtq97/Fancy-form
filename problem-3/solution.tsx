import { useMemo, useCallback, FC, ReactNode } from 'react';

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

declare const useWalletBalances: () => WalletBalance[];
declare const usePrices: () => Record<string, number>;
declare const WalletRow: FC<{
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
  blockchain: Blockchain;
}>;

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

const WalletPage: FC<Props> = (props) => {
  const { children, className, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = useCallback((blockchain: Blockchain): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
  }, []);

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances, getPriority]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance): FormattedWalletBalance => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount;
      return {
        ...balance,
        formatted: balance.amount.toFixed(2),
        usdValue,
      };
    });
  }, [sortedBalances, prices]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => (
      <WalletRow
        key={`${balance.blockchain}-${balance.currency}`}
        className={className}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
        currency={balance.currency}
        blockchain={balance.blockchain}
      />
    ));
  }, [formattedBalances, className]);

  return (
    <div className={className} {...rest}>
      {rows}
      {children}
    </div>
  );
};

export default WalletPage;