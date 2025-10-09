import { FC } from 'react';
import { Card, CardContent } from './ui/Card';

type LoadingCardProps = {
  message?: string;
};

export const LoadingCard: FC<LoadingCardProps> = ({ 
  message = 'Loading tokens...' 
}) => {
  return (
    <Card>
      <CardContent>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};
