
import { Button } from "@/components/ui/button";

interface QuickReplyButtonProps {
  text: string;
  onClick: () => void;
}

export const QuickReplyButton = ({ text, onClick }: QuickReplyButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      className="bg-card/50 hover:bg-card/80 transition-colors rounded-full text-sm"
    >
      {text}
    </Button>
  );
};
