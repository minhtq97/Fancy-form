import { FC, useEffect, useState, useCallback } from "react";
import { useTokenPrices, useSwapCalculation, useSwapForm } from "@/hooks";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { ExchangeRateCard } from "@/components/ExchangeRateCard";
import { TokenInputGroup } from "@/components/TokenInputGroup";
import { LoadingCard } from "@/components/LoadingCard";
import { SuccessMessage } from "@/components/SuccessMessage";
import { Button } from "@/components/ui/Button";
import { IconSwap } from "@/components/icons";
import { API_INTERVAL } from "@/constants";

export const SwapForm: FC = () => {
  const { tokens, isRefreshing, lastUpdated, refresh } = useTokenPrices(API_INTERVAL);
  const [isLoadingSwapForm, setIsLoadingSwapForm] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    setValue,
    errors,
    isValid,
    watchedValues,
    isSubmitting,
    successMessage,
    handleSwapTokens,
    onSubmit,
  } = useSwapForm({ tokens });

  const setToAmountCallback = useCallback((amount: string) => {
    setValue('toAmount', amount);
  }, [setValue]);

  const { calculateExchangeRate } = useSwapCalculation({
    fromToken: watchedValues.fromToken,
    toToken: watchedValues.toToken,
    fromAmount: watchedValues.fromAmount,
    setToAmount: setToAmountCallback,
  });

  useEffect(() => {
    if (tokens.length > 0) {
      setValue('fromToken', tokens[0]);
      if (tokens.length > 1) {
        setValue('toToken', tokens[1]);
      }
      setIsLoadingSwapForm(false);
    }
    console.log(isLoadingSwapForm);
  }, [tokens, setValue]);

  const exchangeRate = watchedValues.fromToken && watchedValues.toToken
    ? calculateExchangeRate(watchedValues.fromToken, watchedValues.toToken)
    : 0;

  if (isLoadingSwapForm) {
    return <LoadingCard />;
  }

  return (
    <Card data-testid="swap-form-card">
      <CardHeader data-testid="swap-form-header">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2" data-testid="swap-form-title">Currency Swap</h1>
        <p className="text-blue-100 text-xs sm:text-sm" data-testid="swap-form-description">Exchange your tokens at real-time rates</p>
      </CardHeader>

      <CardContent data-testid="swap-form-content">
        {successMessage && <SuccessMessage message={successMessage} />}

        <ExchangeRateCard
          fromToken={watchedValues.fromToken}
          toToken={watchedValues.toToken}
          exchangeRate={exchangeRate}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          isRefreshing={isRefreshing}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" data-testid="swap-form">
          <TokenInputGroup
            control={control}
            errors={errors}
            tokens={tokens}
            label="Amount"
            amountFieldName="fromAmount"
            tokenFieldName="fromToken"
          />

          <div className="flex justify-center" data-testid="swap-tokens-container">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSwapTokens}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-200"
              data-testid="swap-tokens-button"
            >
              <IconSwap/>
            </Button>
          </div>

          <TokenInputGroup
            control={control}
            errors={errors}
            tokens={tokens}
            label="Converted to"
            amountFieldName="toAmount"
            tokenFieldName="toToken"
            amountDisabled={true}
          />

          <Button
            type="submit"
            className="w-full h-11 sm:h-12 text-base sm:text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            disabled={!isValid || isSubmitting}
            data-testid="submit-swap-button"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2" data-testid="submitting-state">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-testid="submitting-spinner"></div>
                <span data-testid="submitting-text">Swapping...</span>
              </div>
            ) : (
              <span data-testid="submit-text">Swap Tokens</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};