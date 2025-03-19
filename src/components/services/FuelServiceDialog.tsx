
import React from 'react';
import { Car, Droplet, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FuelServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userVehicles: any[];
}

const FuelServiceDialog: React.FC<FuelServiceDialogProps> = ({ 
  open, 
  onOpenChange,
  userVehicles
}) => {
  const navigate = useNavigate();

  const requestService = (serviceType: string, subType: string) => {
    if (userVehicles.length === 0) {
      toast.error("You need to add a vehicle first");
      navigate('/profile');
      return;
    }
    
    toast.success(`${serviceType} - ${subType} service requested!`);
    setTimeout(() => {
      toast.info(`Your request is being processed. Support will contact you shortly.`);
    }, 1500);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Fuel Delivery</DialogTitle>
          <DialogDescription>
            Select the type of fuel assistance you need
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {userVehicles.length > 0 ? (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Select Vehicle:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userVehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                      <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.licensePlate}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="petrol-diesel">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-red-500" />
                      <span>Petrol/Diesel Delivery</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">Emergency fuel delivery when you run out of gas.</p>
                    <div className="mb-3">
                      <label className="text-sm font-medium">Fuel Type:</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="text-sm font-medium">Amount (liters):</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option value="5">5 Liters</option>
                        <option value="10">10 Liters</option>
                        <option value="15">15 Liters</option>
                      </select>
                    </div>
                    <Button onClick={() => requestService('Fuel', 'Petrol/Diesel Delivery')}>Request Fuel Delivery</Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ev-charging">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>EV Charging Assistance</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">Mobile charging solution when your EV runs out of charge.</p>
                    <div className="mb-3">
                      <label className="text-sm font-medium">Charging Connector Type:</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option value="type1">Type 1 (J1772)</option>
                        <option value="type2">Type 2 (Mennekes)</option>
                        <option value="ccs">CCS</option>
                        <option value="chademo">CHAdeMO</option>
                        <option value="tesla">Tesla Connector</option>
                      </select>
                    </div>
                    <Button onClick={() => requestService('Fuel', 'EV Charging')}>Request EV Charging</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            <div className="text-center py-8">
              <Car className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">You need to add a vehicle first.</p>
              <Button className="mt-4" onClick={() => navigate('/profile')}>
                Add Vehicle
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FuelServiceDialog;
