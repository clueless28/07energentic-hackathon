
// Mock data for GridSense application
// This data simulates the real API responses that would come from the Beckn-ONIX protocol

export const energyUsageData = [
  { time: '12AM', usage: 2.3 },
  { time: '2AM', usage: 1.8 },
  { time: '4AM', usage: 1.5 },
  { time: '6AM', usage: 2.1 },
  { time: '8AM', usage: 3.2 },
  { time: '10AM', usage: 3.8 },
  { time: '12PM', usage: 4.2 },
  { time: '2PM', usage: 4.5 },
  { time: '4PM', usage: 5.1 },
  { time: '6PM', usage: 5.8 },
  { time: '8PM', usage: 4.2 },
  { time: '10PM', usage: 2.9 },
];

export const demandResponseEvents = [
  {
    id: 'dr-001',
    title: 'Peak Demand Reduction',
    status: 'upcoming',
    date: '2025-05-10',
    timeRange: '2:00 PM - 6:00 PM',
    incentive: '$0.75/kWh',
    potentialEarnings: '$15-25',
    description: 'Reduce energy consumption during high demand period',
    targetReduction: '30%',
    participants: 1243,
    deviceEligibility: ['HVAC', 'Water Heater', 'EV Charger'],
    aiRecommendation: 'Accept and adjust HVAC by 2 degrees',
  },
  {
    id: 'dr-002',
    title: 'Grid Stability Support',
    status: 'active',
    date: '2025-05-09',
    timeRange: '4:00 PM - 7:00 PM',
    incentive: '$0.50/kWh',
    potentialEarnings: '$8-15',
    description: 'Support grid stability during renewable integration',
    targetReduction: '20%',
    participants: 856,
    deviceEligibility: ['HVAC', 'EV Charger'],
    aiRecommendation: 'Accept and delay EV charging',
  },
  {
    id: 'dr-003',
    title: 'Renewable Surplus Utilization',
    status: 'upcoming',
    date: '2025-05-12',
    timeRange: '11:00 AM - 3:00 PM',
    incentive: '$0.40/kWh bonus',
    potentialEarnings: '$5-12',
    description: 'Increase consumption during solar surplus',
    targetReduction: '-10%',
    participants: 534,
    deviceEligibility: ['Water Heater', 'EV Charger', 'Pool Pump'],
    aiRecommendation: 'Accept and pre-cool home',
  },
];

export const userDevices = [
  {
    id: 'dev-001',
    name: 'Living Room HVAC',
    type: 'HVAC',
    status: 'connected',
    flexibility: 'high',
    currentUsage: '1.2 kW',
    savingPotential: '30%',
  },
  {
    id: 'dev-002',
    name: 'Tesla Model Y',
    type: 'EV Charger',
    status: 'connected',
    flexibility: 'medium',
    currentUsage: '7.4 kW',
    savingPotential: '50%',
  },
  {
    id: 'dev-003',
    name: 'Water Heater',
    type: 'Water Heater',
    status: 'connected',
    flexibility: 'high',
    currentUsage: '0.8 kW',
    savingPotential: '40%',
  },
];

export const historicalTransactions = [
  {
    id: 'tx-001',
    date: '2025-05-01',
    event: 'Peak Demand Reduction',
    energySaved: '3.2 kWh',
    earnings: '$4.80',
    devices: ['HVAC', 'Water Heater'],
    status: 'completed',
  },
  {
    id: 'tx-002',
    date: '2025-04-28',
    event: 'Grid Stability Support',
    energySaved: '2.7 kWh',
    earnings: '$1.35',
    devices: ['EV Charger'],
    status: 'completed',
  },
  {
    id: 'tx-003',
    date: '2025-04-15',
    event: 'Emergency DR Event',
    energySaved: '4.1 kWh',
    earnings: '$8.20',
    devices: ['HVAC', 'EV Charger', 'Water Heater'],
    status: 'completed',
  },
];

export const userStats = {
  totalEarnings: '$65.40',
  energySaved: '45.8 kWh',
  eventsParticipated: 12,
  carbonReduced: '35.2 kg',
  savingsRate: '18%',
};
