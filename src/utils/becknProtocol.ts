import { v4 as uuidv4 } from 'uuid';

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────

// Beckn BAP (consumer app) settings
const BAP_ID = "bap-ps-network-deg-team2.becknprotocol.io";
const BAP_URI = "https://bap-ps-network-deg-team2.becknprotocol.io/";
// Beckn BPP (utility agent) settings
const BPP_ID = "bpp-ps-network-deg-team2.becknprotocol.io";
const BPP_URI = "https://bpp-ps-network-deg-team2.becknprotocol.io/";
// The BAP's client-facing base URL
const BASEURL = "https://bap-ps-client-deg-team2.becknprotocol.io";
// World Engine simulator base URL (no API key required)
const WORLD_ENGINE_URL = "http://world-engine-team2.becknprotocol.io/meter-data-simulator";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface BecknContext {
  domain: string;
  action: string;
  version: string;
  bap_id: string;
  bap_uri: string;
  bpp_id: string;
  bpp_uri: string;
  transaction_id: string;
  message_id: string;
  timestamp: string;
}

export interface BecknSearchRequest {
  context: BecknContext;
  message: {
    intent: {
      descriptor: {
        name: string;
      };
    };
  };
}

export interface BecknSelectRequest {
  context: BecknContext;
  message: {
    order: {
      provider: {
        id: string;
      };
      items: Array<{
        id: string;
      }>;
    };
  };
}

export interface BecknInitRequest {
  context: BecknContext;
  message: {
    order: {
      provider: {
        id: string;
      };
      items: Array<{
        id: string;
      }>;
      fulfillments: Array<{
        id: string;
        start: string;
        end: string;
      }>;
    };
  };
}

export interface BecknConfirmRequest {
  context: BecknContext;
  message: {
    order: {
      id: string;
      fulfillments: Array<{
        id: string;
        agent_id: string;
        start: string;
        end: string;
      }>;
    };
  };
}

export interface BecknStatusRequest {
  context: BecknContext;
  message: {
    order_id: string;
  };
}

export interface BecknDemandFlexOffer {
  id: string;
  name: string;
  description: string;
  provider_id: string;
  price: number;
  currency: string;
  start_time: string;
  end_time: string;
  capacity_reduction_kw: number;
  incentive_amount: number;
}

export interface BecknProvider {
  id: string;
  name: string;
  description?: string;
  items: Array<BecknDemandFlexOffer>;
}

export interface BecknSearchResponse {
  context: BecknContext;
  message: {
    catalog: Array<BecknProvider>;
  };
}

export interface BecknSelectResponse {
  context: BecknContext;
  message: {
    order: {
      provider: {
        id: string;
      };
      items: Array<{
        id: string;
        price: {
          value: number;
          currency: string;
        };
      }>;
    };
  };
}

export interface BecknInitResponse {
  context: BecknContext;
  message: {
    order: {
      id: string;
      provider: {
        id: string;
      };
      items: Array<{
        id: string;
      }>;
      quote: {
        price: {
          value: number;
          currency: string;
        };
      };
    };
  };
}

export interface BecknConfirmResponse {
  context: BecknContext;
  message: {
    order: {
      id: string;
      state: string;
      fulfillment: {
        id: string;
        start: string;
        end: string;
      };
    };
  };
}

export interface BecknStatusResponse {
  context: BecknContext;
  message: {
    order: {
      id: string;
      state: string;
    };
  };
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

// Sample demand flexibility offers (for demonstration)
export const mockDemandFlexOffers: BecknDemandFlexOffer[] = [
  {
    id: "offer-001",
    name: "Peak Shifting Offer",
    description: "Reduce energy consumption during peak hours",
    provider_id: "eco-grid",
    price: 25,
    currency: "USD",
    start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    end_time: new Date(Date.now() + 7200000).toISOString(),   // 2 hours from now
    capacity_reduction_kw: 1.5,
    incentive_amount: 5
  },
  {
    id: "offer-002",
    name: "Grid Balancing Event",
    description: "Support grid stability and earn rewards",
    provider_id: "eco-grid",
    price: 30,
    currency: "USD",
    start_time: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    end_time: new Date(Date.now() + 90000000).toISOString(),   // 25 hours from now
    capacity_reduction_kw: 2.0,
    incentive_amount: 7
  },
  {
    id: "offer-003",
    name: "Carbon Reduction Initiative",
    description: "Reduce your carbon footprint during high carbon intensity periods",
    provider_id: "green-power",
    price: 20,
    currency: "USD",
    start_time: new Date(Date.now() + 172800000).toISOString(), // 48 hours from now
    end_time: new Date(Date.now() + 180000000).toISOString(),   // 50 hours from now
    capacity_reduction_kw: 1.0,
    incentive_amount: 3
  }
];

// ─── UTILS: Beckn Context & HTTP Helpers ────────────────────────────────────────

export const buildContext = (action: string): BecknContext => {
  return {
    domain: "deg:service",
    action: action,
    version: "1.1.0",
    bap_id: BAP_ID,
    bap_uri: BAP_URI,
    bpp_id: BPP_ID,
    bpp_uri: BPP_URI,
    transaction_id: uuidv4(),
    message_id: uuidv4(),
    timestamp: new Date().toISOString()
  };
};

// ─── BECKN FLOW METHODS ─────────────────────────────────────────────────────────

// Mock implementation of the Beckn protocol for demonstration purposes
export const becknSearch = async (): Promise<BecknSearchResponse> => {
  // In a real implementation, this would make an API call to the Beckn network
  console.log("Sending Beckn search request for demand flexibility offers");
  
  // Mock response
  const response: BecknSearchResponse = {
    context: buildContext("search"),
    message: {
      catalog: [
        {
          id: "eco-grid",
          name: "EcoGrid Energy",
          description: "Sustainable energy solutions",
          items: mockDemandFlexOffers.filter(offer => offer.provider_id === "eco-grid")
        },
        {
          id: "green-power",
          name: "Green Power Network",
          description: "Renewable energy provider",
          items: mockDemandFlexOffers.filter(offer => offer.provider_id === "green-power")
        }
      ]
    }
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return response;
};

export const becknSelect = async (
  providerId: string, 
  itemId: string
): Promise<BecknSelectResponse> => {
  console.log(`Sending Beckn select request for provider=${providerId}, item=${itemId}`);
  
  // Find the selected offer
  const selectedOffer = mockDemandFlexOffers.find(offer => 
    offer.provider_id === providerId && offer.id === itemId
  );
  
  if (!selectedOffer) {
    throw new Error("Offer not found");
  }
  
  // Mock response
  const response: BecknSelectResponse = {
    context: buildContext("select"),
    message: {
      order: {
        provider: {
          id: providerId
        },
        items: [
          {
            id: itemId,
            price: {
              value: selectedOffer.price,
              currency: selectedOffer.currency
            }
          }
        ]
      }
    }
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return response;
};

export const becknInit = async (
  providerId: string,
  itemId: string,
  fulfillmentOptions: Array<{id: string; start: string; end: string;}>
): Promise<BecknInitResponse> => {
  console.log(`Sending Beckn init request for provider=${providerId}, item=${itemId}`);
  
  // Find the selected offer
  const selectedOffer = mockDemandFlexOffers.find(offer => 
    offer.provider_id === providerId && offer.id === itemId
  );
  
  if (!selectedOffer) {
    throw new Error("Offer not found");
  }
  
  // Mock response
  const response: BecknInitResponse = {
    context: buildContext("init"),
    message: {
      order: {
        id: `order-${uuidv4().split('-')[0]}`,
        provider: {
          id: providerId
        },
        items: [
          {
            id: itemId
          }
        ],
        quote: {
          price: {
            value: selectedOffer.price,
            currency: selectedOffer.currency
          }
        }
      }
    }
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return response;
};

export const becknConfirm = async (
  orderId: string,
  fulfillment: {id: string; agent_id: string; start: string; end: string;}
): Promise<BecknConfirmResponse> => {
  console.log(`Sending Beckn confirm request for order=${orderId}`);
  
  // Mock response
  const response: BecknConfirmResponse = {
    context: buildContext("confirm"),
    message: {
      order: {
        id: orderId,
        state: "CONFIRMED",
        fulfillment: {
          id: fulfillment.id,
          start: fulfillment.start,
          end: fulfillment.end
        }
      }
    }
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return response;
};

export const becknStatus = async (orderId: string): Promise<BecknStatusResponse> => {
  console.log(`Sending Beckn status request for order=${orderId}`);
  
  // Mock response
  const response: BecknStatusResponse = {
    context: buildContext("status"),
    message: {
      order: {
        id: orderId,
        state: "ACTIVE"
      }
    }
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return response;
};

// New function for marketplace participation
export const participateInOffer = async (providerId: string, offerId: string): Promise<any> => {
  console.log(`Participating in offer: provider=${providerId}, offerId=${offerId}`);
  
  // Step 1: Select the offer
  const selectResponse = await becknSelect(providerId, offerId);
  console.log("Offer selected:", selectResponse);
  
  // Step 2: Initialize the order
  const now = new Date();
  const later = new Date(now.getTime() + 3600000); // 1 hour from now
  
  const fulfillmentOptions = [{
    id: uuidv4(),
    start: now.toISOString(),
    end: later.toISOString()
  }];
  
  const initResponse = await becknInit(providerId, offerId, fulfillmentOptions);
  console.log("Offer initialized:", initResponse);
  
  const orderId = initResponse.message.order.id;
  
  // Step 3: Confirm the order
  const fulfillment = {
    id: uuidv4(),
    agent_id: BPP_ID || "default-agent",  // Add the required agent_id
    start: now.toISOString(),
    end: later.toISOString()
  };
  
  const confirmResponse = await becknConfirm(orderId, fulfillment);
  console.log("Offer confirmed:", confirmResponse);
  
  return confirmResponse;
};

// ─── WORLD ENGINE SIMULATION ──────────────────────────────────────────────────

export const listMeters = async (): Promise<any[]> => {
  // In a real implementation, this would make an API call to the World Engine API
  console.log("Fetching simulated household meters and DER IDs");
  
  // Mock response
  const meters = [
    { 
      id: "MTR-0010", 
      type: "SMART", 
      location: { 
        city: "San Francisco", 
        state: "CA" 
      },
      consumption: 15.2,
      production: 0
    }
  ];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return meters;
};

export const toggleDer = async (derId: string): Promise<{ success: boolean; status: string; }> => {
  console.log(`Toggling DER ${derId} to simulate demand-flex`);
  
  // Mock response
  const response = { 
    success: true, 
    status: "Device toggled successfully" 
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return response;
};

// Export BPP_ID for use in EventsList.tsx
export { BPP_ID };
