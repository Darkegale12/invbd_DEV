# DBT - Vector Disease Control

A real-time vector-borne disease risk assessment and operational guidance dashboard for Pune, India.

## Features

- **Interactive Risk Map** — Leaflet map showing 9 Pune zones color-coded by disease risk (High/Medium/Low)
- **Layer Controls** — Toggle 12 map layers: Risk, Temperature, Population, Cases, Traps, Water Index, Vegetation, Humidity, Breeding Sites, Larvae Density, Risk Score Grid
- **Hotspot Visualization** — 67 active hotspots rendered as circles with popup details
- **Zone Detail Panel** — Click any zone to see metrics, risk components (pie chart), drivers, recommendations, and hotspots
- **Map Center Control** — Jump to popular locations or enter custom lat/lng coordinates
- **Basemap Toggle** — Switch between Streets (OpenStreetMap) and Satellite (Esri) basemaps
- **Prevention Analytics Dashboard** — Full analytics with:
  - KPI card (cases, fogging ops, response time, sites eliminated)
  - Cases trend area chart (weekly)
  - Fogging operations bar chart by zone
  - Zone performance matrix table
  - Recent fogging operations table
  - Cases distribution pie chart
  - Trap efficiency horizontal bar chart
  - Budget utilization doughnut chart

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4**
- **Leaflet** (interactive maps)
- **Recharts** (data visualization)
- **Lucide React** (icons)

## Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── app/
│   ├── App.tsx                      # Root component, tab navigation
│   ├── components/
│   │   ├── RiskMap.tsx              # Leaflet map with zones & hotspots
│   │   ├── Dashboard.tsx            # Analytics dashboard with charts
│   │   ├── LayerControl.tsx         # Map layer toggles sidebar
│   │   ├── MapCenterControl.tsx     # Location jump controls
│   │   ├── BasemapToggle.tsx        # Streets/Satellite toggle
│   │   ├── ZoneDetailPanel.tsx      # Zone detail slide panel
│   │   ├── StatsWidget.tsx          # Header stats bar
│   │   └── ui/                      # shadcn/ui base components
│   ├── data/
│   │   ├── mock-zones.ts            # 9 Pune zone definitions
│   │   ├── mock-hotspots.ts         # 67 breeding site hotspots
│   │   ├── mock-dashboard-data.ts   # Fogging ops, cases trend, performance
│   │   └── mock-grid-data.ts        # 200m² grid layer generation
│   └── types/
│       └── map-types.ts             # TypeScript interfaces
├── styles/
│   ├── index.css                    # Entry CSS (imports all)
│   ├── tailwind.css                 # Tailwind v4 setup
│   ├── theme.css                    # CSS variables & theme
│   └── fonts.css                    # Font imports
└── main.tsx                         # React entry point
```

## Map Data

All zone boundaries use real Pune neighborhoods with approximate GPS coordinates. Hotspot data represents potential mosquito breeding sites (ponds, drainage, water tanks) near each zone.

Zone coverage: Shivajinagar, Koregaon Park, Kothrud, Deccan Gymkhana, Viman Nagar, Aundh, Hadapsar, Baner, MMCOE Hill (Lotus Pond area).
