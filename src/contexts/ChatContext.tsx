
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string; // Using string for ID throughout the application
  type: "system" | "user";
  content: string;
  timestamp: Date;
  source?: string;
  attachment?: string;
  isSearching?: boolean;
}

interface ChatContextType {
  activeConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, responseMessage?: Message | null) => Promise<void>;
  startNewConversation: () => void;
  isConversationInProgress: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConversationInProgress, setIsConversationInProgress] = useState(false);
  const [userEnergyContext, setUserEnergyContext] = useState<string>("");

  // Load user energy data from Supabase on mount
  useEffect(() => {
    const loadUserEnergyData = async () => {
      try {
        // Load user energy stats
        const { data: statsData, error: statsError } = await supabase
          .from('user_energy_stats')
          .select('*')
          .limit(1);
        
        if (statsError) throw statsError;
        
        // Load device status data
        const { data: deviceData, error: deviceError } = await supabase
          .from('device_status')
          .select('*');
        
        if (deviceError) throw deviceError;
        
        // Format the user energy context
        if (statsData && statsData.length > 0) {
          const stats = statsData[0];
          let contextText = `User Energy Profile:\n`;
          contextText += `- Total Earnings: ${stats.total_earnings}\n`;
          contextText += `- Energy Saved: ${stats.energy_saved}\n`;
          contextText += `- Carbon Reduced: ${stats.carbon_reduced}\n\n`;
          
          // Add device information
          if (deviceData && deviceData.length > 0) {
            contextText += `Connected Devices:\n`;
            deviceData.forEach((device) => {
              contextText += `- ${device.device_name} (${device.location}): ${device.status}\n`;
              if (device.last_reading) {
                Object.entries(device.last_reading).forEach(([key, value]) => {
                  contextText += `  ${key}: ${value}\n`;
                });
              }
            });
          }
          
          setUserEnergyContext(contextText);
        }
      } catch (error) {
        console.error("Error loading user energy data:", error);
      }
    };
    
    loadUserEnergyData();
  }, []);

  // Function to retrieve messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        // Convert database messages to Message type
        const formattedMessages = data.map(msg => ({
          id: msg.id as string,
          type: msg.type as "system" | "user",
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          source: msg.source || undefined,
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Initialize or load conversation
  useEffect(() => {
    const loadOrCreateConversation = async () => {
      // Try to get the latest conversation
      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error loading conversation:', error);
        return;
      }
      
      if (conversations && conversations.length > 0) {
        // Use the latest conversation
        const conversationId = conversations[0].id;
        setActiveConversationId(conversationId);
        fetchMessages(conversationId);
        setIsConversationInProgress(true);
      } else {
        // Create a new conversation
        startNewConversation();
      }
    };
    
    loadOrCreateConversation();
  }, []);

  // Create a new conversation
  const startNewConversation = async () => {
    try {
      const conversationId = uuidv4();
      
      const { error } = await supabase
        .from('chat_conversations')
        .insert([{ 
          id: conversationId,
          title: 'New Conversation',
        }]);
      
      if (error) throw error;
      
      setActiveConversationId(conversationId);
      
      // Add initial greeting message
      const welcomeMessage: Message = {
        id: uuidv4(),
        type: "system",
        content: "Hello! I'm your GridSense AI assistant. How can I help you today?",
        timestamp: new Date(),
      };
      
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          content: welcomeMessage.content,
          type: welcomeMessage.type,
          source: "Powered by Gemini"
        }]);
      
      setMessages([welcomeMessage]);
      setIsConversationInProgress(true);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  // Send a new message
  const sendMessage = async (content: string, prebuiltResponse: Message | null = null) => {
    if (!content.trim() || !activeConversationId) return;
    
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: content,
      timestamp: new Date(),
    };
    
    // Update local state immediately for responsive UI
    setMessages((prev) => [...prev, userMessage]);
    
    // If we already have a prebuilt response (for quick replies), use it instead of calling Gemini
    if (prebuiltResponse) {
      setMessages(prev => [...prev, prebuiltResponse]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save user message to Supabase
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: activeConversationId,
          content: userMessage.content,
          type: userMessage.type,
        }]);
      
      // Call Gemini API for response with context from previous messages
      const previousMessages = messages.slice(-6); // Use last 6 messages for context
      const energyPlansContext = await checkForRelevantEnergyPlans(content);
      
      // Combine user energy stats and energy plans context
      const fullContext = `${userEnergyContext}\n\n${energyPlansContext}`.trim();
      
      // Format previous messages for Gemini API
      const geminiMessages = previousMessages.map(msg => ({
        role: msg.type === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
      
      // Add the new user message
      geminiMessages.push({
        role: "user",
        parts: [{ text: content }]
      });
      
      // Get response from Gemini with context
      const aiResponseText = await generateGeminiResponse(geminiMessages, fullContext);
      
      // Create AI response message
      const aiMessage: Message = {
        id: uuidv4(),
        type: "system",
        content: aiResponseText,
        timestamp: new Date(),
        source: fullContext ? "Powered by Gemini + Context" : "Powered by Gemini",
      };
      
      // Save AI message to Supabase
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: activeConversationId,
          content: aiMessage.content,
          type: aiMessage.type,
          search_results: fullContext,
          source: aiMessage.source
        }]);
      
      // Update local state with AI response
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message if something goes wrong
      const errorMessage: Message = {
        id: uuidv4(),
        type: "system",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for relevant energy plans that might provide context to the AI
  const checkForRelevantEnergyPlans = async (query: string): Promise<string> => {
    try {
      const { data: plans, error } = await supabase
        .from('energy_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // If we have plans, format them as context for the AI
      if (plans && plans.length > 0) {
        return `User has the following energy plans: ${plans.map(plan => 
          `${plan.event_title} on ${new Date(plan.event_date).toLocaleDateString()} - ${plan.description}`
        ).join('. ')}`;
      }
      
      return "";
    } catch (error) {
      console.error("Error fetching energy plans:", error);
      return "";
    }
  };

  // Generate response using Gemini API with access to prior context
  const generateGeminiResponse = async (messages: any[], context: string): Promise<string> => {
    try {
      // Import the function from the utility file
      const { generateGeminiResponse } = await import('@/utils/geminiApi');
      
      // Create system prompt with context
      const systemPrompt = {
        role: "user",
        parts: [{
          text: `You are GridSense AI, an energy management assistant focused on helping users optimize their energy usage, 
          understand their consumption patterns, and save money on energy bills. You should personalize responses based on 
          the context provided about the user's energy plans, devices, and usage statistics.
          ${context ? `\n\nUser context: ${context}` : ""}`
        }]
      };
      
      // Prepend system prompt to messages
      const fullPrompt = [systemPrompt, ...messages];
      
      // Call Gemini API
      return await generateGeminiResponse(fullPrompt);
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I'm sorry, I encountered an error while processing your request. Please try again.";
    }
  };

  return (
    <ChatContext.Provider
      value={{
        activeConversationId,
        messages,
        isLoading,
        sendMessage,
        startNewConversation,
        isConversationInProgress
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
