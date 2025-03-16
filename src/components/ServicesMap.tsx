
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ServiceLocation {
  id: number;
  name: string;
  location: [number, number]; // [longitude, latitude]
  services: string[];
  rating: string;
  address: string;
}

interface ServicesMapProps {
  onSelectLocation?: (location: ServiceLocation) => void;
}

const ServicesMap: React.FC<ServicesMapProps> = ({ onSelectLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Service locations data (mock data)
  const serviceLocations: ServiceLocation[] = [
    {
      id: 1,
      name: 'City Garage',
      location: [-74.006, 40.7128], // NYC
      services: ['Repair', 'Towing'],
      rating: '4.8',
      address: '123 Main St, New York, NY'
    },
    {
      id: 2,
      name: 'AutoFix Center',
      location: [-74.009, 40.7135],
      services: ['Repair', 'Oil Change'],
      rating: '4.5',
      address: '456 Broadway, New York, NY'
    },
    {
      id: 3,
      name: 'Express Mechanics',
      location: [-74.0021, 40.7145],
      services: ['Repair', 'Towing', 'Battery'],
      rating: '4.7',
      address: '789 Avenue A, New York, NY'
    },
    {
      id: 4,
      name: 'Highway Assistance',
      location: [-74.005, 40.7115],
      services: ['Towing', 'Fuel'],
      rating: '4.3',
      address: '321 Park Ave, New York, NY'
    },
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapToken) return;
    
    // Initialize map
    mapboxgl.accessToken = mapToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation || [-74.006, 40.7128], // Default to NYC if no user location
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    
    map.current.addControl(geolocate);

    // When map loads, try to locate user and add service markers
    map.current.on('load', () => {
      geolocate.trigger();
      
      // Listen for the geolocate event
      geolocate.on('geolocate', (e: any) => {
        const userCoords: [number, number] = [e.coords.longitude, e.coords.latitude];
        setUserLocation(userCoords);
        
        // Add user location marker with different color
        if (map.current) {
          // Center map on user location
          map.current.flyTo({
            center: userCoords,
            zoom: 14,
            essential: true
          });
          
          // Add service markers
          addServiceMarkers();
        }
      });
      
      // Add service markers anyway in case geolocate fails
      addServiceMarkers();
    });
  };

  const addServiceMarkers = () => {
    if (!map.current) return;
    
    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers for each service location
    serviceLocations.forEach(location => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'service-marker';
      el.innerHTML = `<div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                      </div>`;
      
      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.location)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${location.name}</h3>
                <p class="text-sm">${location.address}</p>
                <p class="text-sm mt-1">Rating: ${location.rating}★</p>
                <div class="mt-2">
                  <button 
                    onclick="window.selectLocation(${location.id})" 
                    class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    View Details
                  </button>
                </div>
              </div>
            `)
        )
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });
    
    // Add window function to handle popup button clicks
    window.selectLocation = (id: number) => {
      const location = serviceLocations.find(loc => loc.id === id);
      if (location && onSelectLocation) {
        onSelectLocation(location);
      }
    };
  };

  const searchNearbyServices = () => {
    if (!searchInput.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    toast.info(`Searching for "${searchInput}" nearby services...`);
    
    // In a real app, this would call an API. Here we just simulate a search.
    setTimeout(() => {
      toast.success(`Found ${serviceLocations.length} services matching "${searchInput}"`);
      
      // Highlight markers that match the search
      if (map.current) {
        // Reset markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Filter services based on search
        const filteredLocations = serviceLocations.filter(
          loc => loc.name.toLowerCase().includes(searchInput.toLowerCase()) || 
                loc.services.some(s => s.toLowerCase().includes(searchInput.toLowerCase()))
        );
        
        // Add filtered markers
        filteredLocations.forEach(location => {
          const el = document.createElement('div');
          el.className = 'service-marker';
          el.innerHTML = `<div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                          </div>`;
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat(location.location)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-bold">${location.name}</h3>
                    <p class="text-sm">${location.address}</p>
                    <p class="text-sm mt-1">Rating: ${location.rating}★</p>
                    <div class="mt-2">
                      <button 
                        onclick="window.selectLocation(${location.id})" 
                        class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        View Details
                      </button>
                    </div>
                  </div>
                `)
            )
            .addTo(map.current);
          
          marker.togglePopup(); // Open the popup for the matching services
          markersRef.current.push(marker);
        });
        
        // If no results, show all markers
        if (filteredLocations.length === 0) {
          toast.info("No exact matches found. Showing all services.");
          addServiceMarkers();
        }
      }
    }, 1000);
  };

  // For demo purposes, simple input for Mapbox token
  useEffect(() => {
    // Check if we already have a token in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapToken(savedToken);
    }
  }, []);

  // Initialize map when we have the token
  useEffect(() => {
    if (mapToken) {
      initializeMap();
      
      // Save token to localStorage for convenience
      localStorage.setItem('mapbox_token', mapToken);
    }
  }, [mapToken]);

  return (
    <div className="flex flex-col h-full">
      {!mapToken ? (
        <div className="p-4 flex flex-col items-center justify-center bg-muted/30 rounded-lg min-h-[400px]">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Enter your Mapbox token to continue</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            You need a Mapbox token to display the map. You can get one for free at{" "}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              mapbox.com
            </a>
          </p>
          <div className="w-full max-w-md">
            <Input
              type="password"
              placeholder="Enter your Mapbox public token"
              value={mapToken}
              onChange={(e) => setMapToken(e.target.value)}
              className="mb-2"
            />
            <Button 
              onClick={() => initializeMap()}
              disabled={!mapToken}
              className="w-full"
            >
              Load Map
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 bg-background rounded-lg shadow-sm mb-4 flex items-center">
            <Input
              type="text"
              placeholder="Search for repair shops, towing services..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="mr-2"
            />
            <Button onClick={searchNearbyServices} type="button">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="flex-1 min-h-[400px] border rounded-lg overflow-hidden relative">
            {/* Map styles will be applied to this container */}
            <div ref={mapContainer} className="absolute inset-0" />
            <style jsx global>{`
              .mapboxgl-ctrl-attrib {
                font-size: 10px;
              }
              .service-marker {
                cursor: pointer;
                width: 32px;
                height: 32px;
              }
              .mapboxgl-popup {
                max-width: 200px;
              }
              .mapboxgl-popup-content {
                padding: 0;
                border-radius: 8px;
                overflow: hidden;
              }
            `}</style>
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesMap;
