
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquare, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { ReactNode } from "react";

// Updated Message interface to use string ID to match ChatContext
interface Message {
  id: string;
  type: "system" | "user";
  content: string;
  timestamp: Date;
  source?: string;
  attachment?: string;
}

interface ChatMessageProps {
  message: Message;
  onCopy: (content: string) => void;
  customComponent?: ReactNode;
}

export const ChatMessage = ({ message, onCopy, customComponent }: ChatMessageProps) => {
  const isSystem = message.type === "system";
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);
  
  // Function to render message content or custom component
  const renderContent = () => {
    if (customComponent) {
      return (
        <>
          <div className="prose prose-sm max-w-none mb-4">
            {message.content.includes("<") ? (
              // If there's HTML/component tags, only show text before the tag
              <ReactMarkdown>
                {message.content.split('<')[0].trim()}
              </ReactMarkdown>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
          {customComponent}
        </>
      );
    } else {
      return (
        <div className="prose prose-sm max-w-none">
          {isSystem ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-3xl animate-fade-in",
      isSystem ? "self-start" : "self-end ml-auto flex-row-reverse"
    )}>
      {/* Avatar */}
      <Avatar className={cn(
        "h-8 w-8 flex-shrink-0",
        isSystem ? "border-primary/50" : "border-accent/50"
      )}>
        <div className={cn(
          "h-full w-full rounded-full flex items-center justify-center",
          isSystem ? "bg-gradient-to-br from-primary to-accent" : "bg-gradient-to-br from-accent to-primary"
        )}>
          {isSystem ? (
            <MessageSquare className="text-white h-4 w-4" />
          ) : (
            <User className="text-white h-4 w-4" />
          )}
        </div>
      </Avatar>
      
      {/* Message content */}
      <div className={cn(
        "rounded-lg p-4 max-w-[calc(100%-3rem)]",
        isSystem 
          ? "bg-card border shadow-sm" 
          : "bg-primary/10 border border-primary/20"
      )}>
        {renderContent()}
        
        {message.source && (
          <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
            Source: {message.source}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
          
          {isSystem && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCopy(message.content)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
