# 🚌 Bharat Transit — Smart Mobility & Bus Tracking System

> **Hackathon:** CodeStorm  
> **Category:** Smart Mobility / Transportation Technology  
> **Campus & Regional Network:** Hi-Tech College of Engineering & Technology, Ghaziabad ⟷ Delhi NCR Corridors

---

## 📌 Project Overview

**Bharat Transit** is a modern, full-stack transit monitoring and passenger information system built to streamline public and institutional bus transit. Developed as a flagship prototype for **CodeStorm**, the platform unifies real-time vehicle telemetry, route navigation, stop-by-stop schedules, pilot/driver profiles, live service alerts, and inter-city journey planning into an intuitive, high-performance dark-themed dashboard.

For this deployment, Bharat Transit is configured with an 8-corridor regional network centered around **Hi-Tech College, Ghaziabad**, connecting students and commuters across **Delhi (Anand Vihar & Kashmere Gate), Noida (Sec 62 & Botanical Garden), Greater Noida (Pari Chowk), Hapur, Meerut, and Vaishali**.

---

## ✨ Key Features

- 🗺️ **Live Telemetry & Interactive Map:**
  - Real-time bus GPS tracking powered by Leaflet & OpenStreetMap.
  - Live speed, schedule status (On Time / Delayed), next stop ETA, and route progress bars.
  
- 🛣️ **8 Regional Corridors & 25 Fleet Buses:**
  - Dedicated routes covering major NCR arterial highways (NH-9, Delhi-Meerut Expressway, GT Road).
  - 25 active buses spanning Electric (EV), Express, Superfast, and State Transport services.

- 👨‍✈️ **Assigned Pilot / Driver Profiles:**
  - Every bus is mapped with complete driver credentials: **Driver Name, Verified Phone Number, Experience (Years), and UP Commercial Driving License Number**.
  - Direct calling integration on vehicle detail pages.

- ⚠️ **Service Disruption & Advisory Alerts:**
  - Dynamic severity tagging (Critical, Medium, Low) for road construction, traffic bottlenecks, and student exam special feeder announcements.

- 🧭 **Multi-Modal Journey Planner:**
  - Point-to-point trip lookup calculating total duration, distance, fares, transfers, and intermediate connection legs.

- ⚡ **Command Palette & Keyboard Navigation:**
  - Press `Ctrl + K` (or `Cmd + K`) to instantly search across any bus number, route, station, or city.

---

## 🏗️ Architecture & Directory Structure

```text
Bharat_Transit/
├── .gitignore                   # Root Git ignore rules (node_modules, builds, logs)
├── README.md                    # Project documentation & runbook
│
├── Backend/                     # Node.js + Express REST API Server
│   ├── .gitignore               # Backend-specific ignore rules
│   ├── index.js                 # Express server & API endpoints (Port 5000)
│   ├── data.js                  # Complete dataset (8 routes, 25 buses, drivers, stations)
│   ├── package.json             # Backend dependencies & npm scripts
│   └── package-lock.json
│
└── Frontend/                    # Modern React + TypeScript + Vite Application
    ├── .gitignore               # Frontend-specific ignore rules
    ├── index.html               # Entry HTML shell
    ├── vite.config.ts           # Vite build & bundler configuration
    ├── tsconfig.json            # TypeScript base configuration
    ├── package.json             # Frontend dependencies & npm scripts
    ├── public/                  # Static assets & icons
    └── src/
        ├── App.tsx              # Root routing & layout
        ├── main.tsx             # Pre-fetches backend APIs and mounts React
        ├── index.css            # Dark-theme design tokens & utilities
        ├── types/               # TypeScript interfaces (Bus, Route, Driver, etc.)
        │   └── index.ts
        ├── store/               # Zustand global state (live tracking & simulation)
        │   └── useTransitStore.ts
        ├── services/            # Transit service layer & data filtering
        │   └── transitService.ts
        ├── components/          # Reusable UI components
        │   ├── buses/           # BusCard, BusFilters
        │   ├── layout/          # Navbar, Footer, CommandMenu (Ctrl+K)
        │   ├── maps/            # TransitMap (Leaflet live map & markers)
        │   └── common/          # Badges, loaders, modal dialogs
        └── pages/               # Application views
            ├── HomePage.tsx     # Landing dashboard & quick stats
            ├── LiveMapPage.tsx  # Interactive full-screen telemetry map
            ├── BusesPage.tsx    # Filterable catalog of all 25 buses
            ├── BusDetailsPage.tsx # In-depth telemetry & Assigned Driver card
            ├── RoutesPage.tsx   # All 8 corridor route details & stops
            ├── RouteDetailsPage.tsx
            ├── StationsPage.tsx # Regional bus terminals & station hubs
            ├── JourneyPage.tsx  # Trip planner between NCR hubs
            └── AlertsPage.tsx   # Active road & transit advisories
```

---

## 📡 REST API Reference

The Backend runs on **`http://localhost:5000`** with CORS enabled:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/buses` | Returns all 25 active buses with live speed, status, and driver details |
| `GET` | `/api/routes` | Returns all 8 routes, coordinates (`pathCoordinates`), and intermediate stops |
| `GET` | `/api/stations` | Returns all station hubs with GPS coordinates and amenities |
| `GET` | `/api/operators` | Returns transit operators (RG Campus Fleet, UPSRTC, NueGo EV, DMRC Feeder) |
| `GET` | `/api/alerts` | Returns active transit advisories and delays |
| `GET` | `/api/journeys` | Returns pre-computed direct and multi-leg commuter journeys |
| `GET` | `/` | Health check endpoint |

---

## 🚀 Getting Started & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (comes with Node.js)

---

### Step 1: Start the Backend Server

Open a terminal window and navigate to the `Backend` directory:

```bash
cd Backend
npm install          # Install express, cors, nodemon (first time only)
npm start            # Starts server on http://localhost:5000 with auto-reload
```

You should see:
```text
Backend server is successfully running on http://localhost:5000
```

> **Quick Check:** Open `http://localhost:5000/api/buses` in your browser to verify that the 25 buses and driver records load as JSON.

---

### Step 2: Start the Frontend Application

Open a **separate** terminal window and navigate to the `Frontend` directory:

```bash
cd Frontend
npm install          # Install dependencies (first time only)
npm run dev          # Launch the Vite development server
```

You should see:
```text
  VITE v...  ready in ... ms

  ➜  Local:   http://localhost:5173/
```

Open **`http://localhost:5173`** in your browser.

---

## 🚌 Active Transit Corridors (Hi-Tech College Network)

1. **`HTC-R1-DEL`**: Hi-Tech College ⟷ Delhi Anand Vihar ISBT *(via NH-9 / Indirapuram)*
2. **`HTC-R2-NOI`**: Hi-Tech College ⟷ Noida Sector 62 & Botanical Garden
3. **`HTC-R3-HPR`**: Hi-Tech College ⟷ Hapur Central Bus Stand *(via Pilkhuwa)*
4. **`HTC-R4-DEL`**: Hi-Tech College ⟷ Delhi Kashmere Gate ISBT *(via Mohan Nagar & Shahdara)*
5. **`HTC-R5-GN`**: Hi-Tech College ⟷ Greater Noida Pari Chowk *(via Gaur City)*
6. **`HTC-R6-MRT`**: Hi-Tech College ⟷ Meerut Partapur Bypass *(via Modinagar)*
7. **`HTC-R7-VSH`**: Hi-Tech College ⟷ Vaishali Metro Direct Express Shuttle
8. **`HTC-R8-GZB`**: Hi-Tech College ⟷ Ghaziabad Old Bus Stand & Railway Station

---

## 🛠️ Technology Stack

- **Frontend:** React 18 / 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet, Zustand
- **Backend:** Node.js, Express.js, CORS, Nodemon
- **Telemetry Simulation:** Client-side interpolation engine with speed, progress, and status updates
- **Design:** Modern dark-themed design system optimized for transit dispatch centers and passenger mobile screens

---

## 🏆 Hackathon Submission Notes

- **Prototype Demonstration:** The frontend automatically connects to the local Express backend on startup (`main.tsx`), populating state with real route coordinates and live telemetry.
- **Offline Resilient:** If the backend is paused, fallback mock datasets ensure the user interface remains demonstrable during live pitches.
- **Scalability:** The modular schema supports seamless future integration with hardware GPS devices, IoT OBD-II trackers, and MQTT streams.
