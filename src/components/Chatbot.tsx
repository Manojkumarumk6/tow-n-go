
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat, ChatMessage } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

const Chatbot = () => {
  const { state, sendMessage, toggleChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (state.isOpen) {
      inputRef.current?.focus();
    }
  }, [state.isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  // Chat toggle button
  const ChatButton = () => (
    <motion.button
      className="fixed bottom-24 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleChat}
    >
      <MessageCircle size={24} />
    </motion.button>
  );

  // Individual message component
  const Message = ({ message }: { message: ChatMessage }) => {
    const isBot = message.role === 'bot';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "mb-3 max-w-[80%] p-3 rounded-xl",
          isBot 
            ? "bg-secondary text-secondary-foreground self-start rounded-tl-none" 
            : "bg-primary text-primary-foreground self-end rounded-tr-none"
        )}
      >
        {message.content}
      </motion.div>
    );
  };

  return (
    <>
      <ChatButton />
      
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-96 flex flex-col bg-background border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 bg-primary text-primary-foreground flex justify-between items-center">
              <h3 className="font-medium">Roadside Assistant</h3>
              <button onClick={toggleChat} className="p-1 rounded-full hover:bg-primary-foreground/10">
                <X size={18} />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto flex flex-col">
              {state.messages.map((msg) => (
                <Message key={msg.id} message={msg} />
              ))}
              {state.isLoading && (
                <div className="self-start bg-secondary text-secondary-foreground p-3 rounded-xl rounded-tl-none mb-3">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || state.isLoading}
                className="p-2 rounded-lg bg-primary text-white disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
