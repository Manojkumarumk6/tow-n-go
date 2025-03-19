
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import ServiceHeader from '@/components/services/ServiceHeader';
import ServicesList from '@/components/services/ServicesList';
import TowingServiceDialog from '@/components/services/TowingServiceDialog';
import RepairServiceDialog from '@/components/services/RepairServiceDialog';
import FuelServiceDialog from '@/components/services/FuelServiceDialog';
import ServiceHistoryDialog from '@/components/services/ServiceHistoryDialog';
import NearbyServicesDialog from '@/components/services/NearbyServicesDialog';

const Services = () => {
  const navigate = useNavigate();
  const isOnline = navigator.onLine;
  const { isAuthenticated, user } = useAuth();
  const [serviceHistoryOpen, setServiceHistoryOpen] = useState(false);
  const [nearbyServicesOpen, setNearbyServicesOpen] = useState(false);
  const [selectedServiceDialog, setSelectedServiceDialog] = useState<string | null>(null);
  
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
    { id: 'SRV-1001', date: '2023-10-15', type: 'Towing', status: 'Completed', cost: '₹7,000' },
    { id: 'SRV-982', date: '2023-09-22', type: 'Repair', status: 'Completed', cost: '₹10,500' },
    { id: 'SRV-879', date: '2023-08-05', type: 'Fuel Delivery', status: 'Completed', cost: '₹3,700' },
  ];

  const nearbyServices = [
    { id: 1, name: 'City Garage', distance: '0.8 miles', rating: '4.8', services: ['Repair', 'Towing'] },
    { id: 2, name: 'AutoFix Center', distance: '1.2 miles', rating: '4.5', services: ['Repair', 'Oil Change'] },
    { id: 3, name: 'Express Mechanics', distance: '2.5 miles', rating: '4.7', services: ['Repair', 'Towing', 'Battery'] },
    { id: 4, name: 'Highway Assistance', distance: '3.1 miles', rating: '4.3', services: ['Towing', 'Fuel'] },
  ];

  return (
    <div className="page-transition pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-5xl">
        <ServiceHeader isOnline={isOnline} />
        
        <ServicesList 
          isOnline={isOnline}
          isAuthenticated={isAuthenticated}
          handleServiceClick={handleServiceClick}
          onOpenTowingDialog={() => setSelectedServiceDialog('towing')}
          onOpenRepairDialog={() => setSelectedServiceDialog('repair')}
          onOpenFuelDialog={() => setSelectedServiceDialog('fuel')}
          onOpenServiceHistoryDialog={() => setServiceHistoryOpen(true)}
          onOpenNearbyServicesDialog={() => setNearbyServicesOpen(true)}
          onNavigateToChallan={() => navigate('/challan')}
        />
      </div>
      
      {/* Service Dialogs */}
      <TowingServiceDialog
        open={selectedServiceDialog === 'towing'}
        onOpenChange={(open) => !open && setSelectedServiceDialog(null)}
        userVehicles={userVehicles}
      />
      
      <RepairServiceDialog
        open={selectedServiceDialog === 'repair'}
        onOpenChange={(open) => !open && setSelectedServiceDialog(null)}
        userVehicles={userVehicles}
      />
      
      <FuelServiceDialog
        open={selectedServiceDialog === 'fuel'}
        onOpenChange={(open) => !open && setSelectedServiceDialog(null)}
        userVehicles={userVehicles}
      />
      
      <ServiceHistoryDialog
        open={serviceHistoryOpen}
        onOpenChange={setServiceHistoryOpen}
        serviceHistory={serviceHistory}
      />
      
      <NearbyServicesDialog
        open={nearbyServicesOpen}
        onOpenChange={setNearbyServicesOpen}
        nearbyServices={nearbyServices}
      />
      
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Services;
