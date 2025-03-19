
import React, { useState } from 'react';
import ServiceCard from '@/components/ServiceCard';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import { Wrench, Truck, Car, Clock, MapPin, CreditCard, Battery, Tire, Tool, AlertTriangle, Droplet, ZapFast, Receipt, Building, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ServicesMap from '@/components/ServicesMap';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import VehicleProfile from '@/components/VehicleProfile';

const Services = () => {
  const navigate = useNavigate();
  const isOnline = navigator.onLine;
  const { isAuthenticated, user } = useAuth();
  const [serviceHistoryOpen, setServiceHistoryOpen] = useState(false);
  const [nearbyServicesOpen, setNearbyServicesOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedServiceDialog, setSelectedServiceDialog] = useState<string | null>(null);
  
  // Get user vehicles from localStorage
  const getUserVehicles = () => {
    if (!user) return [];
    
    const savedVehicles = localStorage.getItem(`vehicles-${user.email}`);
    if (savedVehicles) {
      try {
        return JSON.parse(savedVehicles);
      } catch (error) {
        console.error('Error parsing saved vehicles:', error);
        return [];
      }
    }
    return [];
  };
  
  const userVehicles = getUserVehicles();
  
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
    
    setSelectedServiceDialog(null);
  };
  
  // Service dialogs
  const renderTowingDialog = () => (
    <Dialog open={selectedServiceDialog === 'towing'} onOpenChange={(open) => !open && setSelectedServiceDialog(null)}>
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
                
                <AccordionItem value="ev-towing">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <ZapFast className="h-4 w-4 text-green-500" />
                      <span>EV Towing</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">Specialized towing for electric vehicles with charging needs.</p>
                    <Button onClick={() => requestService('Towing', 'EV')}>Request EV Towing</Button>
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
  
  const renderRepairDialog = () => (
    <Dialog open={selectedServiceDialog === 'repair'} onOpenChange={(open) => !open && setSelectedServiceDialog(null)}>
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
                      <Tire className="h-4 w-4 text-gray-500" />
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
                      <Tool className="h-4 w-4 text-orange-500" />
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
  
  const renderFuelDialog = () => (
    <Dialog open={selectedServiceDialog === 'fuel'} onOpenChange={(open) => !open && setSelectedServiceDialog(null)}>
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
                      <ZapFast className="h-4 w-4 text-green-500" />
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
  
  const services = [
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Towing Service",
      description: "Request immediate or scheduled towing assistance for your vehicle.",
      available: true,
      onClick: () => handleServiceClick(() => {
        setSelectedServiceDialog('towing');
      })
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "Roadside Repair",
      description: "Repairs to get you back on the road, from tire changes to battery jumpstarts.",
      available: true,
      onClick: () => handleServiceClick(() => {
        setSelectedServiceDialog('repair');
      })
    },
    {
      icon: <Droplet className="h-6 w-6 text-primary" />,
      title: "Fuel Delivery",
      description: "Get fuel delivered if you've run out, including EV charging assistance.",
      available: isOnline,
      onClick: () => handleServiceClick(() => {
        setSelectedServiceDialog('fuel');
      })
    },
    {
      icon: <Receipt className="h-6 w-6 text-primary" />,
      title: "Service History",
      description: "View all your past service requests and billing details.",
      available: isOnline,
      onClick: () => handleServiceClick(() => {
        setServiceHistoryOpen(true);
      })
    },
    {
      icon: <Building className="h-6 w-6 text-primary" />,
      title: "Nearby Services",
      description: "Find mechanics, car rentals, and service centers near you.",
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
      
      {/* Service Dialogs */}
      {renderTowingDialog()}
      {renderRepairDialog()}
      {renderFuelDialog()}
      
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
      
      <Dialog open={nearbyServicesOpen} onOpenChange={setNearbyServicesOpen}>
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
      
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Services;
