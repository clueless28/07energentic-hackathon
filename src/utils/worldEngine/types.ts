export interface Appliance {
  id: number;
  name: string;
  powerRating: number;
  baseKWh: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface DER {
  id: number;
  switched_on: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  appliance: Appliance;
}

export interface EnergyResource {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  ders: DER[];
}

export interface Meter {
  id: number;
  code: string;
  consumptionLoadFactor: number;
  productionLoadFactor: number;
  type: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  max_capacity_KW: number;
  energyResource: EnergyResource;
}

export interface Transformer {
  id: number;
  name: string;
  city: string;
  state: string;
  latitude: string;
  longtitude: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  max_capacity_KW: number;
  meters: Meter[];
}

export interface Substation {
  id: number;
  name: string;
  city: string;
  state: string;
  latitude: string;
  longtitude: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  max_capacity_KW: number;
  transformers: Transformer[];
}

export interface Utility {
  id: number;
  name: string;
  city: string;
  state: string;
  latitude: string;
  longtitude: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  substations: Substation[];
}

export interface WorldEngineResponse {
  utilities: Utility[];
}

export interface ApplianceUsageData {
  applianceId: number;
  applianceName: string;
  powerRating: number;
  derId: number;
  meterId: number;
  meterCode: string;
  transformerId: number;
  transformerName: string;
  substationId: number;
  substationName: string;
  utilityId: number;
  utilityName: string;
  switched_on: boolean;
  updatedAt: string;
  resourceOwnerName: string;
  location: {
    city: string;
    state: string;
  }
}

export interface PeakUsageData {
  level: 'appliance' | 'meter' | 'transformer' | 'substation' | 'utility';
  id: number;
  name: string;
  currentUsageKW: number;
  maxCapacityKW?: number;
  usagePercentage?: number;
  children?: PeakUsageData[];
}

export interface GridAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  affectedComponents?: string[];
  affectedDerIds?: number[];
  potentialSavingsKW: number;
  potentialSavingsPercent: number;
  suggestedAction: string;
}
