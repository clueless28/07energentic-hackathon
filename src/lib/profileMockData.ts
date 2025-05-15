// Mock data for user profile and grid information

export const userProfile = {
  id: "user-001",
  name: "Adam Conley",
  email: "adam.conley@example.com",
  address: "123 Energy Drive, San Francisco, CA 94103",
  joinDate: "2023-05-15",
  energyPlan: "Smart Green Plus",
  savingsToDate: "$342.78",
  carbonReduced: "1,245 kg",
  eventsParticipated: 28,
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  preferences: {
    notifications: true,
    autoOptIn: true,
    privateMode: false,
    dataSharingLevel: "Enhanced"
  },
  consumerType: "Consumer",
  badges: [
    { id: "badge-001", name: "Energy Saver", icon: "award", description: "Saved 1000+ kWh through demand response events", earned: "2024-03-15" },
    { id: "badge-002", name: "Grid Guardian", icon: "shield", description: "Participated in 25+ grid stabilization events", earned: "2024-02-01" },
    { id: "badge-003", name: "Carbon Crusher", icon: "leaf", description: "Reduced carbon footprint by 1000+ kg", earned: "2024-01-10" },
    { id: "badge-004", name: "Community Champion", icon: "users", description: "Referred 5+ friends to GridSense", earned: "2023-11-22" },
  ],
};

export const utilityInfo = {
  company: "Pacific Gas and Electric Company",
  plan: "Smart Green Plus",
  serviceAddress: "123 Energy Drive, San Francisco, CA 94103",
  accountNumber: "EG-78912345",
  meterNumber: "MTR-0010",
  meterType: "SMART",
  meterDetails: {
    consumptionLoadFactor: 1,
    productionLoadFactor: 0,
    city: "San Francisco",
    state: "CA",
    latitude: 37.7843,
    longitude: -122.441556,
    pincode: "94103"
  },
  transformerId: "144",
  substationId: "41",
  gridRegion: "SF Mission substation",
  derResources: [
    { id: "der-001", type: "Solar Panels", capacity: "5.8 kW", installed: "2022-06-10", status: "Active" },
    { id: "der-002", type: "Home Battery", capacity: "13.5 kWh", installed: "2022-06-15", status: "Active" },
    { id: "der-003", type: "EV Charger", capacity: "11.5 kW", installed: "2022-07-01", status: "Active" },
  ],
};

export const maintenanceEvents = [
  { 
    id: "maint-001", 
    component: "Transformer", 
    componentId: "144", 
    type: "Scheduled Maintenance", 
    status: "Planned", 
    scheduledStart: "2025-05-20T08:00:00", 
    scheduledEnd: "2025-05-20T16:00:00",
    description: "Routine transformer inspection and maintenance",
    impact: "No service interruption expected" 
  },
  { 
    id: "maint-002", 
    component: "Substation", 
    componentId: "41", 
    type: "Repair", 
    status: "In Progress", 
    scheduledStart: "2025-05-15T10:00:00", 
    scheduledEnd: "2025-05-16T18:00:00",
    description: "Replacement of aging equipment",
    impact: "Possible brief outages during switchover" 
  },
  { 
    id: "maint-003", 
    component: "Distribution Line", 
    componentId: "DL-5432", 
    type: "Emergency Repair", 
    status: "Completed", 
    scheduledStart: "2025-05-10T14:00:00", 
    scheduledEnd: "2025-05-10T20:00:00",
    description: "Storm damage repair",
    impact: "Service restored at 18:45" 
  },
];

export const billingHistory = [
  {
    id: "bill-001",
    period: "April 2025",
    amount: "$94.32",
    dueDate: "2025-05-15",
    status: "Paid",
    savingsFromDR: "$18.75",
    peakUsage: "12.4 kWh",
    baselineUsage: "8.2 kWh",
    drEvents: 3,
  },
  {
    id: "bill-002",
    period: "March 2025",
    amount: "$102.57",
    dueDate: "2025-04-15",
    status: "Paid",
    savingsFromDR: "$15.20",
    peakUsage: "14.8 kWh",
    baselineUsage: "9.1 kWh",
    drEvents: 2,
  },
  {
    id: "bill-003",
    period: "February 2025",
    amount: "$118.63",
    dueDate: "2025-03-15",
    status: "Paid",
    savingsFromDR: "$12.40",
    peakUsage: "16.2 kWh",
    baselineUsage: "10.5 kWh",
    drEvents: 2,
  },
];

export const leaderboardData = [
  { rank: 1, name: "Emily Rodriguez", savings: "1245 kWh", carbon: "987 kg", points: 8750 },
  { rank: 2, name: "Michael Wong", savings: "1120 kWh", carbon: "875 kg", points: 8320 },
  { rank: 3, name: "Sarah Johnson", savings: "1050 kWh", carbon: "812 kg", points: 7840 },
  { rank: 4, name: "Alexander Chen", savings: "982 kWh", carbon: "768 kg", points: 7210 }, // Current user
  { rank: 5, name: "David Kim", savings: "945 kWh", carbon: "742 kg", points: 6980 },
  { rank: 6, name: "Lisa Patel", savings: "872 kWh", carbon: "701 kg", points: 6540 },
  { rank: 7, name: "James Wilson", savings: "845 kWh", carbon: "675 kg", points: 6120 },
  { rank: 8, name: "Emma Davis", savings: "810 kWh", carbon: "650 kg", points: 5980 },
  { rank: 9, name: "Robert Taylor", savings: "785 kWh", carbon: "628 kg", points: 5760 },
  { rank: 10, name: "Olivia Brown", savings: "768 kWh", carbon: "615 kg", points: 5630 },
];

export const gridComponents = [
  {
    id: "component-1",
    type: "powerPlant",
    name: "PG&E Generation Station",
    status: "Active",
    output: "45 MW",
    fuelType: "Renewable Mix",
    position: { x: 10, y: 50 },
    connections: ["component-2"]
  },
  {
    id: "component-2",
    type: "transmission",
    name: "High Voltage Line A",
    status: "Active",
    capacity: "100 MW",
    voltage: "500 kV",
    position: { x: 25, y: 50 },
    connections: ["component-3"]
  },
  {
    id: "component-3",
    type: "substation",
    name: "SF Mission substation",
    status: "Maintenance",
    capacity: "75 MW",
    voltage: "500kV/115kV",
    position: { x: 40, y: 50 },
    connections: ["component-4", "component-5"]
  },
  {
    id: "component-4",
    type: "distribution",
    name: "Distribution Line B",
    status: "Active",
    capacity: "15 MW",
    voltage: "115 kV",
    position: { x: 55, y: 40 },
    connections: ["component-6"]
  },
  {
    id: "component-5",
    type: "distribution",
    name: "Distribution Line C",
    status: "Active",
    capacity: "12 MW",
    voltage: "115 kV",
    position: { x: 55, y: 60 },
    connections: ["component-7"]
  },
  {
    id: "component-6",
    type: "transformer",
    name: "144",
    status: "Planned Maintenance",
    capacity: "1 MW",
    voltage: "115kV/11kV",
    position: { x: 70, y: 40 },
    connections: ["component-8"]
  },
  {
    id: "component-7",
    type: "transformer",
    name: "TRF-5432",
    status: "Active",
    capacity: "1 MW",
    voltage: "115kV/11kV",
    position: { x: 70, y: 60 },
    connections: []
  },
  {
    id: "component-8",
    type: "meter",
    name: "SGP-45678",
    status: "Active",
    rating: "200 A",
    voltage: "240 V",
    position: { x: 85, y: 40 },
    connections: []
  }
];
