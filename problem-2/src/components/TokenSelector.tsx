import { useState, FC, useCallback } from "react";
import { Token } from "@/types/token";
import { cn } from "@/lib/utils";
import { IconDirectionUpDown } from "@/components/icons/IconDirectionUpDown";
import { Button, Input } from "@/components/ui";

type TokenSelectorProps = {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  placeholder?: string;
  className?: string;
};

export const TokenSelector: FC<TokenSelectorProps> = ({
  tokens,
  selectedToken,
  onTokenSelect,
  placeholder = "Select token",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenClick = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleImageError = useCallback((symbol: string, size: number = 24) => {
    if (!failedImages.has(symbol)) {
      setFailedImages(prev => new Set(prev).add(symbol));
    }
  }, [failedImages]);

  const getImageSrc = useCallback((token: Token, size: number = 24) => {
    if (failedImages.has(token.symbol)) {
      return `https://via.placeholder.com/${size}x${size}/6366f1/ffffff?text=${token.symbol.charAt(0)}`;
    }
    return token.icon;
  }, [failedImages]);

  return (
    <div className={cn("relative", className)} data-testid="token-selector">
      <Button
        variant="outline"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex justify-between gap-2 px-3 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50"
        data-testid="token-selector-button"
      >
        <div className="flex items-center gap-2" data-testid="selected-token-display">
          {selectedToken ? (
            <>
              <img
                src={getImageSrc(selectedToken, 20)}
                alt={selectedToken.symbol}
                className="w-5 h-5 rounded-full"
                onError={() => handleImageError(selectedToken.symbol, 20)}
                data-testid="selected-token-icon"
              />
              <span className="text-sm font-medium text-gray-700" data-testid="selected-token-symbol">
                {selectedToken.symbol}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500" data-testid="token-placeholder">{placeholder}</span>
          )}
        </div>
        <IconDirectionUpDown isOpen={isOpen} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px]" data-testid="token-dropdown">
          <div className="p-3 border-b border-gray-100" data-testid="token-search-container">
            <Input
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
              data-testid="token-search-input"
            />
          </div>
          <div className="overflow-y-auto max-h-48" data-testid="token-list">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleTokenClick(token)}
                  className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-b-0"
                  data-testid={`token-option-${token.symbol}`}
                  type="button"
                >
                  <img
                    src={getImageSrc(token, 24)}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-full"
                    onError={() => handleImageError(token.symbol, 24)}
                    data-testid={`token-icon-${token.symbol}`}
                  />
                  <div className="flex-1" data-testid={`token-info-${token.symbol}`}>
                    <div className="text-sm font-medium text-gray-900" data-testid={`token-symbol-${token.symbol}`}>
                      {token.symbol}
                    </div>
                    <div className="text-xs text-gray-500" data-testid={`token-name-${token.symbol}`}>{token.name}</div>
                  </div>
                  {token.price && (
                    <div className="text-xs text-gray-500" data-testid={`token-price-${token.symbol}`}>
                      ${token.price.toFixed(2)}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-sm text-gray-500" data-testid="no-tokens-found">
                No tokens found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
