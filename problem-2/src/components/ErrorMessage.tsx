import { FC } from 'react';
import { cn } from '../lib/utils';

type ErrorMessageProps = {
  error?: string;
  className?: string;
};

export const ErrorMessage: FC<ErrorMessageProps> = ({ 
  error, 
  className 
}) => {
  if (!error) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 text-destructive text-sm mt-1",
      className
    )}>
      <span className="text-red-500">{error}</span>
    </div>
  );
};
