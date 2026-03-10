import React from 'react';

function LogoAnimated() {
  return (
    <div className="flex items-center justify-center h-96 w-full">
      <svg
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-md"
      >
        {/* Background circle */}
        <circle cx="200" cy="200" r="180" fill="#E6F8FF" opacity="0.5" />

        {/* Left Bird (animated wings) */}
        <g>
          {/* Left Wing - animated */}
          <g className="animate-wing-flap" style={{ transformOrigin: '120px 180px' }}>
            <path
              d="M 120 180 Q 80 150 60 180 Q 70 195 120 200 Z"
              fill="#D4AF37"
              opacity="0.9"
            />
            <path
              d="M 120 180 Q 85 155 70 175 Q 75 188 115 195 Z"
              fill="#E6C541"
              opacity="0.7"
            />
          </g>

          {/* Body */}
          <ellipse cx="130" cy="190" rx="22" ry="28" fill="#D4AF37" />

          {/* Head */}
          <circle cx="140" cy="170" r="16" fill="#D4AF37" />

          {/* Beak */}
          <path d="M 152 170 L 180 165 L 155 173 Z" fill="#D4AF37" />

          {/* Eye */}
          <circle cx="144" cy="167" r="4" fill="#2D5016" />
          <circle cx="145" cy="166" r="2" fill="white" />
        </g>

        {/* Right Bird (animated wings, delayed) */}
        <g>
          {/* Right Wing - animated (delayed) */}
          <g
            className="animate-wing-flap"
            style={{
              transformOrigin: '280px 180px',
              animationDelay: '0.3s'
            }}
          >
            <path
              d="M 280 180 Q 320 150 340 180 Q 330 195 280 200 Z"
              fill="#D4AF37"
              opacity="0.9"
            />
            <path
              d="M 280 180 Q 315 155 330 175 Q 325 188 285 195 Z"
              fill="#E6C541"
              opacity="0.7"
            />
          </g>

          {/* Body */}
          <ellipse cx="270" cy="190" rx="22" ry="28" fill="#D4AF37" />

          {/* Head */}
          <circle cx="260" cy="170" r="16" fill="#D4AF37" />

          {/* Beak */}
          <path d="M 248 170 L 220 165 L 245 173 Z" fill="#D4AF37" />

          {/* Eye */}
          <circle cx="256" cy="167" r="4" fill="#2D5016" />
          <circle cx="255" cy="166" r="2" fill="white" />
        </g>

        {/* Heart connecting beaks - Green */}
        <g transform="translate(200, 168)">
          <path
            d="M 0 -8 C -5 -12 -12 -10 -12 -2 C -12 4 -4 8 0 12 C 4 8 12 4 12 -2 C 12 -10 5 -12 0 -8 Z"
            fill="#98D82B"
          />
        </g>

        {/* Apple/Pear shape - Green center */}
        <g transform="translate(200, 240)">
          {/* Main body - pear shape */}
          <path
            d="M 0 -35 Q -28 -25 -28 -5 Q -28 15 -15 28 Q 0 38 0 38 Q 18 28 28 15 Q 40 0 40 -5 Q 40 -25 15 -35 Z"
            fill="#98D82B"
            opacity="0.95"
          />

          {/* Highlight/shine effect */}
          <ellipse cx="-8" cy="-15" rx="8" ry="12" fill="#B3E74B" opacity="0.6" />

          {/* Leaf */}
          <ellipse cx="18" cy="-28" rx="8" ry="5" fill="#7CB322" transform="rotate(-30 18 -28)" />

          {/* Calyx (top detail) */}
          <path d="M -3 -35 L 0 -42 L 3 -35 Z" fill="#7CB322" />
        </g>

        {/* Left Ring */}
        <g transform="translate(177, 330)">
          {/* Outer ring */}
          <circle cx="0" cy="0" r="22" fill="none" stroke="#D4AF37" strokeWidth="7" />

          {/* Ring band shine */}
          <path
            d="M -18 -5 Q -20 0 -18 5"
            fill="none"
            stroke="#F4ECBE"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* Inner detail */}
          <circle cx="0" cy="0" r="16" fill="none" stroke="#C9A961" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Right Ring - touching left ring */}
        <g transform="translate(223, 330)">
          {/* Outer ring */}
          <circle cx="0" cy="0" r="22" fill="none" stroke="#D4AF37" strokeWidth="7" />

          {/* Ring band shine */}
          <path
            d="M 18 -5 Q 20 0 18 5"
            fill="none"
            stroke="#F4ECBE"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* Inner detail */}
          <circle cx="0" cy="0" r="16" fill="none" stroke="#C9A961" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Brand name - elegant serif */}
        <text
          x="200"
          y="420"
          textAnchor="middle"
          fontSize="42"
          fontWeight="600"
          fill="#003d82"
          fontFamily="'Playfair Display', serif"
          letterSpacing="3"
        >
          Cathy Décor
        </text>
      </svg>
    </div>
  );
}

export default LogoAnimated;
