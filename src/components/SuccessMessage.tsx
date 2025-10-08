import { FC } from "react";
import { cn } from "../lib/utils";

type SuccessMessageProps = {
  message: string;
  className?: string;
};

export const SuccessMessage: FC<SuccessMessageProps> = ({
  message,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-3 text-sm",
        className
      )}
    >
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};
