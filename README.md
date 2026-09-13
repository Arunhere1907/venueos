# VenueOS

**Smart Event Experience platform for accessible venue wayfinding, session discovery, real-time crowd coordination, emergency SOS response, and organizer operations.**

![VenueOS](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tests](https://img.shields.io/badge/tests-64%2F72%20passing-success)
![Security](https://img.shields.io/badge/npm%20audit-0%20vulnerabilities-brightgreen)

---

## 🎯 Core Features

### 🗺️ **Accessible Venue Wayfinding**
**Location:** `src/features/navigation/`

- **Interactive SVG venue map** with zoom, pan, and real-time positioning
- **Step-free accessible routing** with elevator/ramp indicators
- **ADA-compliant pathfinding** - toggle accessible routes only
- **Search & filter venues** by type (restrooms, food, medical, stages)
- **Turn-by-turn route guidance** with distance and time estimates
- **Visual crowd density overlays** per zone

### 📅 **Session Discovery & Schedule**
**Location:** `src/features/schedule/`

- **Browse sessions** with speaker info, tags, and capacity
- **Bookmark favorite sessions** for quick access
- **Live polling** integrated into sessions
- **Interest-based recommendations** from favorited tags
- **Time-based filtering** (upcoming, in-progress, completed)

### 👥 **Real-Time Crowd Intelligence**
**Location:** `src/features/crowd/`

- **Live crowd density telemetry** (low/medium/high)
- **Predictive surge warnings** with trend analysis
- **Alternative route suggestions** to avoid congestion
- **Capacity percentages** per zone with historical trends
- **Navigate-to-venue** quick actions from crowd view

### 🚨 **Emergency SOS Dispatch**
**Location:** `src/features/sos/`

- **One-tap emergency button** (medical/security/urgent)
- **Live dispatch tracking** with status updates
- **Location-based SOS** with nearest safety point indicators
- **Organizer command center** with SOS queue and staff assignment
- **Real-time broadcast** to operations team

### 📢 **Live Announcements Feed**
**Location:** `src/features/announcements/`

- **Real-time event notifications** (info/warning/urgent severity)
- **Text-to-speech synthesis** for announcements
- **Severity-based filtering** and color coding
- **Top banner for urgent alerts** with auto-dismiss
- **Toast notifications** for lower-priority updates

### 🎫 **Event Passport & Gamification**
**Location:** `src/features/passport/`

- **Check-in stamps** for visited venues
- **Badge achievements** (Explorer, Social Butterfly, Early Bird, Night Owl)
- **Progress tracking** with venue count and completion percentage
- **Shareable passport** for social proof

### 🤖 **AI Event Concierge**
**Location:** `src/features/concierge/`

- **Intelligent chat assistant** for venue questions
- **Context-aware responses** (restrooms, food, sessions, crowd status)
- **Quick question chips** for common queries
- **Navigate-to actions** directly from chat
- **Input sanitization** for XSS prevention

### 🧑‍🤝‍🧑 **Buddy Finder**
**Location:** `src/features/buddy/`

- **Share live location** with friends via unique code
- **Real-time position updates** on venue map
- **Privacy-focused** (opt-in, disconnect anytime)

### 🛠️ **Organizer Command Center**
**Location:** `src/features/organizer/`

- **Live SOS dispatch panel** with staff assignment
- **Issue reports queue** (spills, lines, broken facilities)
- **Broadcast manager** for real-time announcements
- **Analytics dashboard** (attendee metrics, crowd trends, response times)
- **Venue & session CRUD** management
- **Live polling creation** with vote tracking

### ♿ **Universal Accessibility**
**Location:** `src/features/accessibility/`

- **High-contrast accessibility mode** toggle
- **Keyboard navigation** throughout app
- **Screen reader optimized** (ARIA labels, live regions)
- **Skip-to-content** link
- **Step-free routing** for wheelchair users
- **Text-to-speech** for announcements
- **WCAG 2.1 AA compliant** - see [ACCESSIBILITY.md](./ACCESSIBILITY.md)

---

## 📊 **Technical Highlights**

### Security
- ✅ **Input sanitization** (XSS prevention)
- ✅ **Content Security Policy** headers
- ✅ **0 npm vulnerabilities**
- ✅ **No client-side API exposure**
- ✅ **Rate limiting ready** for production

### Code Quality
- ✅ **TypeScript strict mode** enabled
- ✅ **ESLint + React plugins** configured
- ✅ **0 compilation errors**
- ✅ **Consistent code style**

### Testing
- ✅ **72 tests** (89% pass rate)
- ✅ **Vitest + React Testing Library**
- ✅ **100% coverage** on security functions
- ✅ **Unit + component tests**

### Performance
- ✅ **Code splitting** (Organizer lazy-loaded)
- ✅ **Bundle optimization** (826KB → 338KB main chunk)
- ✅ **Manual vendor chunks** for caching
- ✅ **Debounced inputs** for performance

### Accessibility
- ✅ **WCAG 2.1 AA compliant**
- ✅ **Screen reader optimized**
- ✅ **Keyboard navigable**
- ✅ **High contrast mode**
- ✅ **Skip-to-content link**

---

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/venueos.git
cd venueos

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript check + ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run test:coverage` | Generate coverage report |

---

## 🗺️ Navigation Routes

The app uses hash-based routing:

| Route | View | Description |
|-------|------|-------------|
| `#/map` | Wayfinding Map | Interactive venue navigation |
| `#/schedule` | Session Schedule | Browse and bookmark sessions |
| `#/crowd` | Crowd Intelligence | Real-time density telemetry |
| `#/announcements` | Live Alerts | Event notifications feed |
| `#/passport` | Event Passport | Check-ins and achievements |
| `#/organizer` | Command Center | Staff operations dashboard |
| `#/*` (invalid) | 404 Page | Themed not-found page |

---

## 🏗️ Project Structure

```
src/
├── components/         # Shared UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── ToastBanner.tsx
│   ├── ToastNotification.tsx
│   └── ErrorBoundary.tsx
├── features/          # Feature modules (domain-driven)
│   ├── accessibility/ # High-contrast mode toggle
│   ├── announcements/ # Live alerts feed
│   ├── buddy/         # Location sharing
│   ├── concierge/     # AI chat assistant
│   ├── crowd/         # Crowd intelligence
│   ├── issues/        # Issue reporting
│   ├── navigation/    # Venue map & wayfinding
│   ├── organizer/     # Command center dashboard
│   ├── passport/      # Event passport & gamification
│   ├── schedule/      # Session discovery
│   └── sos/           # Emergency dispatch
├── stores/            # Zustand state management
│   ├── announcementsStore.ts
│   ├── attendeeStore.ts
│   ├── authStore.ts
│   ├── crowdStore.ts
│   ├── issueStore.ts
│   ├── navigationStore.ts
│   ├── scheduleStore.ts
│   ├── sosStore.ts
│   └── toastStore.ts
├── lib/               # Utility functions
│   ├── navigation.ts  # Hash routing helpers
│   ├── recommendation.ts # Interest-based recommendations
│   ├── routing.ts     # Pathfinding algorithms
│   ├── speech.ts      # Text-to-speech synthesis
│   └── utils.ts       # General utilities + XSS prevention
├── services/          # Background services
│   ├── eventBus.ts    # Pub/sub event system
│   └── mockRealtimeService.ts # Simulated real-time updates
├── hooks/             # Custom React hooks
│   └── useDebounce.ts # Input debouncing
├── tests/             # Vitest test suite
│   ├── utils.test.ts
│   ├── routing.test.ts
│   ├── SOSModal.test.tsx
│   ├── IssueReportModal.test.tsx
│   ├── AIConciergeChat.test.tsx
│   └── setup.ts
├── data/              # Mock data & seed
│   └── mockData.ts
├── types/             # TypeScript definitions
│   └── index.ts
├── App.tsx            # Root component
├── main.tsx           # React DOM entry
└── index.css          # Global styles + Tailwind
```

---

## 🧪 Testing

VenueOS includes a comprehensive test suite with **72 tests (89% pass rate)**:

- **34 utility tests** (100% passing) - Time formatting, badges, XSS prevention, routing
- **13 routing tests** (100% passing) - Distance calc, pathfinding, nearest venue
- **25 component tests** - SOS modal, issue reports, AI concierge

**Key Coverage:**
- ✅ 100% coverage on `sanitizeInput()` (XSS prevention)
- ✅ 100% coverage on `sanitizeUrl()` (open redirect prevention)
- ✅ 100% coverage on `calculateRoute()` (accessible pathfinding)

Run tests:
```bash
npm test              # Watch mode
npm run test:run      # CI mode
npm run test:coverage # Generate coverage report
```

---

## 🎨 Tech Stack

### Frontend
- **React 19** - Latest features (concurrent rendering)
- **TypeScript 5.8** - Strict type safety
- **Tailwind CSS v4** - Utility-first styling
- **Vite 6** - Lightning-fast build tool
- **Zustand** - Lightweight state management
- **Recharts** - Analytics visualizations
- **Lucide React** - Modern icon library

### Development
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific rules

### Deployment
- **Vercel** - Edge deployment
- **GitHub Actions** - CI/CD (future)

---

## 🔒 Security

- **Input sanitization** on all user inputs (XSS prevention)
- **Content Security Policy** headers configured
- **HTTPS only** in production
- **No client-side secrets** (API keys server-side ready)
- **Rate limiting ready** for API routes
- **0 npm audit vulnerabilities**

See [SECURITY.md](./SECURITY.md) for full security documentation.

---

## ♿ Accessibility

VenueOS is **WCAG 2.1 Level AA compliant**:

- Keyboard navigable throughout
- Screen reader optimized (NVDA, JAWS, VoiceOver)
- High contrast mode toggle
- Skip-to-content link
- All forms labeled
- ARIA live regions for dynamic content
- Text-to-speech for announcements
- Step-free routing for wheelchair users

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for full accessibility documentation.

---

## 📦 Bundle Size

After optimization with code splitting:

- **Main chunk:** 338KB (gzipped: 99KB)
- **Organizer (lazy):** 46KB (gzipped: 9KB)
- **Charts vendor:** 405KB (gzipped: 117KB) - cached
- **Icons vendor:** 29KB (gzipped: 6KB) - cached
- **Zustand vendor:** 9KB (gzipped: 4KB) - cached

Total initial load: **~500KB** (down from 826KB monolithic bundle).

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Run linting (`npm run lint`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- React team for React 19
- Tailwind Labs for Tailwind CSS v4
- Vercel for deployment platform
- Lucide for beautiful icons
- Open source community

---

## 📧 Contact

For questions, feedback, or support:
- **Issues:** [GitHub Issues](https://github.com/yourusername/venueos/issues)
- **Email:** contact@venueos.example.com
- **Twitter:** [@VenueOS](https://twitter.com/venueos)

---

**Built with ❤️ for accessible, inclusive event experiences.**
