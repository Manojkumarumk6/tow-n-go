
import React from 'react';
import Hero from '@/components/Hero';
import EmergencyButton from '@/components/EmergencyButton';
import OfflineNotice from '@/components/OfflineNotice';
import Chatbot from '@/components/Chatbot';
import { ChatProvider } from '@/contexts/ChatContext';

const Index = () => {
  return (
    <ChatProvider>
      <div className="page-transition">
        <Hero />
        <OfflineNotice />
        <EmergencyButton />
        <Chatbot />
      </div>
    </ChatProvider>
  );
};

export default Index;
