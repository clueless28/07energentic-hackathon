
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface BecknBrandingProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export const BecknBranding = ({ 
  variant = "default", 
  className = "" 
}: BecknBrandingProps) => {
  const handleLearnMore = () => {
    window.open("https://becknprotocol.io/", "_blank");
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img 
          src="https://becknprotocol.io/wp-content/themes/becknprotocol/images/home/visual-design/visual-marker.png" 
          alt="Beckn Logo" 
          className="h-4"
        />
        <span className="text-xs text-muted-foreground">Powered by Beckn</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <img 
            src="https://becknprotocol.io/wp-content/themes/becknprotocol/images/home/visual-design/visual-marker.png" 
            alt="Beckn Logo" 
            className="h-5"
          />
          <span className="text-sm">Powered by Beckn</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs bg-white hover:bg-slate-50" 
          onClick={handleLearnMore}
        >
          Learn More <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <img 
          src="https://becknprotocol.io/wp-content/themes/becknprotocol/images/home/visual-design/visual-marker.png" 
          alt="Beckn Logo" 
          className="h-6"
        />
        <span className="text-sm font-medium">Powered by Beckn</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white hover:bg-slate-50" 
        onClick={handleLearnMore}
      >
        Learn More About Beckn <ExternalLink className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
};
