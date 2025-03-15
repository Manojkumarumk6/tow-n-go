
import React from 'react';
import VehicleProfile from '@/components/VehicleProfile';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import { User as UserIcon, Settings, Shield, Clock, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, navigate]);

  // Mock data - in a real app, this would come from state management or API
  const vehicleData = {
    make: "Honda",
    model: "Accord",
    year: 2021,
    licensePlate: "AB123XY",
    color: "Blue"
  };
  
  const handleEditVehicle = () => {
    alert("Vehicle edit functionality would open here");
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <VehicleProfile vehicle={vehicleData} onEdit={handleEditVehicle} />
          
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors h-full min-h-[200px]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Add Vehicle</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Register additional vehicles to your profile
            </p>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4 mt-8">Recent Activity</h2>
        
        <div className="glass-card rounded-2xl overflow-hidden">
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
          </div>
          
          <div className="p-4 flex justify-center">
            <button className="text-sm text-primary hover:underline">
              View All Activity
            </button>
          </div>
        </div>
      </div>
      
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Profile;
