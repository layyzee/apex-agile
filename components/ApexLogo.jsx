'use client';

export default function ApexLogo({ size = 26, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="Apex Agile Logo"
    >
      <defs>
        {/* Left Cobalt Facet */}
        <linearGradient id="apex-facet-left" x1="16" y1="3" x2="4" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="0.6" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0F2D6B" />
        </linearGradient>

        {/* Right Indigo Facet */}
        <linearGradient id="apex-facet-right" x1="16" y1="3" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="0.5" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>

        {/* Center Illuminated Prismatic Core */}
        <linearGradient id="apex-core-glow" x1="16" y1="12" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93C5FD" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#38BDF8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#0284C7" stopOpacity="0.1" />
        </linearGradient>

        {/* Ambient Subtle Shadow Filter */}
        <filter id="apex-shadow" x="0" y="1" width="32" height="31" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#0C66E4" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#apex-shadow)">
        {/* Outer Left Facet */}
        <path
          d="M16 3.5L4 27.5H16L16 12.5L16 3.5Z"
          fill="url(#apex-facet-left)"
        />

        {/* Outer Right Facet */}
        <path
          d="M16 3.5L28 27.5H16V12.5L16 3.5Z"
          fill="url(#apex-facet-right)"
        />

        {/* Center Precision Inset Core */}
        <path
          d="M16 12.5L10 24.5H22L16 12.5Z"
          fill="url(#apex-core-glow)"
        />

        {/* Structural Spine Line */}
        <line
          x1="16"
          y1="3.5"
          x2="16"
          y2="27.5"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />

        {/* Base Foundation Line */}
        <line
          x1="4"
          y1="27.5"
          x2="28"
          y2="27.5"
          stroke="#1D4ED8"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
