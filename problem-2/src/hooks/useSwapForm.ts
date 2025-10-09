import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SwapFormData, swapFormSchema } from '@/schemas/swapFormSchema';
import { Token } from '@/types/token';

type UseSwapFormProps = {
  tokens: Token[];
};

export const useSwapForm = ({ tokens }: UseSwapFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SwapFormData>({
    resolver: zodResolver(swapFormSchema),
    mode: 'onChange',
    defaultValues: {
      fromToken: tokens.length > 0 ? tokens[0] : null,
      fromAmount: '',
      toToken: tokens.length > 1 ? tokens[1] : null,
      toAmount: '',
    },
  });

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  const watchedValues = watch();

  const handleSwapTokens = () => {
    const { fromToken, toToken, fromAmount, toAmount } = watchedValues;
    setValue('fromToken', toToken);
    setValue('toToken', fromToken);
    setValue('fromAmount', toAmount);
    setValue('toAmount', fromAmount);
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
      setSuccessMessage('Swap failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    control,
    handleSubmit,
    watch,
    setValue,
    errors,
    isValid,
    watchedValues,
    isSubmitting,
    successMessage,
    handleSwapTokens,
    onSubmit,
  };
};
