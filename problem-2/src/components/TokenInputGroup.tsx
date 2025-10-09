import { FC } from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { SwapFormData } from '@/schemas/swapFormSchema';
import { Token } from '@/types/token';
import { AmountInput } from '@/components/AmountInput';
import { TokenSelector } from '@/components/TokenSelector';
import { ErrorMessage } from '@/components/ErrorMessage';

type TokenInputGroupProps = {
  control: Control<SwapFormData>;
  errors: FieldErrors<SwapFormData>;
  tokens: Token[];
  label: string;
  amountFieldName: 'fromAmount' | 'toAmount';
  tokenFieldName: 'fromToken' | 'toToken';
  amountDisabled?: boolean;
};

export const TokenInputGroup: FC<TokenInputGroupProps> = ({
  control,
  errors,
  tokens,
  label,
  amountFieldName,
  tokenFieldName,
  amountDisabled = false,
}) => {
  return (
    <div className="space-y-2 sm:space-y-3" data-testid={`token-input-group-${amountFieldName}`}>
      <label className="text-sm sm:text-base font-medium text-gray-700 block" data-testid={`token-input-label-${amountFieldName}`}>
        {label}
      </label>
      
      <div className="flex gap-2 sm:gap-3" data-testid={`token-input-container-${amountFieldName}`}>
        <div className="flex-1" data-testid={`amount-input-container-${amountFieldName}`}>
          <Controller
            name={amountFieldName}
            control={control}
            render={({ field }) => (
              <AmountInput
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                placeholder="0.00"
                disabled={amountDisabled}
              />
            )}
          />
          <ErrorMessage error={errors[amountFieldName]?.message as string} />
          <ErrorMessage error={errors[tokenFieldName]?.message as string} />

        </div>
        
        <div className="w-32 sm:w-36 md:w-40" data-testid={`token-selector-container-${tokenFieldName}`}>
          <Controller
            name={tokenFieldName}
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
        </div>
      </div>
    </div>
  );
};
