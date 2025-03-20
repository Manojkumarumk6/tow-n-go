
import React from 'react';
import VehicleProfile from '@/components/VehicleProfile';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import { UserIcon, Settings, Shield, Clock, Plus, Car } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import AddVehicleForm from '@/components/AddVehicleForm';
import EditVehicleForm from '@/components/EditVehicleForm';

// Define Vehicle type
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  vehicleType: string;
  fuelType: string;
}

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // State to track if user has any vehicles
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, navigate]);

  // Load saved vehicles from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedVehicles = localStorage.getItem(`vehicles-${user.email}`);
      if (savedVehicles) {
        try {
          setUserVehicles(JSON.parse(savedVehicles));
        } catch (error) {
          console.error('Error parsing saved vehicles:', error);
        }
      }
    }
  }, [user]);

  const handleAddVehicle = () => {
    setIsAddVehicleOpen(true);
  };
  
  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    if (!user) return;
    
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString(), // Simple ID generation
    };
    
    const updatedVehicles = [...userVehicles, newVehicle];
    setUserVehicles(updatedVehicles);
    
    // Save to localStorage
    localStorage.setItem(`vehicles-${user.email}`, JSON.stringify(updatedVehicles));
    
    setIsAddVehicleOpen(false);
    toast.success('Vehicle added successfully');
  };

  const handleEditVehicle = (vehicleId: string) => {
    const vehicle = userVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setIsEditVehicleOpen(true);
    }
  };
  
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    if (!user) return;
    
    const updatedVehicles = userVehicles.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    );
    
    setUserVehicles(updatedVehicles);
    
    // Save to localStorage
    localStorage.setItem(`vehicles-${user.email}`, JSON.stringify(updatedVehicles));
    
    setIsEditVehicleOpen(false);
    setSelectedVehicle(null);
    toast.success('Vehicle updated successfully');
  };
  
  if (!user) return null; // Don't render anything while redirecting or if no user
  
  return (
    <div className="page-transition pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <UserIcon className="h-10 w-10 text-primary" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.isPremium ? 'Premium Member' : 'Standard Member'}</p>
              
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" /> Verified
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" /> Member since 2022
                </span>
              </div>
            </div>
            
            <button className="shrink-0 glass-button p-2 rounded-full">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">My Vehicles</h2>
        
        {userVehicles.length === 0 ? (
          <Card className="bg-white/50 backdrop-blur-md border-0 shadow-md mb-6">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No Vehicles Added Yet</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                You haven't added any vehicles to your profile. Add your first vehicle to access towing and roadside assistance services.
              </p>
              <button 
                className="mt-6 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                onClick={handleAddVehicle}
              >
                <Plus className="h-4 w-4" /> Add Your First Vehicle
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {userVehicles.map((vehicle) => (
              <VehicleProfile 
                key={vehicle.id} 
                vehicle={vehicle} 
                onEdit={() => handleEditVehicle(vehicle.id)} 
              />
            ))}
            
            <div 
              className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors h-full min-h-[200px]"
              onClick={handleAddVehicle}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Add Vehicle</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Register additional vehicles to your profile
              </p>
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-semibold mb-4 mt-8">Recent Activity</h2>
        
        <div className="glass-card rounded-2xl overflow-hidden">
          {userVehicles.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No recent activity yet. Add a vehicle to get started.</p>
            </div>
          ) : (
            <div className="divide-y">
              {[
                { text: "Towing service requested", time: "Yesterday, 3:45 PM" },
                { text: "Added new vehicle", time: "Oct 15, 2023" },
                { text: "Paid traffic challan", time: "Oct 10, 2023" }
              ].map((activity, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <p className="font-medium text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
              
              <div className="p-4 flex justify-center">
                <button className="text-sm text-primary hover:underline">
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <AddVehicleForm
        open={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onSave={handleSaveVehicle}
      />
      
      <EditVehicleForm
        open={isEditVehicleOpen}
        onClose={() => setIsEditVehicleOpen(false)}
        onSave={handleUpdateVehicle}
        vehicle={selectedVehicle}
      />
      
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Profile;
