
import React from 'react';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ServiceHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceHistory: Array<{
    id: string;
    date: string;
    type: string;
    status: string;
    cost: string;
  }>;
}

const ServiceHistoryDialog: React.FC<ServiceHistoryDialogProps> = ({ 
  open, 
  onOpenChange,
  serviceHistory
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Service History</DialogTitle>
          <DialogDescription>
            View all your past service requests and their details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Tabs defaultValue="all">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All Services</TabsTrigger>
              <TabsTrigger value="payments" className="flex-1">Payment History</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              {serviceHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceHistory.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.id}</TableCell>
                        <TableCell>{service.date}</TableCell>
                        <TableCell>{service.type}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {service.status}
                          </span>
                        </TableCell>
                        <TableCell>{service.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No service history available</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="mt-4">
              <div className="space-y-4">
                {serviceHistory.map((service) => (
                  <div key={service.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{service.type} Service</p>
                        <p className="text-sm text-muted-foreground">{service.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{service.cost}</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm flex gap-2">
                      <Button size="sm" variant="outline">View Invoice</Button>
                      <Button size="sm" variant="outline">Download Receipt</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <div className="space-y-4">
                {serviceHistory.map((service) => (
                  <div key={service.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{service.type} Service</p>
                      <p className="text-sm text-muted-foreground">{service.date}</p>
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceHistoryDialog;
