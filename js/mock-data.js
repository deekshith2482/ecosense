/**
 * EcoSense Seed & Mock Incident Dataset
 * Geographic coordinates centered on Bangalore (BBMP Zones: East, West, South, Mahadevapura, Bommanahalli)
 */

// Embedded high-quality SVG data URIs for garbage and cleared spots
export const SAMPLE_IMAGES = {
  overflowing_dump: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
  plastic_pile: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
  construction_debris: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  roadside_litter: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=80",
  cleaned_street: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
  cleared_spot_2: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80"
};

export const INITIAL_INCIDENTS = [
  {
    id: "ECO-BLR-8921",
    zone: "red",
    zoneTitle: "🔴 Red Zone - Critical Hazard",
    ward: "Ward 112 - Domlur / Indiranagar",
    location: "100ft Road, Near Sony Signal Junction",
    society: "Indiranagar Central Society",
    lat: 12.9719,
    lng: 77.6412,
    reportedBy: "Priya Sharma",
    citizenAvatar: "PS",
    reportedAt: "25 mins ago",
    timestamp: Date.now() - 25 * 60 * 1000,
    status: "pending", // pending | assigned | in_progress | resolved
    slaHours: 4,
    slaDeadline: Date.now() + (4 * 60 - 25) * 60 * 1000,
    image: SAMPLE_IMAGES.overflowing_dump,
    resolvedImage: null,
    description: "Massive commercial waste overflow spilling onto the pedestrian footpath and choking storm drain.",
    aiAnalysis: {
      confidence: 96.4,
      volumeM3: 4.8,
      estimatedWeightKg: 620,
      dominantMaterial: "Organic & Mixed Plastics",
      composition: {
        plastic: 45,
        organic: 38,
        hazardous: 12,
        inert: 5
      },
      healthHazardScore: 9.2,
      detectedObjects: [
        { label: "Overflowing Bin (98%)", x: 15, y: 20, w: 40, h: 50, type: "red" },
        { label: "Biohazard / Rotten Food (94%)", x: 45, y: 40, w: 35, h: 40, type: "red" },
        { label: "Plastic Bulk (91%)", x: 20, y: 65, w: 60, h: 30, type: "orange" }
      ]
    },
    assignedCrew: null
  },
  {
    id: "ECO-BLR-8922",
    zone: "orange",
    zoneTitle: "🟠 Orange Zone - Moderate Accumulation",
    ward: "Ward 151 - Koramangala",
    location: "5th Block, 80 Feet Road Corner",
    society: "Green Glen Meadows Society",
    lat: 12.9352,
    lng: 77.6245,
    reportedBy: "Rahul Menon",
    citizenAvatar: "RM",
    reportedAt: "1 hour ago",
    timestamp: Date.now() - 60 * 60 * 1000,
    status: "assigned",
    slaHours: 12,
    slaDeadline: Date.now() + (12 * 60 - 60) * 60 * 1000,
    image: SAMPLE_IMAGES.plastic_pile,
    resolvedImage: null,
    description: "Unsegregated dry waste and packaging materials dumped behind residential park.",
    aiAnalysis: {
      confidence: 92.1,
      volumeM3: 2.1,
      estimatedWeightKg: 280,
      dominantMaterial: "Single-Use Plastics & Cardboard",
      composition: {
        plastic: 68,
        organic: 14,
        hazardous: 3,
        inert: 15
      },
      healthHazardScore: 6.4,
      detectedObjects: [
        { label: "Plastic Wrappers (95%)", x: 25, y: 30, w: 45, h: 40, type: "orange" },
        { label: "Cardboard Packaging (89%)", x: 60, y: 45, w: 30, h: 35, type: "yellow" }
      ]
    },
    assignedCrew: {
      unitName: "BBMP Auto Tipper #KA-01-EA-4219",
      leadOfficer: "S. Kumar",
      contact: "+91 98451 22910"
    }
  },
  {
    id: "ECO-BLR-8923",
    zone: "yellow",
    zoneTitle: "🟡 Yellow Zone - Minor Litter",
    ward: "Ward 174 - HSR Layout",
    location: "Sector 2, 19th Main Road",
    society: "Sobha Silicon Oasis Community",
    lat: 12.9121,
    lng: 77.6446,
    reportedBy: "Ananya Deshmukh",
    citizenAvatar: "AD",
    reportedAt: "2 hours ago",
    timestamp: Date.now() - 120 * 60 * 1000,
    status: "in_progress",
    slaHours: 24,
    slaDeadline: Date.now() + (24 * 60 - 120) * 60 * 1000,
    image: SAMPLE_IMAGES.roadside_litter,
    resolvedImage: null,
    description: "Beverage cans, disposable cups, and snack wrappers scattered around bus stop bench.",
    aiAnalysis: {
      confidence: 88.7,
      volumeM3: 0.6,
      estimatedWeightKg: 45,
      dominantMaterial: "Dry Recyclables",
      composition: {
        plastic: 52,
        organic: 8,
        hazardous: 0,
        inert: 40
      },
      healthHazardScore: 3.2,
      detectedObjects: [
        { label: "Beverage Cans (93%)", x: 30, y: 40, w: 25, h: 30, type: "yellow" },
        { label: "Paper Cups (85%)", x: 55, y: 50, w: 25, h: 25, type: "yellow" }
      ]
    },
    assignedCrew: {
      unitName: "Ward 174 Sanitation Squad #S-04",
      leadOfficer: "M. Ramesh",
      contact: "+91 94480 11983"
    }
  },
  {
    id: "ECO-BLR-8924",
    zone: "green",
    zoneTitle: "🟢 Resolved - Cleaned by BBMP",
    ward: "Ward 45 - Malleshwaram",
    location: "8th Cross, Margosa Road",
    society: "Sri Krishna Apartments Association",
    lat: 12.9982,
    lng: 77.5704,
    reportedBy: "Vikram Iyengar",
    citizenAvatar: "VI",
    reportedAt: "5 hours ago",
    timestamp: Date.now() - 300 * 60 * 1000,
    status: "resolved",
    slaHours: 4,
    resolvedAt: "1 hour ago",
    image: SAMPLE_IMAGES.construction_debris,
    resolvedImage: SAMPLE_IMAGES.cleaned_street,
    description: "Unauthorized dumping of construction debris and broken cement sacks.",
    aiAnalysis: {
      confidence: 94.8,
      volumeM3: 3.5,
      estimatedWeightKg: 890,
      dominantMaterial: "Construction & Demolition Debris",
      composition: {
        plastic: 10,
        organic: 5,
        hazardous: 5,
        inert: 80
      },
      healthHazardScore: 7.1,
      detectedObjects: [
        { label: "Rubble Debris (97%)", x: 20, y: 30, w: 55, h: 50, type: "orange" }
      ]
    },
    assignedCrew: {
      unitName: "BBMP Heavy Compactor Truck #KA-03-GB-8821",
      leadOfficer: "R. Jayaram",
      contact: "+91 98860 44321"
    },
    clearanceNotes: "Cleared using JCB loader and tipper. Sanitized with bleaching powder."
  },
  {
    id: "ECO-BLR-8925",
    zone: "red",
    zoneTitle: "🔴 Red Zone - Critical Hazard",
    ward: "Ward 84 - Whitefield",
    location: "ITPL Main Road, Near Hope Farm Circle",
    society: "Prestige Boulevard Residents",
    lat: 12.9863,
    lng: 77.7471,
    reportedBy: "Kavita Rao",
    citizenAvatar: "KR",
    reportedAt: "40 mins ago",
    timestamp: Date.now() - 40 * 60 * 1000,
    status: "pending",
    slaHours: 4,
    slaDeadline: Date.now() + (4 * 60 - 40) * 60 * 1000,
    image: SAMPLE_IMAGES.overflowing_dump,
    resolvedImage: null,
    description: "Open blackspot near school gate with animal scavenging and foul odor.",
    aiAnalysis: {
      confidence: 97.2,
      volumeM3: 5.2,
      estimatedWeightKg: 750,
      dominantMaterial: "Mixed Municipal Solid Waste",
      composition: {
        plastic: 42,
        organic: 46,
        hazardous: 8,
        inert: 4
      },
      healthHazardScore: 9.6,
      detectedObjects: [
        { label: "Rotten Garbage (99%)", x: 10, y: 15, w: 65, h: 65, type: "red" },
        { label: "Bio Waste (92%)", x: 50, y: 30, w: 35, h: 45, type: "red" }
      ]
    },
    assignedCrew: null
  }
];

export const BANGALORE_WARDS = [
  { id: "W-112", name: "Ward 112 - Domlur / Indiranagar", zone: "East", slaScore: 94 },
  { id: "W-151", name: "Ward 151 - Koramangala", zone: "South", slaScore: 91 },
  { id: "W-174", name: "Ward 174 - HSR Layout", zone: "Bommanahalli", slaScore: 96 },
  { id: "W-45", name: "Ward 45 - Malleshwaram", zone: "West", slaScore: 98 },
  { id: "W-84", name: "Ward 84 - Whitefield", zone: "Mahadevapura", slaScore: 86 },
  { id: "W-162", name: "Ward 162 - Jayanagar 4th Block", zone: "South", slaScore: 95 },
  { id: "W-133", name: "Ward 133 - Vijayanagar", zone: "West", slaScore: 90 },
  { id: "W-08", name: "Ward 08 - Yelahanka Satellite Town", zone: "Yelahanka", slaScore: 92 }
];

export const BBMP_FLEET_CREWS = [
  { id: "CREW-01", name: "Auto Tipper KA-01-EA-4219", type: "tipper", ward: "Ward 112", capacityKg: 1200, status: "Available" },
  { id: "CREW-02", name: "Compactor Truck KA-03-GB-8821", type: "compactor", ward: "Ward 84", capacityKg: 6000, status: "Available" },
  { id: "CREW-03", name: "Sanitation Squad W-151 Alpha", type: "manual", ward: "Ward 151", capacityKg: 500, status: "Available" },
  { id: "CREW-04", name: "Quick Response Tipper KA-04-TC-1092", type: "tipper", ward: "Ward 174", capacityKg: 1500, status: "Available" },
  { id: "CREW-05", name: "Heavy Loader & Gang JCB-09", type: "heavy", ward: "Ward 45", capacityKg: 8000, status: "Available" }
];
