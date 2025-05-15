
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { ChatProvider } from "@/contexts/ChatContext";
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Smart Energy Assistant</h1>
          <p className="text-muted-foreground">
            Powered by Google's Gemini 2.0 Flash LLM with memory and contextual awareness. 
            Ask questions about energy optimization, usage patterns, or get recommendations for saving energy.
          </p>
        </div>
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
};

export default Chat;
