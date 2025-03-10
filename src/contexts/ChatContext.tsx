
import React, { createContext, useContext, useState, useReducer, ReactNode } from 'react';

// Define message types
type MessageRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
}

type ChatAction = 
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_LOADING'; isLoading: boolean };

const initialState: ChatState = {
  messages: [
    {
      id: '1',
      role: 'bot',
      content: 'Hello! I\'m your roadside assistance bot. How can I help you today?',
      timestamp: new Date(),
    },
  ],
  isOpen: false,
  isLoading: false,
};

// Create a reducer to handle chat actions
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};

// Create context
type ChatContextType = {
  state: ChatState;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Function to send a new message
  const sendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    dispatch({ type: 'ADD_MESSAGE', message: userMessage });
    dispatch({ type: 'SET_LOADING', isLoading: true });
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateBotResponse(content);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', message: botMessage });
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }, 1000);
  };

  // Function to toggle chat open/closed
  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };

  return (
    <ChatContext.Provider value={{ state, sendMessage, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Simple function to generate responses based on user input
const generateBotResponse = (userMessage: string): string => {
  const normalizedMessage = userMessage.toLowerCase();
  
  if (normalizedMessage.includes('towing') || normalizedMessage.includes('tow')) {
    return "I can help you request a towing service. Please confirm your location and I'll dispatch assistance right away.";
  } else if (normalizedMessage.includes('repair') || normalizedMessage.includes('fix')) {
    return "Our mobile repair service can help with basic repairs. What specific issue are you experiencing with your vehicle?";
  } else if (normalizedMessage.includes('challan') || normalizedMessage.includes('ticket') || normalizedMessage.includes('fine')) {
    return "I can guide you through the process of paying your traffic challan. Would you like to proceed with that?";
  } else if (normalizedMessage.includes('fuel') || normalizedMessage.includes('gas') || normalizedMessage.includes('petrol')) {
    return "Running out of fuel? I can arrange for fuel delivery to your location. How much and what type of fuel do you need?";
  } else if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi') || normalizedMessage.includes('hey')) {
    return "Hello! How can I assist you with your roadside needs today?";
  } else if (normalizedMessage.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  } else if (normalizedMessage.includes('bye') || normalizedMessage.includes('goodbye')) {
    return "Thank you for using our service. Safe travels!";
  } else if (normalizedMessage.includes('emergency')) {
    return "If you're in an emergency situation, please use the emergency button for immediate assistance, or call emergency services directly.";
  } else if (normalizedMessage.includes('location') || normalizedMessage.includes('where')) {
    return "I can use your device's location to help find services near you. Would you like to share your location?";
  } else if (normalizedMessage.includes('offline') || normalizedMessage.includes('no internet')) {
    return "Don't worry! Our app works offline for critical emergency services like towing and roadside assistance.";
  } else {
    return "I'm here to help with roadside assistance, towing services, repairs, and challan payments. Could you provide more details about what you need?";
  }
};
