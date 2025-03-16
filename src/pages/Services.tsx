import React, { useState } from 'react';
import ServiceCard from '@/components/ServiceCard';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import { Wrench, Truck, Car, Clock, MapPin, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ServicesMap from '@/components/ServicesMap';

const Services = () => {
  const navigate = useNavigate();
  const isOnline = navigator.onLine;
  const { isAuthenticated, user } = useAuth();
  const [serviceHistoryOpen, setServiceHistoryOpen] = useState(false);
  const [nearbyServicesOpen, setNearbyServicesOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  
  const handleServiceClick = (serviceFunction: () => void) => {
    if (isAuthenticated) {
      serviceFunction();
    } else {
      toast.info("Please login to access this service");
      navigate('/login', { state: { from: '/services' } });
    }
  };

  const serviceHistory = [
    { id: 'SRV-1001', date: '2023-10-15', type: 'Towing', status: 'Completed', cost: '$85.00' },
    { id: 'SRV-982', date: '2023-09-22', type: 'Repair', status: 'Completed', cost: '$125.50' },
    { id: 'SRV-879', date: '2023-08-05', type: 'Fuel Delivery', status: 'Completed', cost: '$45.00' },
  ];

  const nearbyServices = [
    { id: 1, name: 'City Garage', distance: '0.8 miles', rating: '4.8', services: ['Repair', 'Towing'] },
    { id: 2, name: 'AutoFix Center', distance: '1.2 miles', rating: '4.5', services: ['Repair', 'Oil Change'] },
    { id: 3, name: 'Express Mechanics', distance: '2.5 miles', rating: '4.7', services: ['Repair', 'Towing', 'Battery'] },
    { id: 4, name: 'Highway Assistance', distance: '3.1 miles', rating: '4.3', services: ['Towing', 'Fuel'] },
  ];
  
  const services = [
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Towing Service",
      description: "Request immediate towing assistance for your vehicle.",
      available: true,
      onClick: () => handleServiceClick(() => {
        toast.success("Towing service requested!");
        setTimeout(() => {
          toast.info("Help is on the way. ETA: 25 minutes");
        }, 1500);
      })
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "Roadside Repair",
      description: "Minor repairs to get you back on the road quickly.",
      available: true,
      onClick: () => handleServiceClick(() => {
        toast.success("Repair service requested!");
        setTimeout(() => {
          toast.info("A technician will arrive shortly. ETA: 35 minutes");
        }, 1500);
      })
    },
    {
      icon: <Car className="h-6 w-6 text-primary" />,
      title: "Fuel Delivery",
      description: "Get fuel delivered if you've run out.",
      available: isOnline,
      onClick: () => handleServiceClick(() => {
        toast.success("Fuel delivery requested!");
        setTimeout(() => {
          toast.info("Delivery is on the way. ETA: 20 minutes");
        }, 1500);
      })
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Service History",
      description: "View all your past service requests and details.",
      available: isOnline,
      onClick: () => handleServiceClick(() => {
        setServiceHistoryOpen(true);
      })
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Nearby Services",
      description: "Find mechanics and service centers near you.",
      available: isOnline,
      onClick: () => handleServiceClick(() => {
        setNearbyServicesOpen(true);
      })
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Traffic Challans",
      description: "View and pay your pending traffic violation tickets.",
      available: isOnline,
      onClick: () => handleServiceClick(() => navigate('/challan'))
    }
  ];
  
  return (
    <div className="page-transition pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-5xl">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              available={service.available}
              onClick={service.onClick}
            />
          ))}
        </div>
      </div>
      
      <Dialog open={serviceHistoryOpen} onOpenChange={setServiceHistoryOpen}>
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
                <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
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
              
              <TabsContent value="completed" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">All completed services will appear here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">All pending services will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={nearbyServicesOpen} onOpenChange={setNearbyServicesOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nearby Services</DialogTitle>
            <DialogDescription>
              Find mechanics and service centers near your location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue="map">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="map" className="flex-1">Map View</TabsTrigger>
                <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
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
      
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Services;
