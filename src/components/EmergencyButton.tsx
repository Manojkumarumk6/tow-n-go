
import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

const EmergencyButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleEmergencyCall = () => {
    setIsActivating(true);
    
    // Simulate the emergency call processing
    setTimeout(() => {
      setIsActivating(false);
      
      // Show an alert (in a real app, this would be a proper modal/notification)
      alert('Emergency services contacted. Help is on the way.');
      
      setIsExpanded(false);
    }, 2000);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isExpanded ? (
        <div className="glass-card rounded-2xl p-5 shadow-lg animate-scale-in w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-base">Emergency Services</h3>
            <button 
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              onClick={toggleExpand}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tap below to contact emergency roadside assistance immediately.
            </p>
            
            <button
              className={`w-full py-3 rounded-xl font-medium text-white ${
                isActivating 
                  ? 'bg-amber-500 animate-pulse' 
                  : 'bg-red-500 hover:bg-red-600'
              } transition-colors flex items-center justify-center`}
              onClick={handleEmergencyCall}
              disabled={isActivating}
            >
              {isActivating ? (
                <>
                  <span className="mr-2">Contacting...</span>
                  <span className="h-4 w-4 rounded-full bg-white animate-pulse-subtle"></span>
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" /> Call for Help
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-muted-foreground">
              Works even in offline mode
            </p>
          </div>
        </div>
      ) : (
        <button
          className="w-14 h-14 rounded-full bg-red-500 shadow-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center animate-bounce-subtle"
          onClick={toggleExpand}
        >
          <Phone className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default EmergencyButton;
