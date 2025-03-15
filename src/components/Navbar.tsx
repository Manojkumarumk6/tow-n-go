
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wifi, WifiOff, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/profile', label: 'Profile' },
    { path: '/challan', label: 'Challan' },
  ];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card px-6 py-4 mx-4 mt-4 rounded-2xl shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">TG</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">TowAssist</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === route.path 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Online status indicator */}
            <div className="flex items-center">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-amber-500 connection-indicator" />
              )}
              <span className="ml-2 text-xs font-medium hidden md:inline">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            
            {/* Auth buttons - desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                to="/login"
                className={cn(
                  "text-sm font-medium flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors",
                  location.pathname === "/login" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted"
                )}
              >
                <LogIn className="h-4 w-4 mr-1" />
                <span>Login</span>
              </Link>
              
              <Link 
                to="/signup"
                className={cn(
                  "text-sm font-medium flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg transition-colors",
                  location.pathname === "/signup" 
                    ? "bg-primary/90" 
                    : "hover:bg-primary/90"
                )}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                <span>Sign Up</span>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden glass-button p-2 rounded-full"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 animate-slide-up">
            <div className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors",
                    location.pathname === route.path 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {route.label}
                </Link>
              ))}
              
              {/* Auth links - mobile */}
              <div className="border-t pt-2 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-2 rounded-lg transition-colors hover:bg-muted"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-2 mt-1 rounded-lg bg-primary/10 text-primary transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
