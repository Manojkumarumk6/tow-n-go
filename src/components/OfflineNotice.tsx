
import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Wifi, WifiOff } from 'lucide-react';

const OfflineNotice = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false);
      // Briefly show the online notice
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
      setIsVisible(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    setIsVisible(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Don't render if online and notice timed out or if dismissed
  if ((isOnline && !isVisible) || isDismissed) {
    return null;
  }
  
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-slide-up px-4">
      <div className={`glass-card p-4 rounded-xl shadow-lg border-l-4 ${
        isOnline ? 'border-l-green-500' : 'border-l-amber-500'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            {isOnline ? (
              <div className="rounded-full bg-green-100 p-1">
                <Wifi className="h-4 w-4 text-green-500" />
              </div>
            ) : (
              <div className="rounded-full bg-amber-100 p-1">
                <WifiOff className="h-4 w-4 text-amber-500" />
              </div>
            )}
            
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                {isOnline ? 'You\'re back online' : 'You\'re offline'}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {isOnline 
                  ? 'All services are now fully available.'
                  : 'Limited functionality available. Emergency services still work.'
                }
              </p>
            </div>
          </div>
          
          <button
            className="p-1 rounded-full hover:bg-muted transition-colors"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineNotice;
