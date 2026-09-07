# 🌤️ मौसम MAUSAM 3.0 — Personalized Weather Intelligence Portal
### Ministry of Earth Sciences (MoES) | India Meteorological Department (IMD)
**Theme**: Smart Automation | **Category**: Software | **Platform**: Web & Mobile Prototype (Firebase Ready)

---

## 🎯 Problem Statement Overview
Personalized homepage dashboard for the **'Mausam'** application addressing 8 specialized user personas with both **Real-time Live Telemetry** and **Curated Demo Edge-Cases**:

1. **Health-Conscious Users**: Air Quality Index (AQI gauge, PM2.5, PM10), pollen count (Tree, Grass, Weed), UV index with skin sensitivity recommendations, and asthma/allergy risk assessment.
2. **Outdoor Fitness Enthusiasts**: Solar golden hours (sunrise/sunset), hour-by-hour **"Best Running Hours"** suitability scores (0-100), wind drag resistance, and heatstroke alerts.
3. **Beachgoers & Surfers**: Coastal station radar, significant wave height, swell interval, water temperature, high/low tide timings, and INCOIS-style Beach Safety Flags (Green/Yellow/Red).
4. **Travelers**: Multi-city destination monitor, airport METAR/flight disruption risk index, and dynamic climate-based packing checklists (rain gear, thermals, sun protection).
5. **Parents & Families**: Morning school bus commute window (7:00–9:00 AM status), sudden rain alert countdowns, playground UV safety, and mosquito/humidity vector warnings.
6. **Agriculture & Gardeners**: Volumetric soil moisture at depths (0–7 cm), 7-day rainfall projections, ground frost threat alerts, and Gramin Krishi Mausam Sewa (GKMS) crop advisories.
7. **Commuters**: Optical roadway visibility (meters) with Dense Fog warnings, aquaplaning/underpass waterlogging alerts, and commute delay risk scores.
8. **Event Planners**: Biometeorological Outdoor Gathering Comfort Index (0–100), rain probability timelines, canopy wind gust limits, and 7-day optimal outdoor slot finders.

---

## 🚀 Key Technical Highlights
- **Smart Adaptive Automation**: System automatically scans current atmospheric hazards and recommends/prioritizes the most critical persona module (e.g., auto-elevating Health during severe smog or Beach safety during storm swells).
- **Dual Engine Architecture**:
  - **Live Mode**: Integrated with Open-Meteo Weather, Air Quality, Marine, and Indian City Geocoding APIs + browser GPS.
  - **Curated Demo Mode**: 6 real-world extreme edge scenarios (*Delhi Smog AQI 412, Mumbai Monsoon Red Alert, Goa Beach Rip Current, Punjab Crop Frost 2°C, Jaipur Loos Heatwave 44°C, Bengaluru Pleasant 24°C*).
- **Mobile Application Bezel Preview**: Interactive toggle allowing evaluators to preview the UI as a native mobile smartphone application (with Dynamic Island, status bar, and native mobile touch frame) or an expansive desktop web dashboard.
- **Bilingual Interface**: Seamless toggle between English and Hindi (हिन्दी).

---

## 🛠️ Local Development & Testing

```powershell
# 1. Install dependencies (if not already installed)
npm install

# 2. Start local Vite development server
npm run dev

# 3. Build optimized production assets
npm run build
```

---

## 🔥 Deploying to Firebase Hosting

This project comes pre-configured with `firebase.json` and `.firebaserc`.

```powershell
# 1. Login to your Firebase account
firebase login

# 2. (Optional) Associate with your existing Firebase project ID:
firebase use --add

# 3. Build and Deploy in one command:
npm run build
firebase deploy --only hosting
```

Your web application will be live at:
`https://<your-firebase-project-id>.web.app`
