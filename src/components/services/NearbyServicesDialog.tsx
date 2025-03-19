
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServicesMap from '@/components/ServicesMap';

interface NearbyServicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nearbyServices: Array<{
    id: number;
    name: string;
    distance: string;
    rating: string;
    services: string[];
  }>;
}

const NearbyServicesDialog: React.FC<NearbyServicesDialogProps> = ({ 
  open, 
  onOpenChange,
  nearbyServices
}) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nearby Services</DialogTitle>
          <DialogDescription>
            Find mechanics, car rentals, and service centers near your location.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Tabs defaultValue="map">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="map" className="flex-1">Map View</TabsTrigger>
              <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
              <TabsTrigger value="rentals" className="flex-1">Car Rentals</TabsTrigger>
              <TabsTrigger value="traffic" className="flex-1">Traffic & Weather</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="mt-2">
              <div className="h-[500px]">
                <ServicesMap 
                  onSelectLocation={(location) => {
                    setSelectedLocation(location);
                    toast.info(`Selected ${location.name}`);
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-2">
              <div className="space-y-4">
                {nearbyServices.map((service) => (
                  <div key={service.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.distance} away</p>
                      </div>
                      <div className="bg-primary/10 px-2 py-1 rounded-full text-sm text-primary">
                        {service.rating} ★
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {service.services.map((s, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-background border rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">Call</Button>
                      <Button size="sm" className="flex-1">Directions</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="rentals" className="mt-2">
              <div className="space-y-4">
                {[
                  { id: 1, name: 'FastRental', distance: '1.2 miles', price: '$45/day', cars: ['Compact', 'SUV', 'Sedan'] },
                  { id: 2, name: 'City Cars', distance: '2.5 miles', price: '$50/day', cars: ['Economy', 'Luxury', 'Van'] },
                  { id: 3, name: 'AutoShare', distance: '0.8 miles', price: '$40/day', cars: ['Compact', 'Electric'] }
                ].map((rental) => (
                  <div key={rental.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{rental.name}</h3>
                        <p className="text-sm text-muted-foreground">{rental.distance} away</p>
                      </div>
                      <div className="font-semibold">{rental.price}</div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {rental.cars.map((car, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-background border rounded-full">
                          {car}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">Call</Button>
                      <Button size="sm" className="flex-1">Book Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="traffic" className="mt-2">
              <div className="mb-4 p-4 border rounded-lg bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-700">Traffic Alert</h3>
                </div>
                <p className="mt-1 text-sm">Heavy traffic on Highway 101, estimated delay of 25 minutes.</p>
              </div>
              
              <div className="mb-4 p-4 border rounded-lg bg-amber-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-amber-700">Road Construction</h3>
                </div>
                <p className="mt-1 text-sm">Lane closure on Main Street between 5th and 8th Avenue.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-blue-700">Weather Alert</h3>
                </div>
                <p className="mt-1 text-sm">Heavy rain expected in your area this afternoon. Drive with caution.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          {selectedLocation && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{selectedLocation.name}</h3>
                <span className="bg-primary/10 px-2 py-1 rounded-full text-sm text-primary">
                  {selectedLocation.rating} ★
                </span>
              </div>
              <p className="text-sm mt-1">{selectedLocation.address}</p>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedLocation.services.map((s: string, idx: number) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-background border rounded-full">
                    {s}
                  </span>
                ))}
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline">
                  Call Service
                </Button>
                <Button size="sm">
                  Request Service
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NearbyServicesDialog;
