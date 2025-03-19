
import React, { useState } from 'react';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import { CreditCard, File, Check, X, ArrowRight, Search } from 'lucide-react';

const Challan = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  
  // Empty challans array - no default examples
  const challans: Array<{
    id: string;
    date: string;
    violation: string;
    location: string;
    amount: number;
    status: string;
  }> = [];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!licensePlate.trim()) {
      alert('Please enter a license plate number');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setSearchComplete(true);
    }, 1500);
  };
  
  const handlePayChallan = (id: string) => {
    alert(`Processing payment for challan ${id}... In a real app, this would open a payment gateway.`);
  };
  
  return (
    <div className="page-transition pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Traffic Management
          </span>
          <h1 className="mt-3 text-3xl font-bold">Traffic Challans</h1>
          <p className="mt-2 text-muted-foreground">
            Search and pay for your traffic violation tickets
          </p>
        </div>
        
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Search Challans</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="license-plate" className="block text-sm font-medium mb-1">
                Vehicle License Plate
              </label>
              <div className="relative">
                <input
                  id="license-plate"
                  type="text"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none pl-10"
                  placeholder="Enter license plate number"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  disabled={isSearching}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-medium ${
                isSearching 
                  ? 'bg-muted cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary/90'
              } transition-colors`}
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search Challans'}
            </button>
          </form>
        </div>
        
        {searchComplete && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Challan Results</h2>
            
            <div className="glass-card rounded-2xl overflow-hidden">
              {challans.length > 0 ? (
                <>
                  {challans.map((challan) => (
                    <div key={challan.id} className="border-b last:border-b-0 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <File className="h-4 w-4 text-primary mr-2" />
                            <h3 className="font-medium">{challan.id}</h3>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              challan.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {challan.status === 'paid' ? (
                                <span className="flex items-center">
                                  <Check className="h-3 w-3 mr-1" /> Paid
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <X className="h-3 w-3 mr-1" /> Unpaid
                                </span>
                              )}
                            </span>
                          </div>
                          
                          <p className="text-sm mt-1">{challan.violation}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {challan.location} • {new Date(challan.date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">₹{challan.amount.toLocaleString('en-IN')}</p>
                          
                          {challan.status === 'unpaid' && (
                            <button 
                              className="mt-2 px-3 py-1 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center ml-auto"
                              onClick={() => handlePayChallan(challan.id)}
                            >
                              <CreditCard className="h-3 w-3 mr-1" /> Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No challans found for {licensePlate}</p>
                </div>
              )}
              
              <div className="bg-muted/40 p-4 flex items-center justify-between text-sm">
                <span>Showing results for <strong>{licensePlate}</strong></span>
                <button className="text-primary hover:underline flex items-center">
                  View Complete History <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Challan;
