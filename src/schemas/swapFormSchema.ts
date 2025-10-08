import { z } from 'zod';

export const swapFormSchema = z.object({
  fromToken: z.object({
    symbol: z.string(),
    name: z.string(),
    price: z.number(),
    icon: z.string(),
  }).nullable().refine((val) => val !== null, {
    message: "Please select a token to swap from"
  }),
  toToken: z.object({
    symbol: z.string(),
    name: z.string(),
    price: z.number(),
    icon: z.string(),
  }).nullable().refine((val) => val !== null, {
    message: "Please select a token to swap to"
  }),
  fromAmount: z.string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val.replace(/,/g, ''));
      return !isNaN(num) && num > 0 && val.length <= 15;
    }, {
      message: "Please enter a valid amount"
    }),
  toAmount: z.any()
    .optional(),
}).refine((data) => {
  if (data.fromToken && data.toToken) {
    return data.fromToken.symbol !== data.toToken.symbol;
  }
  return true;
}, {
  message: "Cannot swap the same token",
  path: ["toToken"]
});

export type SwapFormData = z.infer<typeof swapFormSchema>;
