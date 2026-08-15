# 🌱 EcoSense - AI-Powered Citizen Waste Reporting & BBMP Action Platform

![EcoSense Banner](https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80)

An intelligent, community-driven civic platform connecting citizens and the **Bruhat Bengaluru Mahanagara Palike (BBMP)** municipal authority. Citizens snap and upload photos of garbage accumulations in their societies; an AI Vision engine scans the waste, estimates volume/composition, and classifies incidents into **Red, Orange, and Yellow zones**. The BBMP portal receives real-time alerts, coordinates auto-tipper dispatches, and verifies cleanup with before/after photos.

---

## 🌟 Key Features

### 📸 1. Citizen Reporting Portal (`citizen.html`)
- **Camera & Image Upload**: Capture or drag-and-drop garbage photos with automatic GPS geotagging.
- **AI Vision Scanning Simulation**:
  - Laser scanner animation.
  - Multi-class waste object detection bounding boxes (Plastics, Wet/Organic, Biohazard, Construction Debris).
  - Material breakdown bars and volume estimation ($m^3$ & kg).
  - Automated Zone Categorization:
    - 🔴 **Red Zone (Critical Biohazard / Overflow)** $\to$ SLA: `< 4 Hours`
    - 🟠 **Orange Zone (Moderate Pile / Debris)** $\to$ SLA: `< 12 Hours`
    - 🟡 **Yellow Zone (Minor Scattered Litter)** $\to$ SLA: `< 24 Hours`
- **EcoPoints & Gamification**: Earn **+50 EcoPoints** per report with citizen rank badges.
- **Live Resolution Tracker**: 4-stage tracking timeline (*Reported* $\to$ *AI Verified* $\to$ *Dispatched* $\to$ *Cleaned*).

### 🏛️ 2. BBMP Municipal Authority War Room (`bbmp.html`)
- **Operations Command Bar**: Live counters for Red Hotspots, Orange Piles, Yellow Litter, and Cleared Tonnage in Metric Tonnes (MT).
- **Incident Triage Queue**: Filter by Severity Zone or Ward.
- **Fleet Dispatcher**: Assign Auto-Tippers, Compactor Trucks, or Sanitation Squads.
- **Proof-of-Clearance Verification**: Upload cleaned "After" photos and chemical treatment notes to close tickets.

### 🗺️ 3. Live Interactive Google Maps Integration
- **Google Maps JavaScript API**: Real-time road map, satellite, and hybrid layers.
- **Auto Geolocation**: Automatic user location detection with a live pulsing eco-marker.
- **Click-to-Pick Coordinates**: Click anywhere on the map to extract precise Latitude & Longitude into the reporting form.
- **Severity Pins**: Custom color-coded zone pins with rich interactive InfoWindows for each incident.

### 📊 4. Ward Analytics & ESG Dashboard
- Chart.js visualizations for Ward-wise garbage density, city-wide material composition, and 94.8% SLA compliance tracking.

---

## 🗺️ Google Maps API Key Configuration

To use your live Google Maps API key without exposing it to source control:

1. **Enable Google Cloud APIs**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Enable the following APIs for your project:
     - **Maps JavaScript API**
     - **Places API** (Optional, for autocomplete search)
     - **Geolocation API** (For GPS location detection)
2. **Configure Your API Key**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Set your key:
     ```env
     GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere
     VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere
     ```
   - Or set it in your browser runtime via console/localStorage:
     ```javascript
     EcoSenseMapsConfig.setApiKey("AIzaSyYourActualKeyHere");
     ```

*(Note: `.env` is listed in `.gitignore` to ensure secret keys are never committed to GitHub).*

---

## 🚀 Quick Start (Running Locally)

### Option 1: Using PowerShell (Built-in Zero Dependency)
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

### Option 2: Using Node / npx
```bash
npx serve .
```

### Option 3: Using Python
```bash
python -m http.server 8080
```

---

## 📁 Project Structure

```
ecosense/
├── index.html          # All-in-one unified portal with role switcher
├── citizen.html        # Dedicated Citizen Reporting Portal
├── bbmp.html           # Dedicated BBMP Municipal War Room
├── login-citizen.html  # Citizen authentication portal
├── login-bbmp.html     # BBMP official authentication portal
├── login.html          # Unified login gateway
├── .env.example        # Environment variable template for Google Maps key
├── serve.ps1           # Built-in PowerShell HTTP server
├── styles/
│   └── main.css        # Lush botanical eco-green design system
└── js/
    ├── app.js          # App orchestrator & cross-tab real-time sync
    ├── ai-engine.js    # AI Vision object detection & zone scoring engine
    ├── maps-config.js  # Secure Google Maps API key & runtime loader
    ├── map-renderer.js # Live Google Maps JavaScript API renderer
    ├── supabase-service.js # Supabase PostgreSQL cloud backend
    ├── citizen-portal.js # Citizen photo upload & timeline logic
    ├── bbmp-portal.js  # BBMP triage & fleet dispatch logic
    ├── analytics.js    # Chart.js visualizations & ESG metrics
    └── mock-data.js    # Bangalore wards & sample incident dataset
```

---

## 🌿 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Botanical Emerald & Sage Design Tokens)
- **Cloud Backend**: Supabase PostgreSQL Real-time Database
- **GIS Mapping**: Google Maps JavaScript API (Satellite, Road, Hybrid, Geolocation)
- **Visualizations**: Chart.js 4.4
- **State Management**: LocalStorage & Supabase Real-time Channel
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*)

---

## 📄 License
MIT License. Built for smart, clean, and sustainable cities.
