
import React from 'react';
import { AlertTriangle, Car, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import VehicleProfile from '@/components/VehicleProfile';

interface TowingServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userVehicles: any[];
}

const TowingServiceDialog: React.FC<TowingServiceDialogProps> = ({ 
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
          <DialogTitle>Towing Service</DialogTitle>
          <DialogDescription>
            Select the type of towing service you need
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
                <AccordionItem value="emergency-towing">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span>Emergency Towing</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">For breakdowns or accidents that require immediate assistance.</p>
                    <Button onClick={() => requestService('Towing', 'Emergency')}>Request Emergency Towing</Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="scheduled-towing">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Scheduled Towing</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">Plan ahead for non-emergency vehicle transport.</p>
                    <Button onClick={() => requestService('Towing', 'Scheduled')}>Schedule Towing</Button>
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

export default TowingServiceDialog;
