import React, { useState, useRef, useEffect } from 'react';
import { getAIChat } from '../services/geminiService';
import type { Chat } from '@google/genai';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const AiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
      { sender: 'bot', text: "Hello! I'm EasyBot. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
        chatRef.current = getAIChat();
    } catch (error) {
        console.error("Failed to initialize AI Chat:", error);
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am unable to connect right now. Please check your API key.'}]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '' }]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        if (!chatRef.current) {
            throw new Error("Chat is not initialized.");
        }
      
      const stream = await chatRef.current.sendMessageStream({ message: currentInput });

      for await (const chunk of stream) {
          const chunkText = chunk.text;
          setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage.sender === 'bot') {
                  lastMessage.text += chunkText;
              }
              return newMessages;
          });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.sender === 'bot' && lastMessage.text === '') {
            lastMessage.text = errorMessage.text;
             return newMessages;
          }
          return [...newMessages, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleCopy = (text: string, index: number) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="flex flex-col h-[70vh] border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 group ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-dark border border-gray-200 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text || '...'}</p>
            </div>
             {msg.sender === 'bot' && !isLoading && msg.text && (
                <button 
                    onClick={() => handleCopy(msg.text, index)}
                    className="p-1.5 rounded-full text-slate-400 bg-slate-100 hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                    title="Copy text"
                >
                  {copiedIndex === index ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
                    </svg>
                  )}
                </button>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.text === '' && (
           <div className="flex items-end gap-2 justify-start">
             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
             <div className="max-w-xs px-4 py-3 rounded-2xl bg-white text-dark border border-gray-200 rounded-bl-none">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white rounded-full p-3 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AiChatbot;