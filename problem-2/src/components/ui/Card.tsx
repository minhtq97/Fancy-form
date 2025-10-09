import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto bg-white rounded-2xl shadow-lg',
      className
    )}>
      {children}
    </div>
  );
};

type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

export const CardHeader: FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 text-center rounded-t-2xl',
      className
    )}>
      {children}
    </div>
  );
};

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export const CardContent: FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'p-4 sm:p-6 space-y-4 sm:space-y-6',
      className
    )}>
      {children}
    </div>
  );
};
