import { ChangeEvent, FC, useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { MAX_AMOUNT_LENGTH, REGEX_AMOUNT } from "@/constants";
import { cn } from "@/lib/utils";

type AmountInputProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const AmountInput: FC<AmountInputProps> = ({
  value,
  onChange,
  placeholder = "0.00",
  className,
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  const formatNumber = (num: string | undefined): string => {
    if (!num || num === "") return "";

    const cleanNum = num.replace(/,/g, "");

    const parsed = parseFloat(cleanNum);
    if (isNaN(parsed)) return "";

    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const parseNumber = (formatted: string): string => {
    if (!formatted || formatted === "") return "";
    return formatted.replace(/,/g, "");
  };

  useEffect(() => {
    if (value === "") {
      setDisplayValue("");
    } else {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setDisplayValue("");
      onChange("");
      return;
    }

    const regex = REGEX_AMOUNT;
    if (regex.test(inputValue)) {
      const rawValue = parseNumber(inputValue);

      if (inputValue.includes(".") && inputValue.endsWith(".")) {
        setDisplayValue(inputValue);
        onChange(rawValue);
        return;
      }

      const parsed = parseFloat(rawValue);
      if (!isNaN(parsed) && parsed >= 0) {
        const maxLength = MAX_AMOUNT_LENGTH;
        if (rawValue.length <= maxLength) {
          setDisplayValue(inputValue);
          onChange(rawValue);
        }
      } else if (rawValue === "" || rawValue === ".") {
        setDisplayValue(inputValue);
        onChange(rawValue);
      }
    }
  };

  const handleBlur = () => {
    if (displayValue && displayValue !== "") {
      const formatted = formatNumber(displayValue);
      setDisplayValue(formatted);
    }
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={18}
      minLength={1}
      disabled={disabled}
      data-testid="amount-input"
      className={cn(
        "h-10 text-lg font-medium text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    />
  );
};
