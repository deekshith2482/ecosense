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
  // 1. East Zone
  { id: "W-112", name: "Ward 112 - Domlur / Indiranagar", zone: "East", slaScore: 94, lat: 12.9719, lng: 77.6412 },
  { id: "W-58", name: "Ward 58 - New Tippasandra", zone: "East", slaScore: 92, lat: 12.9735, lng: 77.6534 },
  { id: "W-59", name: "Ward 59 - CV Raman Nagar", zone: "East", slaScore: 93, lat: 12.9856, lng: 77.6641 },
  { id: "W-60", name: "Ward 60 - Kaggadasapura", zone: "East", slaScore: 89, lat: 12.9822, lng: 77.6789 },
  { id: "W-63", name: "Ward 63 - Kammanahalli", zone: "East", slaScore: 91, lat: 13.0094, lng: 77.6378 },
  { id: "W-80", name: "Ward 80 - Banaswadi", zone: "East", slaScore: 90, lat: 13.0142, lng: 77.6517 },
  { id: "W-88", name: "Ward 88 - Jeevanbhima Nagar", zone: "East", slaScore: 95, lat: 12.9663, lng: 77.6575 },
  { id: "W-89", name: "Ward 89 - Jogupalya", zone: "East", slaScore: 88, lat: 12.9739, lng: 77.6321 },
  { id: "W-90", name: "Ward 90 - Halasuru (Ulsoor)", zone: "East", slaScore: 92, lat: 12.9804, lng: 77.6256 },
  { id: "W-91", name: "Ward 91 - Bharathi Nagar", zone: "East", slaScore: 87, lat: 12.9881, lng: 77.6105 },
  { id: "W-92", name: "Ward 92 - Shivaji Nagar", zone: "East", slaScore: 86, lat: 12.9857, lng: 77.6059 },
  { id: "W-93", name: "Ward 93 - Vasanth Nagar", zone: "East", slaScore: 96, lat: 12.9912, lng: 77.5898 },
  { id: "W-110", name: "Ward 110 - Sampangiram Nagar", zone: "East", slaScore: 94, lat: 12.9687, lng: 77.5923 },
  { id: "W-111", name: "Ward 111 - Shantala Nagar (MG Road)", zone: "East", slaScore: 97, lat: 12.9716, lng: 77.6033 },
  { id: "W-113", name: "Ward 113 - Konena Agrahara", zone: "East", slaScore: 90, lat: 12.9568, lng: 77.6625 },
  { id: "W-117", name: "Ward 117 - Shanthi Nagar", zone: "East", slaScore: 93, lat: 12.9575, lng: 77.5986 },

  // 2. South Zone
  { id: "W-151", name: "Ward 151 - Koramangala", zone: "South", slaScore: 91, lat: 12.9352, lng: 77.6245 },
  { id: "W-142", name: "Ward 142 - Sunkenahalli", zone: "South", slaScore: 92, lat: 12.9463, lng: 77.5684 },
  { id: "W-143", name: "Ward 143 - VV Puram", zone: "South", slaScore: 95, lat: 12.9525, lng: 77.5768 },
  { id: "W-147", name: "Ward 147 - Adugodi", zone: "South", slaScore: 89, lat: 12.9431, lng: 77.6089 },
  { id: "W-152", name: "Ward 152 - S.G. Palya", zone: "South", slaScore: 88, lat: 12.9304, lng: 77.6082 },
  { id: "W-153", name: "Ward 153 - Jayanagar East", zone: "South", slaScore: 96, lat: 12.9298, lng: 77.5912 },
  { id: "W-154", name: "Ward 154 - Basavanagudi", zone: "South", slaScore: 97, lat: 12.9416, lng: 77.5739 },
  { id: "W-155", name: "Ward 155 - Hanumanth Nagar", zone: "South", slaScore: 94, lat: 12.9429, lng: 77.5592 },
  { id: "W-156", name: "Ward 156 - Srinagar", zone: "South", slaScore: 91, lat: 12.9374, lng: 77.5521 },
  { id: "W-162", name: "Ward 162 - Jayanagar 4th Block", zone: "South", slaScore: 98, lat: 12.9248, lng: 77.5843 },
  { id: "W-163", name: "Ward 163 - Pattabhirama Nagar", zone: "South", slaScore: 95, lat: 12.9212, lng: 77.5891 },
  { id: "W-164", name: "Ward 164 - Byrasandra", zone: "South", slaScore: 90, lat: 12.9276, lng: 77.5987 },
  { id: "W-165", name: "Ward 165 - Gurappanapalya", zone: "South", slaScore: 87, lat: 12.9215, lng: 77.6023 },
  { id: "W-166", name: "Ward 166 - Madivala", zone: "South", slaScore: 88, lat: 12.9219, lng: 77.6189 },
  { id: "W-167", name: "Ward 167 - Jakkasandra", zone: "South", slaScore: 92, lat: 12.9234, lng: 77.6321 },
  { id: "W-168", name: "Ward 168 - BTM Layout", zone: "South", slaScore: 93, lat: 12.9165, lng: 77.6101 },
  { id: "W-169", name: "Ward 169 - Banashankari Temple", zone: "South", slaScore: 94, lat: 12.9189, lng: 77.5732 },
  { id: "W-170", name: "Ward 170 - Kumaraswamy Layout", zone: "South", slaScore: 90, lat: 12.9056, lng: 77.5623 },
  { id: "W-171", name: "Ward 171 - Padmanabhanagar", zone: "South", slaScore: 96, lat: 12.9178, lng: 77.5567 },
  { id: "W-177", name: "Ward 177 - JP Nagar Phase 1-3", zone: "South", slaScore: 95, lat: 12.9102, lng: 77.5854 },
  { id: "W-178", name: "Ward 178 - Sarakki", zone: "South", slaScore: 93, lat: 12.9023, lng: 77.5789 },
  { id: "W-180", name: "Ward 180 - Yelachenahalli", zone: "South", slaScore: 89, lat: 12.8945, lng: 77.5712 },

  // 3. West Zone
  { id: "W-45", name: "Ward 45 - Malleshwaram", zone: "West", slaScore: 98, lat: 13.0031, lng: 77.5694 },
  { id: "W-65", name: "Ward 65 - Kadu Malleshwaram", zone: "West", slaScore: 97, lat: 13.0078, lng: 77.5712 },
  { id: "W-66", name: "Ward 66 - Subramanya Nagar", zone: "West", slaScore: 93, lat: 12.9989, lng: 77.5567 },
  { id: "W-67", name: "Ward 67 - Gayithri Nagar", zone: "West", slaScore: 91, lat: 12.9945, lng: 77.5623 },
  { id: "W-68", name: "Ward 68 - Rajajinagar 1st Block", zone: "West", slaScore: 96, lat: 12.9912, lng: 77.5534 },
  { id: "W-100", name: "Ward 100 - Basaveshwaranagar", zone: "West", slaScore: 95, lat: 12.9878, lng: 77.5398 },
  { id: "W-101", name: "Ward 101 - Kamakshipalya", zone: "West", slaScore: 89, lat: 12.9834, lng: 77.5276 },
  { id: "W-107", name: "Ward 107 - Shivanagar", zone: "West", slaScore: 92, lat: 12.9798, lng: 77.5512 },
  { id: "W-120", name: "Ward 120 - Cottonpete", zone: "West", slaScore: 87, lat: 12.9689, lng: 77.5712 },
  { id: "W-121", name: "Ward 121 - Chickpete", zone: "West", slaScore: 88, lat: 12.9712, lng: 77.5778 },
  { id: "W-132", name: "Ward 132 - Attiguppe", zone: "West", slaScore: 94, lat: 12.9612, lng: 77.5321 },
  { id: "W-133", name: "Ward 133 - Vijayanagar", zone: "West", slaScore: 95, lat: 12.9678, lng: 77.5412 },
  { id: "W-134", name: "Ward 134 - Bapuji Nagar", zone: "West", slaScore: 89, lat: 12.9556, lng: 77.5423 },

  // 4. Mahadevapura Zone
  { id: "W-84", name: "Ward 84 - Whitefield", zone: "Mahadevapura", slaScore: 86, lat: 12.9698, lng: 77.7499 },
  { id: "W-51", name: "Ward 51 - K.R. Puram", zone: "Mahadevapura", slaScore: 88, lat: 13.0078, lng: 77.6956 },
  { id: "W-54", name: "Ward 54 - Hoodi", zone: "Mahadevapura", slaScore: 89, lat: 12.9912, lng: 77.7167 },
  { id: "W-81", name: "Ward 81 - Vijnana Nagar", zone: "Mahadevapura", slaScore: 91, lat: 12.9812, lng: 77.6745 },
  { id: "W-82", name: "Ward 82 - Garudacharpalya", zone: "Mahadevapura", slaScore: 87, lat: 12.9845, lng: 77.7089 },
  { id: "W-83", name: "Ward 83 - Kadugodi", zone: "Mahadevapura", slaScore: 85, lat: 12.9989, lng: 77.7612 },
  { id: "W-85", name: "Ward 85 - Doddanekkundi", zone: "Mahadevapura", slaScore: 90, lat: 12.9689, lng: 77.7012 },
  { id: "W-86", name: "Ward 86 - Marathahalli", zone: "Mahadevapura", slaScore: 89, lat: 12.9567, lng: 77.7011 },
  { id: "W-87", name: "Ward 87 - HAL Airport Road", zone: "Mahadevapura", slaScore: 94, lat: 12.9589, lng: 77.6789 },
  { id: "W-149", name: "Ward 149 - Varthur", zone: "Mahadevapura", slaScore: 84, lat: 12.9389, lng: 77.7412 },
  { id: "W-150", name: "Ward 150 - Bellandur", zone: "Mahadevapura", slaScore: 86, lat: 12.9265, lng: 77.6762 },

  // 5. Bommanahalli Zone
  { id: "W-174", name: "Ward 174 - HSR Layout", zone: "Bommanahalli", slaScore: 96, lat: 12.9121, lng: 77.6446 },
  { id: "W-175", name: "Ward 175 - Bommanahalli", zone: "Bommanahalli", slaScore: 89, lat: 12.9034, lng: 77.6256 },
  { id: "W-176", name: "Ward 176 - BTM 4th Stage / Bilekahalli", zone: "Bommanahalli", slaScore: 91, lat: 12.8989, lng: 77.6089 },
  { id: "W-187", name: "Ward 187 - Puttenahalli", zone: "Bommanahalli", slaScore: 93, lat: 12.8912, lng: 77.5856 },
  { id: "W-189", name: "Ward 189 - Hongasandra", zone: "Bommanahalli", slaScore: 88, lat: 12.8967, lng: 77.6289 },
  { id: "W-190", name: "Ward 190 - Mangammanapalya", zone: "Bommanahalli", slaScore: 87, lat: 12.9078, lng: 77.6412 },
  { id: "W-191", name: "Ward 191 - Singasandra (Electronic City)", zone: "Bommanahalli", slaScore: 89, lat: 12.8812, lng: 77.6534 },
  { id: "W-192", name: "Ward 192 - Begur", zone: "Bommanahalli", slaScore: 86, lat: 12.8756, lng: 77.6289 },
  { id: "W-193", name: "Ward 193 - Arakere (Bannerghatta Rd)", zone: "Bommanahalli", slaScore: 92, lat: 12.8878, lng: 77.5978 },
  { id: "W-194", name: "Ward 194 - Gottigere", zone: "Bommanahalli", slaScore: 88, lat: 12.8612, lng: 77.5889 },
  { id: "W-196", name: "Ward 196 - Anjanapura", zone: "Bommanahalli", slaScore: 87, lat: 12.8534, lng: 77.5678 },

  // 6. Yelahanka Zone
  { id: "W-01", name: "Ward 01 - Kempegowda Ward", zone: "Yelahanka", slaScore: 91, lat: 13.1156, lng: 77.5894 },
  { id: "W-02", name: "Ward 02 - Chowdeshwari Ward", zone: "Yelahanka", slaScore: 90, lat: 13.1078, lng: 77.5945 },
  { id: "W-03", name: "Ward 03 - Atturu", zone: "Yelahanka", slaScore: 89, lat: 13.1012, lng: 77.5678 },
  { id: "W-04", name: "Ward 04 - Yelahanka Satellite Town", zone: "Yelahanka", slaScore: 94, lat: 13.0989, lng: 77.5978 },
  { id: "W-05", name: "Ward 05 - Jakkur", zone: "Yelahanka", slaScore: 93, lat: 13.0789, lng: 77.6105 },
  { id: "W-06", name: "Ward 06 - Thanisandra", zone: "Yelahanka", slaScore: 90, lat: 13.0567, lng: 77.6321 },
  { id: "W-07", name: "Ward 07 - Byatarayanapura", zone: "Yelahanka", slaScore: 92, lat: 13.0612, lng: 77.5912 },
  { id: "W-08", name: "Ward 08 - Kodigehalli", zone: "Yelahanka", slaScore: 91, lat: 13.0534, lng: 77.5789 },
  { id: "W-09", name: "Ward 09 - Vidyaranyapura", zone: "Yelahanka", slaScore: 95, lat: 13.0789, lng: 77.5567 },
  { id: "W-10", name: "Ward 10 - Doddabommasandra", zone: "Yelahanka", slaScore: 91, lat: 13.0623, lng: 77.5589 },

  // 7. RR Nagar (Rajarajeshwari Nagar) Zone
  { id: "W-39", name: "Ward 39 - Yeshwanthpur", zone: "RR Nagar", slaScore: 92, lat: 13.0234, lng: 77.5489 },
  { id: "W-40", name: "Ward 40 - Kengeri", zone: "RR Nagar", slaScore: 90, lat: 12.9123, lng: 77.4856 },
  { id: "W-41", name: "Ward 41 - Rajarajeshwari Nagar", zone: "RR Nagar", slaScore: 95, lat: 12.9234, lng: 77.5212 },
  { id: "W-42", name: "Ward 42 - Lakshmidevi Nagar", zone: "RR Nagar", slaScore: 89, lat: 13.0189, lng: 77.5278 },
  { id: "W-43", name: "Ward 43 - Kottigepalya", zone: "RR Nagar", slaScore: 91, lat: 12.9812, lng: 77.5098 },
  { id: "W-129", name: "Ward 129 - Jnana Bharathi (Bangalore Univ)", zone: "RR Nagar", slaScore: 94, lat: 12.9456, lng: 77.5012 },
  { id: "W-130", name: "Ward 130 - Ullal", zone: "RR Nagar", slaScore: 88, lat: 12.9512, lng: 77.4878 },
  { id: "W-131", name: "Ward 131 - Nayandahalli", zone: "RR Nagar", slaScore: 90, lat: 12.9412, lng: 77.5245 },
  { id: "W-160", name: "Ward 160 - Kengeri Satellite Town", zone: "RR Nagar", slaScore: 91, lat: 12.8989, lng: 77.4789 },

  // 8. Dasarahalli Zone
  { id: "W-12", name: "Ward 12 - Shettihalli", zone: "Dasarahalli", slaScore: 89, lat: 13.0456, lng: 77.5212 },
  { id: "W-13", name: "Ward 13 - Mallasandra", zone: "Dasarahalli", slaScore: 88, lat: 13.0412, lng: 77.5089 },
  { id: "W-14", name: "Ward 14 - Bagalagunte", zone: "Dasarahalli", slaScore: 90, lat: 13.0512, lng: 77.4989 },
  { id: "W-15", name: "Ward 15 - T. Dasarahalli", zone: "Dasarahalli", slaScore: 91, lat: 13.0389, lng: 77.5145 },
  { id: "W-35", name: "Ward 35 - Peenya Industrial Area", zone: "Dasarahalli", slaScore: 87, lat: 13.0289, lng: 77.5189 },
  { id: "W-36", name: "Ward 36 - Chokkasandra", zone: "Dasarahalli", slaScore: 89, lat: 13.0312, lng: 77.5012 },
  { id: "W-37", name: "Ward 37 - Hegganahalli", zone: "Dasarahalli", slaScore: 86, lat: 12.9978, lng: 77.5034 }
];

export const BBMP_FLEET_CREWS = [
  { id: "CREW-01", name: "Auto Tipper KA-01-EA-4219", type: "tipper", ward: "Ward 112", capacityKg: 1200, status: "Available" },
  { id: "CREW-02", name: "Compactor Truck KA-03-GB-8821", type: "compactor", ward: "Ward 84", capacityKg: 6000, status: "Available" },
  { id: "CREW-03", name: "Sanitation Squad W-151 Alpha", type: "manual", ward: "Ward 151", capacityKg: 500, status: "Available" },
  { id: "CREW-04", name: "Quick Response Tipper KA-04-TC-1092", type: "tipper", ward: "Ward 174", capacityKg: 1500, status: "Available" },
  { id: "CREW-05", name: "Heavy Loader & Gang JCB-09", type: "heavy", ward: "Ward 45", capacityKg: 8000, status: "Available" }
];
