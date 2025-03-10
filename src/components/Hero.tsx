
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-60" />
        <div 
          className="absolute left-1/2 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 -translate-x-1/2 -translate-y-1/4"
        />
        <div 
          className="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/10 translate-y-1/4"
        />
      </div>
      
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
          Your Roadside Companion
        </span>
        
        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          Roadside Assistance <span className="text-primary">Reimagined</span>
        </h1>
        
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Get instant help for towing, repairs, and traffic violations—even when offline. Your comprehensive roadside solution in one elegant app.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-medium"
            onClick={() => navigate('/services')}
          >
            Explore Services
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 glass-button rounded-xl font-medium inline-flex items-center"
            onClick={() => navigate('/profile')}
          >
            My Profile <ChevronRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>
      </motion.div>
      
      <div className="mt-16 w-full max-w-4xl">
        <p className="text-sm text-center text-muted-foreground mb-6 font-medium">
          Emergency Assistance Features
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Works Offline",
              description: "Access critical features even without internet connection.",
              gradient: "from-blue-400 to-blue-600"
            },
            {
              title: "Towing Services",
              description: "Request towing assistance with real-time tracking.",
              gradient: "from-indigo-400 to-indigo-600"
            },
            {
              title: "Challan Payment",
              description: "Pay traffic violations easily and securely.",
              gradient: "from-sky-400 to-sky-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-2xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className={`absolute bottom-0 left-0 w-1.5 h-full bg-gradient-to-t ${feature.gradient}`} />
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

// Add this mock import at the top
const motion = {
  div: ({ children, className, initial, animate, transition, whileHover, whileTap }) => {
    return <div className={className}>{children}</div>;
  },
  button: ({ children, className, whileHover, whileTap, onClick }) => {
    return <button className={className} onClick={onClick}>{children}</button>;
  }
};
