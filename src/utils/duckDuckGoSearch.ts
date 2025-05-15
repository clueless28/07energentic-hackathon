
// Simple utility to search DuckDuckGo and get results

export const searchDuckDuckGo = async (query: string): Promise<string> => {
  try {
    // Using the DuckDuckGo API via RapidAPI
    // Note: This is a workaround since DuckDuckGo doesn't have an official API
    // In a production environment, you'd want to use a proper search API or service
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    
    if (!response.ok) {
      throw new Error(`DuckDuckGo search failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract and format search results
    let searchResults = "";
    
    if (data.Abstract) {
      searchResults += `${data.Abstract}\n\n`;
    }
    
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      searchResults += "Related information:\n";
      data.RelatedTopics.slice(0, 5).forEach((topic: any, index: number) => {
        if (topic.Text) {
          searchResults += `${index + 1}. ${topic.Text}\n`;
        }
      });
    }
    
    return searchResults.trim() || "No relevant search results found.";
  } catch (error) {
    console.error("Error searching DuckDuckGo:", error);
    return "";
  }
};

// Determines if a query should trigger a search
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
