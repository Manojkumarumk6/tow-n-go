
import React from 'react';
import { Battery, Car, Fuel, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface RepairServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userVehicles: any[];
}

const RepairServiceDialog: React.FC<RepairServiceDialogProps> = ({ 
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
          <DialogTitle>Roadside Repair</DialogTitle>
          <DialogDescription>
            Select the type of repair service you need
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
                <AccordionItem value="tire-replacement">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-gray-500" />
                      <span>Flat Tire Replacement</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">On-the-spot tire change for flat or damaged tires.</p>
                    <Button onClick={() => requestService('Repair', 'Tire Replacement')}>Request Tire Change</Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="battery-jumpstart">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-blue-500" />
                      <span>Battery Jumpstart</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">Quick jumpstart for dead or weak batteries.</p>
                    <Button onClick={() => requestService('Repair', 'Battery Jumpstart')}>Request Jumpstart</Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="minor-repairs">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-orange-500" />
                      <span>Minor Mechanical Repairs</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">Quick fixes like belt replacements, hose repairs, etc.</p>
                    <Button onClick={() => requestService('Repair', 'Minor Mechanical')}>Request Minor Repair</Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="other-repairs">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-purple-500" />
                      <span>Other Repairs</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">Describe your specific issue for our technicians.</p>
                    <textarea className="w-full p-2 border rounded-md mb-3" placeholder="Describe your issue here..." rows={3}></textarea>
                    <Button onClick={() => requestService('Repair', 'Other Repairs')}>Request Service</Button>
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

export default RepairServiceDialog;
