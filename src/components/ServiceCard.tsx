
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  available: boolean;
  className?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  available,
  className,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "service-card relative",
        !available && "opacity-70 grayscale",
        className
      )}
      onClick={available ? onClick : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
      
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{title}</h3>
            {available && (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          
          {!available && (
            <span className="mt-2 inline-block px-2 py-1 bg-muted text-xs rounded-md">
              Offline Mode - Limited Service
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
