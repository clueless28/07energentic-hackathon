
import { WorldEngineResponse } from "./types";

// Sample data to use when API is unavailable
export const sampleUtilityData: WorldEngineResponse = {
  utilities: [
    {
      id: 22,
      name: "Pacific Gas and Electric Company",
      city: "San Francisco",
      state: "CA",
      latitude: "37.7929",
      longtitude: "-122.3969",
      pincode: "94105",
      createdAt: "2023-05-14T06:18:33.829Z",
      updatedAt: "2023-05-14T06:18:33.829Z",
      publishedAt: "2023-05-14T06:18:33.829Z",
      substations: [
        {
          id: 41,
          name: "SF Mission Substation",
          city: "San Francisco",
          state: "CA",
          latitude: "37.784317",
          longtitude: "-122.441556",
          pincode: "94103",
          createdAt: "2023-05-14T06:18:33.838Z",
          updatedAt: "2023-05-14T06:18:33.838Z",
          publishedAt: "2023-05-14T06:18:33.838Z",
          max_capacity_KW: 100,
          transformers: [
            {
              id: 160,
              name: "Transformer T1-SF-Mission",
              city: "San Francisco",
              state: "CA",
              latitude: "37.746698",
              longtitude: "-122.500327",
              pincode: "94103",
              createdAt: "2023-05-14T06:18:33.854Z",
              updatedAt: "2023-05-14T06:18:33.854Z",
              publishedAt: "2023-05-14T06:18:33.854Z",
              max_capacity_KW: 12,
              meters: [
                {
                  id: 1522,
                  code: "MTR-SF-A1",
                  consumptionLoadFactor: 1,
                  productionLoadFactor: 0,
                  type: "SMART",
                  city: "San Francisco",
                  state: "CA",
                  latitude: 37.78,
                  longitude: -122.42,
                  pincode: "94103",
                  createdAt: "2023-05-14T06:18:33.892Z",
                  updatedAt: "2023-05-14T06:18:33.892Z",
                  publishedAt: "2023-05-14T06:18:33.892Z",
                  max_capacity_KW: 5,
                  energyResource: {
                    id: 1833,
                    name: "Residential Customer - Jones Family",
                    type: "CONSUMER",
                    createdAt: "2023-05-14T06:18:34.152Z",
                    updatedAt: "2023-05-14T06:18:34.152Z",
                    publishedAt: "2023-05-14T06:18:34.152Z",
                    ders: [
                      {
                        id: 2880,
                        switched_on: true,
                        createdAt: "2023-05-14T06:18:35.293Z",
                        updatedAt: "2025-05-15T06:18:35.293Z", // Today's date
                        publishedAt: "2023-05-14T06:18:35.293Z",
                        appliance: {
                          id: 6,
                          name: "Electric Oven",
                          powerRating: 2500, // High power to trigger alert
                          baseKWh: 0.042,
                          description: "High-power kitchen appliance",
                          createdAt: "2023-05-11T11:08:13.682Z",
                          updatedAt: "2023-05-11T11:08:13.682Z",
                          publishedAt: "2023-05-11T11:08:13.682Z"
                        }
                      },
                      {
                        id: 2881,
                        switched_on: true,
                        createdAt: "2023-05-14T06:18:35.293Z",
                        updatedAt: "2025-05-15T06:18:35.293Z", // Today's date
                        publishedAt: "2023-05-14T06:18:35.293Z",
                        appliance: {
                          id: 7,
                          name: "Air Conditioner",
                          powerRating: 1800,
                          baseKWh: 0.03,
                          description: "Central home cooling system",
                          createdAt: "2023-05-11T11:08:13.682Z",
                          updatedAt: "2023-05-11T11:08:13.682Z",
                          publishedAt: "2023-05-11T11:08:13.682Z"
                        }
                      }
                    ]
                  }
                },
                {
                  id: 1523,
                  code: "MTR-SF-B2",
                  consumptionLoadFactor: 1,
                  productionLoadFactor: 0,
                  type: "SMART",
                  city: "San Francisco",
                  state: "CA",
                  latitude: 37.79,
                  longitude: -122.43,
                  pincode: "94103",
                  createdAt: "2023-05-14T06:18:33.892Z",
                  updatedAt: "2023-05-14T06:18:33.892Z",
                  publishedAt: "2023-05-14T06:18:33.892Z",
                  max_capacity_KW: 4.8,
                  energyResource: {
                    id: 1834,
                    name: "Residential Customer - Smith Family",
                    type: "CONSUMER",
                    createdAt: "2023-05-14T06:18:34.152Z",
                    updatedAt: "2023-05-14T06:18:34.152Z",
                    publishedAt: "2023-05-14T06:18:34.152Z",
                    ders: [
                      {
                        id: 2882,
                        switched_on: true,
                        createdAt: "2023-05-14T06:18:35.307Z",
                        updatedAt: "2025-05-15T06:18:35.307Z", // Today's date
                        publishedAt: "2023-05-14T06:18:35.307Z",
                        appliance: {
                          id: 4,
                          name: "Electric Vehicle Charger",
                          powerRating: 7200, // Very high power consumption
                          baseKWh: 0.12,
                          description: "Level 2 EV Charger",
                          createdAt: "2023-05-11T11:08:13.629Z",
                          updatedAt: "2023-05-11T11:08:13.629Z",
                          publishedAt: "2023-05-11T11:08:13.629Z"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
