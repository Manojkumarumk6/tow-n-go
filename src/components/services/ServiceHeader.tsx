
import React from 'react';

interface ServiceHeaderProps {
  isOnline: boolean;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ isOnline }) => {
  return (
    <>
      <div className="mb-8">
        <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
          24/7 Assistance
        </span>
        <h1 className="mt-3 text-3xl font-bold">Roadside Services</h1>
        <p className="mt-2 text-muted-foreground">
          Emergency assistance and additional services for your vehicle
        </p>
      </div>
      
      {!isOnline && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            You're currently offline. Only core emergency services are available.
          </p>
        </div>
      )}
    </>
  );
};

export default ServiceHeader;
