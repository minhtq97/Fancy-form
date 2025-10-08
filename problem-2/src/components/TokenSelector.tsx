import { useState, FC } from "react";
import { Token } from "../types/token";
import { cn } from "../lib/utils";
import { IconDirectionUpDown } from "./icons/IconDirectionUpDown";
import { Button, Input } from ".";

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

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex justify-between gap-2 px-3 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50"
      >
        <div className="flex items-center gap-2">
          {selectedToken ? (
            <>
              <img
                src={selectedToken.icon}
                alt={selectedToken.symbol}
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/20x20/6366f1/ffffff?text=${selectedToken.symbol.charAt(
                    0
                  )}`;
                }}
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedToken.symbol}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">{placeholder}</span>
          )}
        </div>
        <IconDirectionUpDown isOpen={isOpen} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px]">
          <div className="p-3 border-b border-gray-100">
            <Input
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="overflow-y-auto max-h-48">
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
                    src={token.icon}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/24x24/6366f1/ffffff?text=${token.symbol.charAt(
                        0
                      )}`;
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {token.symbol}
                    </div>
                    <div className="text-xs text-gray-500">{token.name}</div>
                  </div>
                  {token.price && (
                    <div className="text-xs text-gray-500">
                      ${token.price.toFixed(2)}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-sm text-gray-500">
                No tokens found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
