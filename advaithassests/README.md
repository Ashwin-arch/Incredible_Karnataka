# Incredible Karnataka — Spatial Map Explorer (Next.js)

A full-featured Next.js spatial map application for exploring hidden gems, food spots, stays, shops and local picks across Karnataka.

## Features

- 🗺 Full-screen interactive Leaflet map
- 🔴 Karnataka state boundary outline (red border, no fill)
- 📍 55 seeded Karnataka locations across 10 districts
- 🔵 Dynamic marker clustering at all zoom levels
- 🎛 Category filters: Food, Stay, Shops, Hidden Gems, Local Picks
- 📋 Location detail bottom sheet with ratings, highlights & directions
- 🌐 Geolocation — centres map on user's position
- 🔍 Real-time search across name, description, tags
- 📊 District filter with fly-to
- ⭐ Rating slider filter
- 📡 REST API: `/api/locations`, `/api/locations/[id]`, `/api/districts`, `/api/nearby`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Map**: Leaflet.js + react-leaflet + leaflet.markercluster
- **Styling**: Tailwind CSS + inline styles
- **Language**: TypeScript
- **Fonts**: Playfair Display, Lora, JetBrains Mono

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Locations in bounding box with filters |
| GET | `/api/locations/[id]` | Single location detail |
| GET | `/api/districts` | All districts with counts |
| GET | `/api/nearby` | Locations within radius of a point |

### Query params for `/api/locations`

| Param | Type | Description |
|-------|------|-------------|
| `swLat`, `swLng`, `neLat`, `neLng` | float | Bounding box |
| `categories` | string (comma-separated) | food,stay,shops,gems,picks |
| `district` | string | Filter by district name |
| `minRating` | float | Minimum rating (0–5) |
| `q` | string | Full-text search |
| `limit` | int | Results per page (default 100) |
| `offset` | int | Pagination offset |

### Example API calls

```
GET /api/locations?swLat=11&swLng=74&neLat=18&neLng=78&categories=gems,picks&minRating=4.5

GET /api/nearby?lat=12.97&lng=77.59&radius=50&categories=food&limit=5

GET /api/districts
```

## Project Structure

```
karnataka-map/
├── app/
│   ├── layout.tsx          # Root layout with fonts & Leaflet CSS
│   ├── page.tsx            # Main page — map orchestrator
│   ├── globals.css         # Global styles & Leaflet overrides
│   └── api/
│       ├── locations/
│       │   ├── route.ts    # GET /api/locations (bbox + filters)
│       │   └── [id]/
│       │       └── route.ts # GET /api/locations/:id
│       ├── districts/
│       │   └── route.ts    # GET /api/districts
│       └── nearby/
│           └── route.ts    # GET /api/nearby
├── components/
│   ├── MapView.tsx         # Leaflet map with Karnataka border & clusters
│   ├── FilterPanel.tsx     # Sidebar filter panel
│   ├── BottomSheet.tsx     # Location detail sheet
│   └── Toast.tsx           # Toast notifications
└── lib/
    └── data.ts             # 55 locations seed data + types + KA boundary
```

## Keyboard Shortcuts

- `/` — Focus search input
- `Esc` — Close sheet / panel
