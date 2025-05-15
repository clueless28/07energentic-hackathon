
import { WorldEngineResponse } from "./types";

// Sample fallback data when API is unavailable
import { sampleUtilityData } from "./sampleData";

const API_BASE_URL = "http://world-engine-team2.becknprotocol.io/meter-data-simulator";

// Fetch utility data from the World Engine API
export async function fetchUtilityData(): Promise<WorldEngineResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/detailed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`API request failed with status: ${response.status}. Using sample data instead.`);
      return sampleUtilityData;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching utility data:", error);
    console.warn("Using sample utility data as fallback");
    return sampleUtilityData;
  }
}
