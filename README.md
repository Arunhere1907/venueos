# VenueOS

Smart Event Experience platform for accessible venue wayfinding, session discovery, real-time crowd coordination, emergency SOS response, and organizer operations.

![VenueOS](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

## Features

### Attendee Experience
- **Interactive venue map** with step-free accessible routing
- **Session discovery** with bookmarks and live polls
- **Crowd intelligence** with real-time density telemetry
- **Event passport** with check-in stamps and badges
- **AI concierge chat** for instant venue answers
- **Emergency SOS** with one-tap dispatch
- **Issue reporting** for spills, queues, and facility problems
- **Buddy finder** for sharing live location with friends
- **Universal accessibility mode** with high-contrast UI and speech synthesis

### Organizer Command Center
- Live SOS dispatch panel
- Issue reports triage queue
- Real-time broadcast announcements
- Venue and session CRUD management
- Session polling and analytics dashboard

## Getting Started

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type check |

## Navigation

The app uses hash-based routing:

| Route | View |
|-------|------|
| `#/map` | Venue wayfinding map |
| `#/schedule` | Session schedule |
| `#/crowd` | Crowd intelligence |
| `#/announcements` | Live alerts feed |
| `#/passport` | Event passport |
| `#/organizer` | Organizer dashboard |

Unknown routes display a themed 404 page.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Zustand (state management)
- Recharts (analytics)
- Lucide React (icons)

## Project Structure

```
src/
├── components/     # Shared UI (Button, Modal, Toast, ErrorBoundary)
├── features/       # Feature modules (map, schedule, SOS, organizer, etc.)
├── stores/         # Zustand state stores
├── lib/            # Utilities (routing, navigation, speech)
├── services/       # Mock realtime event simulation
└── data/           # Seed/mock data
```

## License

MIT
