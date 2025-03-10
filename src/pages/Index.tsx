
import React from 'react';
import Hero from '@/components/Hero';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';

const Index = () => {
  return (
    <div className="page-transition">
      <Hero />
      <OfflineNotice />
      <EmergencyButton />
    </div>
  );
};

export default Index;
