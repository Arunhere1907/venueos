/**
 * VenueOS — Initial Mock Seed Data
 */

import {
  Venue,
  Session,
  Zone,
  Announcement,
  StaffMember,
  PollQuestion,
  AttendeeProfile,
  IssueReport,
  SOSRequest
} from '../types';

export const INITIAL_ZONES: Zone[] = [
  {
    id: 'zone-north',
    name: 'North Grand Atrium',
    description: 'Main keynote entrance, registration, primary information desk & VIP lounge.',
    crowdLevel: 'medium',
    updatedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    history: ['low', 'medium', 'medium'],
    trend: 'steady',
    predictedSurge: false,
    currentCount: 420,
    maxCapacity: 800,
    polygonPoints: '10,10 90,10 90,30 10,30',
  },
  {
    id: 'zone-east',
    name: 'East Expo Hall',
    description: 'Company exhibit booths, interactive hands-on demo pods, sponsor pavilions.',
    crowdLevel: 'high',
    updatedAt: new Date(Date.now() - 1 * 60000).toISOString(),
    history: ['medium', 'medium', 'high'],
    trend: 'rising',
    predictedSurge: true,
    currentCount: 880,
    maxCapacity: 950,
    polygonPoints: '55,35 95,35 95,75 55,75',
  },
  {
    id: 'zone-west',
    name: 'West Conference Wing',
    description: 'Breakout stages A & B, workshop rooms, technical speaker panel halls.',
    crowdLevel: 'medium',
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    history: ['low', 'medium', 'medium'],
    trend: 'steady',
    predictedSurge: false,
    currentCount: 310,
    maxCapacity: 600,
    polygonPoints: '5,35 45,35 45,75 5,75',
  },
  {
    id: 'zone-south',
    name: 'South Promenade & Food Plaza',
    description: 'Outdoor food truck garden, dining terrace, wellness lounge and south exit.',
    crowdLevel: 'low',
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    history: ['medium', 'low', 'low'],
    trend: 'falling',
    predictedSurge: false,
    currentCount: 195,
    maxCapacity: 750,
    polygonPoints: '10,80 90,80 90,95 10,95',
  }
];

export const INITIAL_VENUES: Venue[] = [
  // Stages
  {
    id: 'venue-main-stage',
    name: 'Main Keynote Amphitheater',
    type: 'stage',
    x: 25,
    y: 20,
    isAccessible: true,
    zoneId: 'zone-north',
    floor: 1,
    capacity: 1200,
    description: 'Flagship keynote stage with dual 4K LED arrays, hearing loop systems, and wheelchair-accessible front & rear seating.',
    features: ['Hearing Loop', 'Wheelchair Ramp', 'Live Captioning', 'Stage Lift'],
    checkInCount: 142
  },
  {
    id: 'venue-stage-b',
    name: 'Breakout Stage B (Innovators)',
    type: 'stage',
    x: 20,
    y: 52,
    isAccessible: true,
    zoneId: 'zone-west',
    floor: 1,
    capacity: 350,
    description: 'Intimate technical breakout theater specializing in AI architectures, devtools, and live coding demos.',
    features: ['Accessible Seating', 'Live Recording', 'Power Strips at Seats'],
    checkInCount: 89
  },
  {
    id: 'venue-stage-c',
    name: 'Workshop Lab C',
    type: 'stage',
    x: 35,
    y: 65,
    isAccessible: true,
    zoneId: 'zone-west',
    floor: 1,
    capacity: 150,
    description: 'Hands-on collaborative computer lab with adjustable standing desks and wide aisles.',
    features: ['Adjustable Desks', 'Braille Signage', 'High-Speed Ethernet'],
    checkInCount: 45
  },

  // Booths & Expo
  {
    id: 'venue-booth-ai',
    name: 'Gemini & AI Innovation Pavilion',
    type: 'booth',
    x: 75,
    y: 45,
    isAccessible: true,
    zoneId: 'zone-east',
    floor: 1,
    capacity: 200,
    description: 'Interactive playground showcasing frontier generative AI models, multimodal agent demos, and partner showcase.',
    features: ['Wide Walkway', 'Tactile Touchscreens', 'Interactive Demos'],
    checkInCount: 230
  },
  {
    id: 'venue-booth-cloud',
    name: 'Cloud & Infrastructure Showcase',
    type: 'booth',
    x: 65,
    y: 60,
    isAccessible: true,
    zoneId: 'zone-east',
    floor: 1,
    capacity: 180,
    description: 'Distributed systems, Kubernetes clusters, and low-latency edge architecture demonstrations.',
    features: ['Step-Free Access', 'Low Glare Displays'],
    checkInCount: 110
  },
  {
    id: 'venue-booth-startup',
    name: 'Startup Alley & Pitch Stage',
    type: 'booth',
    x: 85,
    y: 60,
    isAccessible: true,
    zoneId: 'zone-east',
    floor: 1,
    capacity: 150,
    description: '24 curated early-stage startups pitching live hourly, rapid investor networking lounge.',
    features: ['Ramp Access', 'High-Top & Low Tables'],
    checkInCount: 97
  },

  // Food & Dining
  {
    id: 'venue-food-garden',
    name: 'Artisan Food Plaza & Terrace',
    type: 'foodcourt',
    x: 40,
    y: 88,
    isAccessible: true,
    zoneId: 'zone-south',
    floor: 1,
    capacity: 450,
    description: 'Diverse culinary stalls: organic bowls, wood-fired pizza, allergen-friendly & halal certified vendors, barista coffee bars.',
    features: ['Wide Aisles', 'Braille Menus', 'Allergen Labels', 'Water Refill Stations'],
    checkInCount: 312
  },
  {
    id: 'venue-coffee-express',
    name: 'Central Espresso & Refresh Bar',
    type: 'foodcourt',
    x: 50,
    y: 22,
    isAccessible: true,
    zoneId: 'zone-north',
    floor: 1,
    capacity: 60,
    description: 'Quick grab-and-go specialty coffee, matcha, infused waters, and light bakery snacks.',
    features: ['Low Counter Option', 'Contactless Pay'],
    checkInCount: 174
  },

  // Restrooms
  {
    id: 'venue-restroom-north',
    name: 'North Restrooms (All-Gender & ADA)',
    type: 'restroom',
    x: 15,
    y: 15,
    isAccessible: true,
    zoneId: 'zone-north',
    floor: 1,
    capacity: 20,
    description: 'All-gender individual stalls, wheelchair-accessible family restroom, and adult changing table.',
    features: ['Automatic Doors', 'Emergency Call Pull', 'Changing Station'],
    checkInCount: 78
  },
  {
    id: 'venue-restroom-east',
    name: 'East Wing Restrooms & Care Room',
    type: 'restroom',
    x: 90,
    y: 40,
    isAccessible: true,
    zoneId: 'zone-east',
    floor: 1,
    capacity: 25,
    description: 'Accessible multi-stall restrooms, baby feeding & nursing station, and quiet sensory decompression cubicle.',
    features: ['ADA Compliant', 'Sensory Quiet Space', 'Touchless Fixtures'],
    checkInCount: 104
  },
  {
    id: 'venue-restroom-south',
    name: 'South Plaza Restrooms',
    type: 'restroom',
    x: 80,
    y: 88,
    isAccessible: true,
    zoneId: 'zone-south',
    floor: 1,
    capacity: 30,
    description: 'Spacious outdoor-accessible restrooms adjacent to the south patio and food pavilion.',
    features: ['Ramp Access', 'Drinking Fountains'],
    checkInCount: 62
  },

  // Emergency, Medical & Security
  {
    id: 'venue-first-aid-main',
    name: 'Primary Emergency Medical Station',
    type: 'firstaid',
    x: 70,
    y: 18,
    isAccessible: true,
    zoneId: 'zone-north',
    floor: 1,
    capacity: 15,
    description: 'Staffed 24/7 with emergency paramedics, AED defibrillators, oxygen supplies, and temperature-controlled medical storage.',
    features: ['Wheelchair Bay', 'Certified Paramedics', 'AED Unit', 'Direct Ambulance Bay'],
    checkInCount: 18
  },
  {
    id: 'venue-first-aid-south',
    name: 'South First Aid Post',
    type: 'firstaid',
    x: 20,
    y: 88,
    isAccessible: true,
    zoneId: 'zone-south',
    floor: 1,
    capacity: 8,
    description: 'Rapid triage point, hydration remedies, heat relief, and minor wound care.',
    features: ['AED Unit', 'First Aid Supplies'],
    checkInCount: 6
  },
  {
    id: 'venue-security-hq',
    name: 'Venue Operations & Security Control HQ',
    type: 'security',
    x: 82,
    y: 20,
    isAccessible: true,
    zoneId: 'zone-north',
    floor: 1,
    capacity: 20,
    description: 'Central security dispatch, radio monitoring, lost & found intake, and crowd safety coordination office.',
    features: ['24/7 Dispatch', 'Lost & Found Vault', 'Camera Hub'],
    checkInCount: 22
  },

  // Helpdesks
  {
    id: 'venue-helpdesk-central',
    name: 'Central Information & Accessibility Desk',
    type: 'helpdesk',
    x: 50,
    y: 15,
    isAccessible: true,
    zoneId: 'zone-north',
    floor: 1,
    capacity: 40,
    description: 'Main concierge desk: badge assistance, ASL interpreter booking, tactile maps distribution, and guide dog water bowls.',
    features: ['Tactile Maps', 'ASL Interpreters', 'Power Wheelchair Charging', 'Sighted Guides'],
    checkInCount: 180
  },
  {
    id: 'venue-helpdesk-expo',
    name: 'East Hall Info & Logistics Point',
    type: 'helpdesk',
    x: 60,
    y: 40,
    isAccessible: true,
    zoneId: 'zone-east',
    floor: 1,
    capacity: 20,
    description: 'Expo floor guidance, speaker greenroom sign-in, and attendee questions.',
    features: ['Multilingual Staff', 'Printed Schedules'],
    checkInCount: 67
  }
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'sess-01',
    title: 'Opening Keynote: Autonomous Agents & The Ambient Future',
    description: 'A deep dive into how multi-agent reasoning, spatial computing, and ambient computing interfaces are transforming how humans interface with digital ecosystems.',
    speaker: 'Dr. Elena Rostova',
    speakerRole: 'VP of AI Research, DeepMatrix',
    startTime: '2026-09-13T09:30:00.000Z',
    endTime: '2026-09-13T10:45:00.000Z',
    venueId: 'venue-main-stage',
    roomName: 'Main Keynote Amphitheater',
    tags: ['AI', 'Keynote', 'Agents', 'Future Tech'],
    capacity: 1200,
    isPopular: true
  },
  {
    id: 'sess-02',
    title: 'Universal Accessibility: Designing for Neurodiversity & Mobility',
    description: 'Hands-on architectural guidelines for physical and digital venues. Learn how high-contrast sensory design, tactile navigation, and low-latency assistive audio empower everyone.',
    speaker: 'Marcus Vance & Priya Nair',
    speakerRole: 'Head of Inclusive Design, OpenAccess Global',
    startTime: '2026-09-13T11:15:00.000Z',
    endTime: '2026-09-13T12:15:00.000Z',
    venueId: 'venue-stage-b',
    roomName: 'Breakout Stage B',
    tags: ['Accessibility', 'Inclusive Design', 'UX', 'Mobile'],
    capacity: 350,
    isPopular: true
  },
  {
    id: 'sess-03',
    title: 'Real-Time Edge Infrastructure & Distributed State Sync',
    description: 'Architecting sub-10ms distributed event buses, WebRTC peer meshes, and offline-first state synchronization for mission-critical venues and emergency coordination.',
    speaker: 'Siddharth Mehta',
    speakerRole: 'Principal Architect, EdgeCore Networks',
    startTime: '2026-09-13T11:30:00.000Z',
    endTime: '2026-09-13T12:30:00.000Z',
    venueId: 'venue-stage-c',
    roomName: 'Workshop Lab C',
    tags: ['Cloud', 'DevOps', 'Distributed Systems', 'Real-time'],
    capacity: 150
  },
  {
    id: 'sess-04',
    title: 'Frontier LLM Tool-Use & Safety Alignment in Production',
    description: 'Examining constrained decoding, structured output guarantees, agent tool sandboxing, and real-time red-teaming in enterprise deployments.',
    speaker: 'Sarah Jenkins',
    speakerRole: 'Director of AI Alignment, SynthLabs',
    startTime: '2026-09-13T13:30:00.000Z',
    endTime: '2026-09-13T14:45:00.000Z',
    venueId: 'venue-main-stage',
    roomName: 'Main Keynote Amphitheater',
    tags: ['AI', 'Safety', 'LLMs', 'Engineering'],
    capacity: 1200,
    isPopular: true
  },
  {
    id: 'sess-05',
    title: 'Next-Gen Robotics: Humanoid Locomotion & Spatial SLAM',
    description: 'Live hardware demonstration of quadruped and bipedal robotic platforms navigating complex crowd environments with dynamic obstacle rerouting.',
    speaker: 'Hiroshi Tanaka',
    speakerRole: 'Chief Scientist, Apex Dynamics',
    startTime: '2026-09-13T14:00:00.000Z',
    endTime: '2026-09-13T15:15:00.000Z',
    venueId: 'venue-stage-b',
    roomName: 'Breakout Stage B',
    tags: ['Robotics', 'Hardware', 'Spatial Computing', 'AI'],
    capacity: 350
  },
  {
    id: 'sess-06',
    title: 'Cybersecurity Threat Modeling for Hybrid Smart Venues',
    description: 'Securing IoT sensors, Wi-Fi tri-band triangulation, access badges, and critical infrastructure against physical and digital spoofing attacks.',
    speaker: 'Amina Al-Mansoor',
    speakerRole: 'Chief Information Security Officer, SecGuard',
    startTime: '2026-09-13T15:30:00.000Z',
    endTime: '2026-09-13T16:30:00.000Z',
    venueId: 'venue-stage-c',
    roomName: 'Workshop Lab C',
    tags: ['Security', 'IoT', 'Infrastructure'],
    capacity: 150
  },
  {
    id: 'sess-07',
    title: 'Startup Alley Live Pitch Final & Venture Awards',
    description: 'Ten standout early-stage startups compete in 3-minute lightning pitches before a panel of prominent angel syndicates and venture partners.',
    speaker: 'Moderated by Carlos Rivera',
    speakerRole: 'Managing Partner, Horizon Ventures',
    startTime: '2026-09-13T16:45:00.000Z',
    endTime: '2026-09-13T18:00:00.000Z',
    venueId: 'venue-booth-startup',
    roomName: 'Startup Alley Stage',
    tags: ['Startups', 'Venture', 'Pitch', 'Networking'],
    capacity: 250,
    isPopular: true
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Welcome to VenueOS — Event Doors Are Open!',
    body: 'Registration is flowing smoothly at North Grand Atrium. Tactile venue maps, hearing loops, and quiet room facilities are active.',
    severity: 'info',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: 'ann-02',
    title: 'High Foot-Traffic Advisory in East Expo Hall',
    body: 'The AI Innovation Pavilion is experiencing peak crowds. Please consider visiting West Conference Wing or South Promenade while lines ease.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    targetZoneId: 'zone-east'
  },
  {
    id: 'ann-03',
    title: 'Emergency Drill Completed Successfully',
    body: 'All emergency response teams, first-aid posts, and staff dispatch channels are operating at full readiness.',
    severity: 'info',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString()
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-01',
    name: 'Dr. Rachel Chen, EMT-P',
    role: 'medical',
    currentZoneId: 'zone-north',
    status: 'available',
    phone: '+1 (555) 019-2831'
  },
  {
    id: 'staff-02',
    name: 'Officer David Morales',
    role: 'security',
    currentZoneId: 'zone-east',
    status: 'available',
    phone: '+1 (555) 019-4822'
  },
  {
    id: 'staff-03',
    name: 'Taylor Brooks (Lead Paramedic)',
    role: 'medical',
    currentZoneId: 'zone-south',
    status: 'available',
    phone: '+1 (555) 019-9301'
  },
  {
    id: 'staff-04',
    name: 'Maya Lin (Accessibility Coordinator)',
    role: 'general',
    currentZoneId: 'zone-north',
    status: 'available',
    phone: '+1 (555) 019-3382'
  },
  {
    id: 'staff-05',
    name: 'Samir Patel (Security Supervisor)',
    role: 'security',
    currentZoneId: 'zone-west',
    status: 'available',
    phone: '+1 (555) 019-6619'
  }
];

export const INITIAL_POLLS: PollQuestion[] = [
  {
    id: 'poll-01',
    sessionId: 'sess-01',
    question: 'Which frontier technology do you anticipate having the most immediate impact in your industry by 2027?',
    options: [
      'Multi-modal autonomous agents',
      'Spatial computing & ambient UI',
      'Robotics & physical automation',
      'Local edge LLMs & small models'
    ],
    votes: [42, 19, 28, 35]
  },
  {
    id: 'poll-02',
    sessionId: 'sess-02',
    question: 'Does your current organization have an enforced accessibility guideline for internal/external events?',
    options: [
      'Yes, comprehensive standard',
      'Partial / basic compliance',
      'Currently developing one',
      'No formal standard yet'
    ],
    votes: [31, 54, 22, 11]
  }
];

export const INITIAL_ATTENDEE_PROFILE: AttendeeProfile = {
  id: 'attendee-alex',
  name: 'Alex Rivera',
  interests: ['AI', 'Accessibility', 'Robotics', 'Design'],
  favoritedSessionIds: ['sess-01', 'sess-02'],
  accessibilityMode: false,
  checkedInVenueIds: ['venue-helpdesk-central', 'venue-main-stage'],
  buddyCode: 'VOS-7821',
  connectedBuddy: {
    name: 'Jordan Smith',
    code: 'VOS-3199',
    location: { x: 70, y: 50 },
    lastSeen: '2 minutes ago'
  }
};

export const INITIAL_ISSUES: IssueReport[] = [
  {
    id: 'issue-01',
    type: 'spill',
    location: { x: 42, y: 86 },
    venueId: 'venue-food-garden',
    venueName: 'Artisan Food Plaza & Terrace',
    description: 'Iced drink spilled on the central dining floor walkway near table #14.',
    status: 'open',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    reporterName: 'Attendee (Mobile App)'
  },
  {
    id: 'issue-02',
    type: 'long_line',
    location: { x: 74, y: 44 },
    venueId: 'venue-booth-ai',
    venueName: 'Gemini & AI Innovation Pavilion',
    description: 'Line for hands-on multimodal demo pod has backed into the main hallway aisle.',
    status: 'in_progress',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    reporterName: 'Staff Marshall'
  }
];

export const INITIAL_SOS_REQUESTS: SOSRequest[] = [
  {
    id: 'sos-01',
    type: 'medical',
    location: { x: 68, y: 46 },
    venueId: 'venue-booth-ai',
    venueName: 'Gemini & AI Innovation Pavilion',
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    notes: 'Attendee experiencing lightheadedness and mild dehydration. First aid kit requested.',
    assignedStaffId: 'staff-01',
    assignedStaffName: 'Dr. Rachel Chen, EMT-P',
    reporterName: 'Attendee Alex R.'
  }
];
