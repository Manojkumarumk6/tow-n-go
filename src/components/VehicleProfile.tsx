
import React from 'react';
import { Car, Edit2 } from 'lucide-react';

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

interface VehicleProfileProps {
  vehicle: Vehicle;
  onEdit?: () => void;
}

const VehicleProfile: React.FC<VehicleProfileProps> = ({ vehicle, onEdit }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
        <Car className="h-10 w-10 text-white opacity-90" />
        
        <h3 className="text-white text-xl font-bold mt-2">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        
        <p className="text-white/80 text-sm mt-1">
          License: {vehicle.licensePlate}
        </p>
        
        <button 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          onClick={onEdit}
        >
          <Edit2 className="h-4 w-4 text-white" />
        </button>
        
        <div className="absolute -bottom-8 right-6 w-16 h-16 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
          <span className="uppercase font-bold text-sm text-gray-700">{vehicle.color.substring(0, 3)}</span>
        </div>
      </div>
      
      <div className="p-6 pt-12">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Vehicle Type" value={vehicle.vehicleType} />
          <InfoItem label="Fuel Type" value={vehicle.fuelType} />
          <InfoItem label="License Plate" value={vehicle.licensePlate} />
          <InfoItem label="Last Service" value="Not recorded" />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium text-sm">{value}</p>
  </div>
);

export default VehicleProfile;
