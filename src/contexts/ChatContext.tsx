
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
      const botResponse = "I'm still learning how to respond to specific requests. Please contact our support team for assistance.";
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
