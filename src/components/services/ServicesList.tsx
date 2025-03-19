
import React from 'react';
import ServiceCard from '@/components/ServiceCard';
import { Truck, Wrench, Droplet, Receipt, Building, CreditCard } from 'lucide-react';

interface ServicesListProps {
  isOnline: boolean;
  isAuthenticated: boolean;
  handleServiceClick: (serviceFunction: () => void) => void;
  onOpenTowingDialog: () => void;
  onOpenRepairDialog: () => void;
  onOpenFuelDialog: () => void;
  onOpenServiceHistoryDialog: () => void;
  onOpenNearbyServicesDialog: () => void;
  onNavigateToChallan: () => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ 
  isOnline,
  isAuthenticated,
  handleServiceClick,
  onOpenTowingDialog,
  onOpenRepairDialog,
  onOpenFuelDialog,
  onOpenServiceHistoryDialog,
  onOpenNearbyServicesDialog,
  onNavigateToChallan
}) => {
  const services = [
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Towing Service",
      description: "Request immediate or scheduled towing assistance for your vehicle.",
      available: true,
      onClick: () => handleServiceClick(onOpenTowingDialog)
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "Roadside Repair",
      description: "Repairs to get you back on the road, from tire changes to battery jumpstarts.",
      available: true,
      onClick: () => handleServiceClick(onOpenRepairDialog)
    },
    {
      icon: <Droplet className="h-6 w-6 text-primary" />,
      title: "Fuel Delivery",
      description: "Get fuel delivered if you've run out, including EV charging assistance.",
      available: isOnline,
      onClick: () => handleServiceClick(onOpenFuelDialog)
    },
    {
      icon: <Receipt className="h-6 w-6 text-primary" />,
      title: "Service History",
      description: "View all your past service requests and billing details.",
      available: isOnline,
      onClick: () => handleServiceClick(onOpenServiceHistoryDialog)
    },
    {
      icon: <Building className="h-6 w-6 text-primary" />,
      title: "Nearby Services",
      description: "Find mechanics, car rentals, and service centers near you.",
      available: isOnline,
      onClick: () => handleServiceClick(onOpenNearbyServicesDialog)
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Traffic Challans",
      description: "View and pay your pending traffic violation tickets.",
      available: isOnline,
      onClick: () => handleServiceClick(onNavigateToChallan)
    }
  ];
  
  return (
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
  );
};

export default ServicesList;
