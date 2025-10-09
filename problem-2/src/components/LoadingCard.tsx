import { FC } from 'react';
import { Card, CardContent } from './ui/Card';

type LoadingCardProps = {
  message?: string;
};

export const LoadingCard: FC<LoadingCardProps> = ({ 
  message = 'Loading tokens...' 
}) => {
  return (
    <Card data-testid="loading-card">
      <CardContent>
        <div className="text-center" data-testid="loading-content">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" data-testid="loading-spinner"></div>
          <p className="text-gray-600" data-testid="loading-message">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};
