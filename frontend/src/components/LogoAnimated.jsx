import React from 'react';

function LogoAnimated() {
  return (
    <div className="flex items-center justify-center h-96">
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-xs"
      >
        {/* Decorative background circle */}
        <circle cx="200" cy="200" r="190" fill="#E0F2FE" opacity="0.3" />

        {/* Left Bird (animated wings) */}
        <g className="animate-wing-flap" style={{ transformOrigin: '150px 150px' }}>
          {/* Wing - Left */}
          <path
            d="M 150 150 Q 100 120 80 150 Q 90 160 150 170 Z"
            fill="#98D82B"
            opacity="0.8"
          />
          {/* Body */}
          <circle cx="150" cy="150" r="20" fill="#98D82B" />
          {/* Head */}
          <circle cx="160" cy="140" r="12" fill="#98D82B" />
          {/* Eye */}
          <circle cx="163" cy="138" r="3" fill="white" />
        </g>

        {/* Right Bird (animated wings, delayed) */}
        <g
          className="animate-wing-flap"
          style={{
            transformOrigin: '250px 150px',
            animationDelay: '0.3s'
          }}
        >
          {/* Wing - Right */}
          <path
            d="M 250 150 Q 300 120 320 150 Q 310 160 250 170 Z"
            fill="#98D82B"
            opacity="0.8"
          />
          {/* Body */}
          <circle cx="250" cy="150" r="20" fill="#98D82B" />
          {/* Head */}
          <circle cx="240" cy="140" r="12" fill="#98D82B" />
          {/* Eye */}
          <circle cx="237" cy="138" r="3" fill="white" />
        </g>

        {/* Center Apple/Heart shape - Green */}
        <g transform="translate(200, 210)">
          {/* Apple body */}
          <path
            d="M 0 -30 Q -30 -20 -30 0 Q -30 30 0 40 Q 30 30 30 0 Q 30 -20 0 -30 Z"
            fill="#98D82B"
          />
          {/* Apple leaf - animated color */}
          <path
            d="M 15 -20 Q 25 -30 20 -40"
            stroke="#98D82B"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Left Ring */}
        <g transform="translate(150, 280)">
          {/* Ring outline */}
          <circle cx="0" cy="0" r="18" fill="none" stroke="#C9A961" strokeWidth="6" />
          {/* Ring band */}
          <ellipse cx="0" cy="0" rx="12" ry="16" fill="none" stroke="#D4AF37" strokeWidth="8" />
        </g>

        {/* Right Ring */}
        <g transform="translate(250, 280)">
          {/* Ring outline */}
          <circle cx="0" cy="0" r="18" fill="none" stroke="#C9A961" strokeWidth="6" />
          {/* Ring band */}
          <ellipse cx="0" cy="0" rx="12" ry="16" fill="none" stroke="#D4AF37" strokeWidth="8" />
        </g>

        {/* Brand name */}
        <text
          x="200"
          y="360"
          textAnchor="middle"
          fontSize="32"
          fontWeight="bold"
          fill="#003d82"
          fontFamily="serif"
          letterSpacing="2"
        >
          Cathy Décor
        </text>
      </svg>
    </div>
  );
}

export default LogoAnimated;
