export default function ApexLogo({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="apex-grad-1" x1="16" y1="2" x2="3" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="apex-grad-2" x1="16" y1="2" x2="29" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93C5FD" />
          <stop offset="0.6" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="apex-grad-inner" x1="16" y1="12" x2="16" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#0284C7" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {/* Outer Left Facet */}
      <path
        d="M16 2.5L3.5 27.5H16L16 11.5L16 2.5Z"
        fill="url(#apex-grad-1)"
      />
      
      {/* Outer Right Facet */}
      <path
        d="M16 2.5L28.5 27.5H16V11.5L16 2.5Z"
        fill="url(#apex-grad-2)"
      />
      
      {/* Precision Core Inset */}
      <path
        d="M16 11.5L9.5 24.5H22.5L16 11.5Z"
        fill="url(#apex-grad-inner)"
      />

      {/* Center Line Split */}
      <line
        x1="16"
        y1="2.5"
        x2="16"
        y2="27.5"
        stroke="#09090b"
        strokeWidth="0.8"
      />
    </svg>
  );
}
