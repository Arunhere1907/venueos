/**
 * VenueOS — Interactive SVG Venue Map & Wayfinding Engine
 * Features realistic architectural zones, pins, step-free routes, and live crowd status.
 */
import React, { useState, memo } from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { useAttendeeStore } from '../../stores/attendeeStore';
import { getVenueTypeInfo, getCrowdBadge } from '../../lib/utils';
import {
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Users,
  Compass,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const VenueMap: React.FC = () => {
  const {
    venues,
    selectedVenueId,
    selectVenue,
    userLocation,
    setUserLocation,
    activeRoute,
    typeFilter,
    accessibleOnly
  } = useNavigationStore();

  const { zones } = useCrowdStore();
  const { profile } = useAttendeeStore();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isRelocatingUser, setIsRelocatingUser] = useState<boolean>(false);

  // Filter venues based on user choices
  const filteredVenues = venues.filter((v) => {
    if (typeFilter !== 'all' && v.type !== typeFilter) return false;
    if (accessibleOnly && !v.isAccessible) return false;
    return true;
  });

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  // Zoom helpers
  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.8, Math.min(2.5, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Click on map to set user position (if in reposition mode)
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isRelocatingUser) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    setUserLocation({
      x: Math.round(Math.max(5, Math.min(95, clickX))),
      y: Math.round(Math.max(5, Math.min(95, clickY)))
    });
    setIsRelocatingUser(false);
  };

  // SVG route path string
  const routePathD = activeRoute && activeRoute.points.length > 1
    ? activeRoute.points.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '')
    : '';

  return (
    <div className="relative w-full h-[400px] sm:h-[520px] lg:h-[620px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl select-none">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setIsRelocatingUser(!isRelocatingUser)}
          className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
            isRelocatingUser
              ? 'bg-amber-500 text-white ring-2 ring-amber-400/50 animate-pulse'
              : 'bg-slate-800/95 hover:bg-slate-700 text-slate-100 border border-slate-700'
          }`}
          title="Click anywhere on the map to place your starting pin"
        >
          <Navigation className="w-4 h-4" />
          {isRelocatingUser ? 'Click Map to Place Pin' : 'Relocate Start Pin'}
        </button>

        {/* Accessibility Status indicator */}
        {accessibleOnly && (
          <span className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Step-Free Routing Active
          </span>
        )}

        {/* Connected Buddy Indicator */}
        {profile.connectedBuddy && (
          <span className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
            <UserCheck className="w-4 h-4" />
            Buddy on Map: {profile.connectedBuddy.name}
          </span>
        )}
      </div>

      {/* Zoom / Navigation Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-slate-800/95 backdrop-blur-sm p-1 rounded-lg border border-slate-700 shadow-sm">
        <button
          onClick={() => handleZoom(0.2)}
          aria-label="Zoom in"
          className="p-2 text-slate-200 hover:text-white hover:bg-slate-700 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          aria-label="Zoom out"
          className="p-2 text-slate-200 hover:text-white hover:bg-slate-700 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          aria-label="Reset map perspective"
          className="p-2 text-slate-200 hover:text-white hover:bg-slate-700 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="font-medium">Low Density</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="font-medium">Medium Density</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="font-medium">High Density</span>
        </div>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-indigo-400" />
          <span className="font-medium">Concourse Route</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full h-full flex items-center justify-center cursor-crosshair overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transition-transform duration-200 origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
          onClick={handleMapClick}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="venue-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
            </pattern>

            {/* Radial glow for selected venue */}
            <radialGradient id="pulse-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>

            {/* Route glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Floorplate */}
          <rect x="0" y="0" width="100" height="100" fill="#0f172a" />
          <rect x="0" y="0" width="100" height="100" fill="url(#venue-grid)" />

          {/* Architectural Zones */}
          {/* North Atrium */}
          <g>
            <rect
              x="8"
              y="8"
              width="84"
              height="22"
              rx="3"
              fill="#1e293b"
              fillOpacity="0.8"
              stroke="#334155"
              strokeWidth="0.5"
            />
            <text x="12" y="14" fill="#94a3b8" fontSize="2.8" fontWeight="600" letterSpacing="0.2">
              NORTH GRAND ATRIUM & MAIN LOBBY
            </text>
          </g>

          {/* West Conference Wing */}
          <g>
            <rect
              x="8"
              y="33"
              width="38"
              height="42"
              rx="3"
              fill="#1e293b"
              fillOpacity="0.8"
              stroke="#334155"
              strokeWidth="0.5"
            />
            <text x="12" y="38" fill="#94a3b8" fontSize="2.5" fontWeight="600">
              WEST CONFERENCE WING
            </text>
          </g>

          {/* Central Concourse Corridor */}
          <rect
            x="48"
            y="30"
            width="4"
            height="48"
            fill="#334155"
            fillOpacity="0.3"
            rx="1"
          />

          {/* East Expo Hall */}
          <g>
            <rect
              x="54"
              y="33"
              width="38"
              height="42"
              rx="3"
              fill="#1e293b"
              fillOpacity="0.8"
              stroke="#334155"
              strokeWidth="0.5"
            />
            <text x="58" y="38" fill="#94a3b8" fontSize="2.5" fontWeight="600">
              EAST EXPO & INNOVATION HALL
            </text>
          </g>

          {/* South Promenade */}
          <g>
            <rect
              x="8"
              y="78"
              width="84"
              height="16"
              rx="3"
              fill="#1e293b"
              fillOpacity="0.8"
              stroke="#334155"
              strokeWidth="0.5"
            />
            <text x="12" y="83" fill="#94a3b8" fontSize="2.5" fontWeight="600">
              SOUTH PROMENADE & OUTDOOR DINING
            </text>
          </g>

          {/* Zone Crowd Overlays with color tint */}
          {zones.map((zone) => {
            let overlayColor = 'rgba(16, 185, 129, 0.12)';
            let borderColor = '#10b981';
            if (zone.crowdLevel === 'medium') {
              overlayColor = 'rgba(245, 158, 11, 0.12)';
              borderColor = '#f59e0b';
            } else if (zone.crowdLevel === 'high') {
              overlayColor = 'rgba(239, 68, 68, 0.18)';
              borderColor = '#ef4444';
            }

            let rx = 8;
            let ry = 8;
            let rw = 84;
            let rh = 22;
            let badgeX = 84;
            let badgeY = 14;

            if (zone.id === 'zone-west') {
              rx = 8;
              ry = 33;
              rw = 38;
              rh = 42;
              badgeX = 40;
              badgeY = 38;
            } else if (zone.id === 'zone-east') {
              rx = 54;
              ry = 33;
              rw = 38;
              rh = 42;
              badgeX = 86;
              badgeY = 38;
            } else if (zone.id === 'zone-south') {
              rx = 8;
              ry = 78;
              rw = 84;
              rh = 16;
              badgeX = 84;
              badgeY = 83;
            }

            return (
              <g key={zone.id}>
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  rx="3"
                  fill={overlayColor}
                  stroke={borderColor}
                  strokeWidth="0.6"
                  strokeDasharray={zone.predictedSurge ? '2,2' : undefined}
                />
                {/* Capacity badge */}
                <circle cx={badgeX} cy={badgeY} r="1.8" fill={borderColor} />
                <text x={badgeX - 16} y={badgeY + 0.8} fill="#cbd5e1" fontSize="2" fontWeight="500">
                  {zone.crowdLevel.toUpperCase()} ({Math.round((zone.currentCount / zone.maxCapacity) * 100)}%)
                </text>
              </g>
            );
          })}

          {/* ADA Elevator & Ramp Markers */}
          <g>
            {/* North-to-South ADA Concourse Ramp */}
            <path
              d="M 50 26 L 50 78"
              stroke="#38bdf8"
              strokeWidth="0.8"
              strokeDasharray="1.2,1.2"
              fill="none"
              opacity="0.6"
            />
            {/* Elevator Tower North */}
            <rect x="47" y="24" width="6" height="4" rx="0.5" fill="#0284c7" />
            <text x="47.5" y="27" fill="#ffffff" fontSize="1.8" fontWeight="bold">
              ADA
            </text>
          </g>

          {/* Active Navigation Polyline Route */}
          {activeRoute && routePathD && (
            <g>
              {/* Route shadow/glow */}
              <path
                d={routePathD}
                fill="none"
                stroke={accessibleOnly ? '#10b981' : '#6366f1'}
                strokeWidth="2.5"
                strokeOpacity="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              {/* Core animated line */}
              <path
                d={routePathD}
                fill="none"
                stroke={accessibleOnly ? '#34d399' : '#818cf8'}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2,1.5"
              />
            </g>
          )}

          {/* Venue Markers */}
          {filteredVenues.map((v) => {
            const isSelected = v.id === selectedVenueId;
            const typeInfo = getVenueTypeInfo(v.type);

            return (
              <g
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectVenue(v.id);
                }}
                className="cursor-pointer group"
              >
                {/* Selection pulse ring */}
                {isSelected && (
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r="4.5"
                    fill="url(#pulse-glow)"
                    className="animate-ping"
                  />
                )}

                {/* Marker Base circle */}
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={isSelected ? 3.2 : 2.4}
                  fill={typeInfo.color}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '0.8' : '0.5'}
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Accessibility Mini-Dot on Pin */}
                {v.isAccessible && (
                  <circle
                    cx={v.x + 1.8}
                    cy={v.y - 1.8}
                    r="0.9"
                    fill="#38bdf8"
                    stroke="#0f172a"
                    strokeWidth="0.3"
                  />
                )}

                {/* Label text */}
                <text
                  x={v.x}
                  y={v.y + 4.5}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize={isSelected ? '2.4' : '2'}
                  fontWeight={isSelected ? '700' : '500'}
                  className="pointer-events-none drop-shadow-md select-none"
                >
                  {v.name.length > 20 ? `${v.name.slice(0, 18)}...` : v.name}
                </text>
              </g>
            );
          })}

          {/* Connected Buddy Pin */}
          {profile.connectedBuddy && (
            <g>
              <circle
                cx={profile.connectedBuddy.location.x}
                cy={profile.connectedBuddy.location.y}
                r="3.2"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
              <text
                x={profile.connectedBuddy.location.x}
                y={profile.connectedBuddy.location.y + 4.5}
                textAnchor="middle"
                fill="#f472b6"
                fontSize="2.2"
                fontWeight="bold"
              >
                {profile.connectedBuddy.name} (Buddy)
              </text>
            </g>
          )}

          {/* User Location Pin */}
          <g>
            <circle
              cx={userLocation.x}
              cy={userLocation.y}
              r="4"
              fill="rgba(59, 130, 246, 0.3)"
              className="animate-pulse"
            />
            <circle
              cx={userLocation.x}
              cy={userLocation.y}
              r="2.4"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <circle cx={userLocation.x} cy={userLocation.y} r="0.8" fill="#ffffff" />
            <text
              x={userLocation.x}
              y={userLocation.y - 3.8}
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="2.2"
              fontWeight="bold"
            >
              YOU
            </text>
          </g>
        </svg>
      </div>

      {/* Floating Selected Venue Mini-Card */}
      {selectedVenue && (
        <div className="absolute bottom-3 right-3 z-20 max-w-[calc(100%-1.5rem)] sm:max-w-sm bg-slate-900/95 backdrop-blur-md p-4 rounded-lg border border-slate-700 shadow-lg text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                {selectedVenue.type}
              </span>
              <h4 className="text-base font-bold text-white leading-snug">
                {selectedVenue.name}
              </h4>
              <p className="text-sm text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                {selectedVenue.description}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
            <span className="font-medium">Floor {selectedVenue.floor || 1}</span>
            {selectedVenue.isAccessible && (
              <span className="text-emerald-400 font-semibold">Step-free access</span>
            )}
            <span className="font-medium">{selectedVenue.checkInCount || 0} check-ins</span>
          </div>
        </div>
      )}
    </div>
  );
};
