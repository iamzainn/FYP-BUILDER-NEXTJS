import { useState, useRef, useEffect } from 'react';
import { AIService } from '../services/aiService';
import { WebsiteConfig } from '../types/websiteConfig';

interface AIChatProps {
  apiKey: string;
  currentConfig: WebsiteConfig;
  onConfigUpdate: (newConfig: WebsiteConfig) => void;
}

export default function AIChat({ apiKey, currentConfig, onConfigUpdate }: AIChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const aiService = useRef<AIService>(new AIService(apiKey));

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiService.current.getHistory()]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey || isLoading) return;

    setIsLoading(true);
    try {
      const response = await aiService.current.processUserRequest(inputMessage.trim(), currentConfig);
      
      // Create a new config object with only the updated parts
      const updatedConfig: WebsiteConfig = { ...currentConfig };
      
      if (response.navbarConfig) {
        // @ts-expect-error - Type mismatch between NavbarConfig imports with different type constraints
        updatedConfig.navbarConfig = response.navbarConfig;
      }
      
      if (response.heroConfig) {
        // @ts-expect-error - Type mismatch between HeroConfig imports with different type constraints
        updatedConfig.heroConfig = response.heroConfig;
      }
      
      if (response.collectionConfig) {
        // @ts-expect-error - Type mismatch between CollectionConfig imports with different type constraints
        updatedConfig.collectionConfig = response.collectionConfig;
      }
      
      // Only call onConfigUpdate if we have changes
      if (response.navbarConfig || response.heroConfig || response.collectionConfig) {
        onConfigUpdate(updatedConfig);
      }
      
      setInputMessage('');
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="mt-2">
      <div 
        ref={chatContainerRef}
        className="bg-gray-900 bg-opacity-50 rounded-xl p-4 h-64 md:h-80 overflow-y-auto mb-4 shadow-inner border border-gray-700"
      >
        {aiService.current.getHistory().length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-sm">Ask AI to customize your navbar design or create new elements!</p>
            <p className="text-xs mt-2 opacity-70">Example: &ldquo;Make a modern dark navbar with blue accents&ldquo; or &ldquo;Add a logo and 3 menu items&ldquo;</p>
          </div>
        ) : (
          <>
            {aiService.current.getHistory().map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-xl max-w-[85%] shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1 pb-1 border-b border-gray-700">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                      <span className="text-xs font-medium text-blue-300">AI Assistant</span>
                    </div>
                  )}
                  <div className={message.role === 'user' ? '' : 'text-sm'}>{message.content}</div>
                </div>
              </div>
            ))}
          </>
        )}
        {isLoading && (
          <div className="text-center text-gray-400 py-2">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
              <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 relative">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI to customize your website..."
          className="flex-1 p-2 pl-3 pr-10 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          aria-label="Type your message to the AI"
          title="Type your message to the AI"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${
            isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm'
          }`}
          title="Send message"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
            />
          </svg>
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-2 text-center">
        Powered by AI · Type a natural language request to customize your design
      </div>
    </div>
  );
} 