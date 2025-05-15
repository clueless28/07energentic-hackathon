
// API key for Gemini API
// This is a publishable key meant to be used in client-side code
export const GEMINI_API_KEY = os.getenv(GEMINI_API_KEY)

export interface GeminiMessage {
  role: "user" | "model"; // Strict typing here
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
  }[];
}

export const generateGeminiResponse = async (
  messages: GeminiMessage[],
  searchResults?: string
): Promise<string> => {
  try {
    // Create the full prompt incorporating search results if available
    let fullPrompt = [...messages];
    
    // If search results are provided, add them to the system prompt
    if (searchResults && messages.length > 0) {
      // Find the system prompt (usually the first message)
      const systemPromptIndex = 0;
      const systemPrompt = messages[systemPromptIndex];
      
      // Augment the system prompt with search results
      const augmentedSystemPrompt = {
        ...systemPrompt,
        parts: [{ 
          text: `${systemPrompt.parts[0].text}\n\nHere is some relevant context that may help you answer: ${searchResults}`
        }]
      };
      
      // Replace the system prompt with the augmented version
      fullPrompt = [
        augmentedSystemPrompt,
        ...messages.slice(1)
      ];
    }
    
    // Make the request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: fullPrompt,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated from Gemini");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};

// Function to determine if a user query should trigger a search
export const shouldPerformSearch = (query: string): boolean => {
  // List of keywords that might indicate a factual question
  const factualKeywords = [
    "what", "how", "when", "where", "who", "which", "why",
    "explain", "tell me about", "information", "facts", "data",
    "energy", "consumption", "savings", "efficiency", "appliance",
    "electricity", "power", "grid", "utility", "bill", "cost",
    "average", "typical", "compare", "difference", "renewable",
    "solar", "wind", "battery", "storage", "peak hours", "off-peak"
  ];
  
  const queryLower = query.toLowerCase();
  
  // Check if any factual keywords are in the query
  return factualKeywords.some(keyword => queryLower.includes(keyword));
};
