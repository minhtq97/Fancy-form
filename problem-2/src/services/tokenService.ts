import { Token, PriceData } from "../types/token";
import { apiMethod } from "./apiMethod";

const TOKEN_ICON_BASE_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

type ApiPriceItem = {
  currency: string;
  date: string;
  price: number;
};

export const fetchTokenPrices = async (): Promise<PriceData> => {
  try {
    const response = await apiMethod.get<ApiPriceItem[]>("/prices.json");

    const priceData: PriceData = {};

    response.data.forEach((item) => {
      if (
        !priceData[item.currency] ||
        new Date(item.date) > new Date(priceData[item.currency + "_date"] || 0)
      ) {
        priceData[item.currency] = item.price;
      }
    });

    const cleanPriceData: PriceData = {};
    Object.keys(priceData).forEach((key) => {
      if (!key.endsWith("_date")) {
        cleanPriceData[key] = priceData[key];
      }
    });

    return cleanPriceData;
  } catch (error) {
    try {
      const directResponse = await fetch(
        "https://interview.switcheo.com/prices.json",
        {
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (directResponse.ok) {
        const data: ApiPriceItem[] = await directResponse.json();

        const priceData: PriceData = {};

        data.forEach((item) => {
          if (
            !priceData[item.currency] ||
            new Date(item.date) >
              new Date(priceData[item.currency + "_date"] || 0)
          ) {
            priceData[item.currency] = item.price;
          }
        });

        const cleanPriceData: PriceData = {};
        Object.keys(priceData).forEach((key) => {
          if (!key.endsWith("_date")) {
            cleanPriceData[key] = priceData[key];
          }
        });

        return cleanPriceData;
      }
    } catch (directError) {
      console.error("Direct fetch also failed:", directError);
    }

    const fallbackPrices: PriceData = {
      BTC: 45000,
      ETH: 3000,
      USDT: 1,
      USDC: 1,
      BNB: 300,
      ADA: 0.5,
      SOL: 100,
      DOT: 7,
      AVAX: 25,
      MATIC: 0.8,
    };
    return fallbackPrices;
  }
};

export const createTokenFromSymbol = (symbol: string, price: number): Token => {
  return {
    symbol,
    name: symbol,
    price,
    icon: `${TOKEN_ICON_BASE_URL}/${symbol}.svg`,
  };
};

export const getAvailableTokens = async (): Promise<Token[]> => {
  const prices = await fetchTokenPrices();

  const tokens: Token[] = [];

  for (const [symbol, price] of Object.entries(prices)) {
    if (typeof price === "number" && price > 0) {
      tokens.push(createTokenFromSymbol(symbol, price));
    }
  }

  return tokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
};
