import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SwapFormData, swapFormSchema } from "../schemas/swapFormSchema";
import { getAvailableTokens } from "../services/tokenService";
import { Token } from "../types/token";
import { AmountInput } from "./AmountInput";
import { ErrorMessage } from "./ErrorMessage";
import { SuccessMessage } from "./SuccessMessage";
import { TokenSelector } from "./TokenSelector";
import { Button } from "./ui/Button";
import { IconSwap } from "./icons";

export const SwapForm: FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapFormSchema),
    mode: "onChange",
    defaultValues: {
      fromToken: null,
      fromAmount: "",
      toToken: null,
      toAmount: "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        const fetchedTokens = await getAvailableTokens();
        setTokens(fetchedTokens);
        if (fetchedTokens.length > 1) {
          setValue("fromToken", fetchedTokens[0]);
          setValue("toToken", fetchedTokens[1]);
        }
      } catch (error) {
        console.error("Error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTokens();
  }, [setValue]);

  useEffect(() => {
    const { fromToken, toToken, fromAmount } = watchedValues;

    if (fromToken && toToken && fromAmount !== "") {
      const rate = calculateExchangeRate(fromToken, toToken);
      const fromAmountFloat = parseFloat(fromAmount.replace(/,/g, ''));
      const convertedAmount = fromAmountFloat * rate;
      if (!isNaN(convertedAmount) && convertedAmount > 0) {
        // Format with smart precision based on amount size
        const formattedAmount = formatAmount(convertedAmount);
        setValue("toAmount", formattedAmount);
      }
    } else if (fromAmount === "") {
      setValue("toAmount", "");
    }
  }, [
    watchedValues.fromToken,
    watchedValues.toToken,
    watchedValues.fromAmount,
    setValue,
  ]);

  const calculateExchangeRate = (from: Token, to: Token): number => {
    if (!from.price || !to.price) return 0;
    return from.price / to.price;
  };

  const formatAmount = (amount: number): string => {
    return amount.toFixed(4);
  };

  const handleSwapTokens = () => {
    const { fromToken, toToken, fromAmount, toAmount } = watchedValues;
    setValue("fromToken", toToken);
    setValue("toToken", fromToken);
    setValue("fromAmount", toAmount);
    setValue("toAmount", fromAmount);
  };

  const onSubmit = async (data: SwapFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(
        `Successfully swapped ${data.fromAmount} ${data.fromToken?.symbol} for ${data.toAmount} ${data.toToken?.symbol}`
      );

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Swap failed:", error);
      setSuccessMessage('Swap failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exchangeRate =
    watchedValues.fromToken && watchedValues.toToken
      ? calculateExchangeRate(watchedValues.fromToken, watchedValues.toToken)
      : 0;


  if (isLoading) {
    return (
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tokens...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-visible">

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 text-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Currency Swap</h1>
        <p className="text-blue-100 text-xs sm:text-sm">Exchange your tokens at real-time rates</p>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {successMessage && <SuccessMessage message={successMessage} />}

        {exchangeRate > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xs text-gray-600">Exchange rate</span>
              <button className="w-3 h-3 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center">
                ?
              </button>
            </div>
            <div className="text-sm font-semibold text-gray-800">
              1 {watchedValues.fromToken?.symbol} = {exchangeRate.toFixed(4)} {watchedValues.toToken?.symbol}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <label className="text-sm sm:text-base font-medium text-gray-700 block">
              Amount
            </label>
            
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1">
                <Controller
                  name="fromAmount"
                  control={control}
                  render={({ field }) => (
                    <AmountInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder="0.00"
                    />
                  )}
                />
                <ErrorMessage error={errors.fromAmount?.message} />

              </div>
              
              <div className="w-32 sm:w-36 md:w-40">
                <Controller
                  name="fromToken"
                  control={control}
                  render={({ field }) => (
                    <TokenSelector
                      tokens={tokens}
                      selectedToken={field.value}
                      onTokenSelect={(token) => {
                        field.onChange(token);
                      }}
                      placeholder="Select"
                    />
                  )}
                />
                <ErrorMessage error={errors.fromToken?.message} />
              </div>
            </div>
          </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapTokens}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-200"
              >
                <IconSwap/>
              </Button>
            </div>

          <div className="space-y-2 sm:space-y-3">
            <label className="text-sm sm:text-base font-medium text-gray-700 block">
              Converted to
            </label>
            
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1">
                <Controller
                  name="toAmount"
                  control={control}
                  render={({ field }) => (
                    <AmountInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder="0.00"
                      disabled
                    />
                  )}
                />
              </div>
              
              <div className="w-32 sm:w-36 md:w-40">
                <Controller
                  name="toToken"
                  control={control}
                  render={({ field }) => (
                    <TokenSelector
                      tokens={tokens}
                      selectedToken={field.value}
                      onTokenSelect={(token) => {
                        field.onChange(token);
                      }}
                      placeholder="Select"
                    />
                  )}
                />
                <ErrorMessage error={errors.toToken?.message} />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 sm:h-12 text-base sm:text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Swapping...</span>
              </div>
            ) : (
              "Swap Tokens"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};