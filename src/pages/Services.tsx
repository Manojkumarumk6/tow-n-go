import React from 'react';
import ServiceCard from '@/components/ServiceCard';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import { Wrench, Truck, Car, Clock, MapPin, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Services = () => {
  const navigate = useNavigate();
  const isOnline = navigator.onLine;
  const { isAuthenticated } = useAuth();
  
  const handleServiceClick = (serviceFunction: () => void) => {
    if (isAuthenticated) {
      // If user is authenticated, execute the service function
      serviceFunction();
    } else {
      // If not authenticated, redirect to login page
      toast.info("Please login to access this service");
      navigate('/login', { state: { from: '/services' } });
    }
  };
  
  const services = [
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Towing Service",
      description: "Request immediate towing assistance for your vehicle.",
      available: true, // Always available, even offline
      onClick: () => handleServiceClick(() => alert("Towing service requested! Help is on the way."))
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "Roadside Repair",
      description: "Minor repairs to get you back on the road quickly.",
      available: true, // Always available, even offline
      onClick: () => handleServiceClick(() => alert("Repair service requested! A technician will arrive shortly."))
    },
    {
      icon: <Car className="h-6 w-6 text-primary" />,
      title: "Fuel Delivery",
      description: "Get fuel delivered if you've run out.",
      available: isOnline,
      onClick: () => handleServiceClick(() => alert("Fuel delivery requested! Delivery is on the way."))
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Service History",
      description: "View all your past service requests and details.",
      available: isOnline,
      onClick: () => handleServiceClick(() => {})
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Nearby Services",
      description: "Find mechanics and service centers near you.",
      available: isOnline,
      onClick: () => handleServiceClick(() => {})
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
      
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Services;
