import React from 'react';

// ============================================================================
// HIGH-FIDELITY VECTOR MUSICAL SYMBOLS & ENGRAVING DIAGRAMS
// ============================================================================

interface SymbolProps {
  className?: string;
  color?: string;
  size?: number;
}

// 1. Treble Clef (G-Clef) SVG
export const TrebleClefSvg: React.FC<SymbolProps> = ({
  className = '',
  color = '#c5a880',
  size = 64,
}) => (
  <svg
    viewBox="0 0 80 180"
    width={size}
    height={size * 2.25}
    className={`inline-block select-none overflow-visible ${className}`}
  >
    <text
      x="40"
      y="140"
      textAnchor="middle"
      fontSize="175"
      fontFamily="'Segoe UI Symbol', 'Noto Music', 'Bravura', 'Apple Symbols', serif"
      fill={color}
    >
      𝄞
    </text>
  </svg>
);

// 2. Bass Clef (F-Clef) SVG
export const BassClefSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 64,
}) => (
  <svg
    viewBox="0 0 120 160"
    width={size}
    height={size * 1.33}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Main Clef Curl */}
    <path d="M28 32c0-14 11-26 26-26s26 12 26 26c0 10-5 19-14 24-8 4-15 11-19 19-6 11-9 24-9 37 0 18 6 35 17 48 4 5 9 9 15 12-3 2-7 3-11 3-15 0-29-10-36-23-8-15-12-33-11-50 1-17 7-34 18-47 5-6 11-11 18-15-10-2-17-10-17-21 0-8 6-15 14-16 8-1 16 4 18 12 2 8-3 16-10 18-5 2-11 0-15-4-3-3-4-7-4-11 0-2 1-4 2-5 2-2 4-2 6-1 2 1 3 3 3 5 0 2-1 3-3 4-1 1-3 0-4-1-1-1-1-2 0-3 1-1 2-1 3 0 1 1 1 2 0 3z" />
    {/* Dot 1 in Space 4 (around Line 4 F3) */}
    <circle cx="88" cy="42" r="9" />
    {/* Dot 2 in Space 3 (around Line 4 F3) */}
    <circle cx="88" cy="74" r="9" />
  </svg>
);

// 3. Whole Note (Semibreve) SVG
export const WholeNoteSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 80 60"
    width={size}
    height={size * 0.75}
    className={`inline-block ${className}`}
  >
    {/* Slanted open hollow notehead */}
    <ellipse
      cx="40"
      cy="30"
      rx="32"
      ry="20"
      transform="rotate(-25 40 30)"
      fill={color}
    />
    <ellipse
      cx="40"
      cy="30"
      rx="20"
      ry="10"
      transform="rotate(-45 40 30)"
      fill="#141518"
    />
  </svg>
);

// 4. Half Note (Minim) SVG
export const HalfNoteSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 70 120"
    width={size}
    height={size * 1.71}
    className={`inline-block ${className}`}
  >
    {/* Hollow notehead */}
    <ellipse
      cx="25"
      cy="90"
      rx="22"
      ry="14"
      transform="rotate(-25 25 90)"
      fill={color}
    />
    <ellipse
      cx="25"
      cy="90"
      rx="14"
      ry="7"
      transform="rotate(-45 25 90)"
      fill="#141518"
    />
    {/* Vertical stem on right */}
    <rect x="42" y="15" width="4.5" height="78" rx="2" fill={color} />
  </svg>
);

// 5. Quarter Note (Crotchet) SVG
export const QuarterNoteSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 70 120"
    width={size}
    height={size * 1.71}
    className={`inline-block ${className}`}
  >
    {/* Solid filled notehead */}
    <ellipse
      cx="25"
      cy="90"
      rx="22"
      ry="15"
      transform="rotate(-25 25 90)"
      fill={color}
    />
    {/* Vertical stem on right */}
    <rect x="42" y="15" width="4.5" height="78" rx="2" fill={color} />
  </svg>
);

// 6. Eighth Note (Quaver) SVG
export const EighthNoteSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 85 120"
    width={size}
    height={size * 1.41}
    className={`inline-block ${className}`}
  >
    {/* Solid filled notehead */}
    <ellipse
      cx="25"
      cy="90"
      rx="22"
      ry="15"
      transform="rotate(-25 25 90)"
      fill={color}
    />
    {/* Vertical stem */}
    <rect x="42" y="15" width="4.5" height="78" rx="2" fill={color} />
    {/* Curved single flag */}
    <path
      d="M46 15c10 8 24 16 26 32 1 12-6 22-12 26-2 1-4 2-6 3 4-8 7-18 6-27-1-10-8-19-14-26v-8z"
      fill={color}
    />
  </svg>
);

// 7. Sixteenth Note (Semiquaver) SVG
export const SixteenthNoteSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 85 120"
    width={size}
    height={size * 1.41}
    className={`inline-block ${className}`}
  >
    {/* Solid filled notehead */}
    <ellipse
      cx="25"
      cy="90"
      rx="22"
      ry="15"
      transform="rotate(-25 25 90)"
      fill={color}
    />
    {/* Vertical stem */}
    <rect x="42" y="15" width="4.5" height="78" rx="2" fill={color} />
    {/* Top Flag */}
    <path
      d="M46 15c10 7 24 15 26 30 1 10-6 19-12 23-2 1-4 2-6 2 4-7 7-15 6-23-1-9-8-17-14-24v-8z"
      fill={color}
    />
    {/* Bottom Flag */}
    <path
      d="M46 36c10 7 24 15 26 30 1 10-6 19-12 23-2 1-4 2-6 2 4-7 7-15 6-23-1-9-8-17-14-24v-8z"
      fill={color}
    />
  </svg>
);

// 8. Beamed Eighth Notes (Pair) SVG
export const BeamedEighthsSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 80,
}) => (
  <svg
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={`inline-block ${className}`}
  >
    {/* Notehead 1 */}
    <ellipse
      cx="25"
      cy="92"
      rx="19"
      ry="13"
      transform="rotate(-25 25 92)"
      fill={color}
    />
    <rect x="39" y="24" width="4" height="70" rx="1.5" fill={color} />

    {/* Notehead 2 */}
    <ellipse
      cx="90"
      cy="82"
      rx="19"
      ry="13"
      transform="rotate(-25 90 82)"
      fill={color}
    />
    <rect x="104" y="14" width="4" height="70" rx="1.5" fill={color} />

    {/* Connecting Horizontal Beam */}
    <polygon points="39,24 108,14 108,24 39,34" fill={color} />
  </svg>
);

// 9. Whole Rest SVG (Hanging below Line 4)
export const WholeRestSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 80,
}) => (
  <svg
    viewBox="0 0 120 70"
    width={size}
    height={size * 0.58}
    className={`inline-block ${className}`}
  >
    {/* Staff line 4 */}
    <line x1="10" y1="20" x2="110" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
    {/* Staff line 3 */}
    <line x1="10" y1="50" x2="110" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
    {/* Hanging Rectangle (Whole Rest) */}
    <rect x="42" y="20" width="36" height="15" rx="1" fill={color} />
    <text x="60" y="65" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="sans-serif">
      Hangs from Line 4
    </text>
  </svg>
);

// 10. Half Rest SVG (Resting on Line 3)
export const HalfRestSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 80,
}) => (
  <svg
    viewBox="0 0 120 70"
    width={size}
    height={size * 0.58}
    className={`inline-block ${className}`}
  >
    {/* Staff line 4 */}
    <line x1="10" y1="20" x2="110" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
    {/* Staff line 3 */}
    <line x1="10" y1="50" x2="110" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
    {/* Resting Rectangle (Half Rest — Top Hat) */}
    <rect x="42" y="35" width="36" height="15" rx="1" fill={color} />
    <text x="60" y="65" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="sans-serif">
      Sits on Line 3
    </text>
  </svg>
);

// 11. Quarter Rest (Crotchet Rest) SVG
export const QuarterRestSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 60 120"
    width={size}
    height={size * 2}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Distinctive lightning squiggle shape */}
    <path d="M38 12c-5 8-12 16-16 25-2 5-3 10-1 15 2 4 6 7 10 9-6 6-12 13-17 21-3 6-4 13-2 19 3 7 10 11 18 12 4 0 7-1 10-4-3-1-5-3-7-6-2-4-2-9 0-13 3-5 7-8 12-11-7-8-13-17-18-27 8-3 14-8 17-15 3-7 3-15-1-22-2-3-4-5-5-3z" />
  </svg>
);

// 12. Eighth Rest (Quaver Rest) SVG
export const EighthRestSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 60 100"
    width={size}
    height={size * 1.66}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Round dot and hook on left, diagonal stem downward */}
    <circle cx="20" cy="30" r="7" />
    <path d="M22 25c7-2 15 1 20 7 4 6 5 14 3 21l-18 40h-6l16-36c-5 1-11-1-14-5-3-4-3-10-1-15 1-4 3-8 6-10-2-1-4-1-6-2z" />
  </svg>
);

// 13. Sixteenth Rest (Semiquaver Rest) SVG
export const SixteenthRestSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 60 120"
    width={size}
    height={size * 2}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Two stacked hooks and diagonal stem */}
    <circle cx="20" cy="24" r="6" />
    <circle cx="16" cy="48" r="6" />
    <path d="M22 20c7-2 15 1 20 7 4 6 5 13 3 20l-18 64h-5l10-34c-6 1-11-2-14-7-3-4-3-10-1-15 2-4 5-8 9-10l5-18c-5 1-10-1-13-5-3-4-3-10-1-15 1-4 3-7 6-9-2-1-4-1-6-2z" />
  </svg>
);

// 14. Sharp (♯) SVG
export const SharpSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 48,
}) => (
  <svg
    viewBox="0 0 80 120"
    width={size}
    height={size * 1.5}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Left vertical */}
    <rect x="24" y="10" width="5" height="100" rx="1.5" />
    {/* Right vertical */}
    <rect x="51" y="10" width="5" height="100" rx="1.5" />
    {/* Upper tilted horizontal */}
    <polygon points="12,50 68,36 68,48 12,62" />
    {/* Lower tilted horizontal */}
    <polygon points="12,80 68,66 68,78 12,92" />
  </svg>
);

// 15. Flat (♭) SVG
export const FlatSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 48,
}) => (
  <svg
    viewBox="0 0 70 120"
    width={size}
    height={size * 1.71}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Vertical spine */}
    <rect x="18" y="10" width="5" height="100" rx="1.5" />
    {/* Rounded belly */}
    <path d="M20 62c6-8 15-13 25-11 9 2 16 9 18 18 2 10-3 20-11 25-7 5-17 6-25 1l-7-4v-11l8 5c6 3 13 3 18-1 5-4 8-11 7-17-1-6-5-11-11-12-6-1-13 2-17 7l-5 4v-14z" />
  </svg>
);

// 16. Natural (♮) SVG
export const NaturalSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 48,
}) => (
  <svg
    viewBox="0 0 70 120"
    width={size}
    height={size * 1.71}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Left vertical (extends high) */}
    <rect x="20" y="10" width="5" height="80" rx="1.5" />
    {/* Right vertical (extends low) */}
    <rect x="45" y="30" width="5" height="80" rx="1.5" />
    {/* Top crossbar */}
    <polygon points="20,40 47,32 47,42 20,50" />
    {/* Bottom crossbar */}
    <polygon points="20,78 47,70 47,80 20,88" />
  </svg>
);

// 17. Fermata ("Bird's Eye" Pause) SVG
export const FermataSvg: React.FC<SymbolProps> = ({
  className = '',
  color = 'currentColor',
  size = 56,
}) => (
  <svg
    viewBox="0 0 90 60"
    width={size}
    height={size * 0.66}
    fill={color}
    className={`inline-block ${className}`}
  >
    {/* Outer arch */}
    <path d="M10 46c0-19 16-35 35-35s35 16 35 35c0 2-2 4-4 4s-4-2-4-4c0-15-12-27-27-27s-27 12-27 27c0 2-2 4-4 4s-4-2-4-4z" />
    {/* Center Dot */}
    <circle cx="45" cy="44" r="6" />
  </svg>
);

// 18. Note Anatomy Complete Diagram SVG
export const NoteAnatomySvg: React.FC<{ width?: number }> = ({ width = 440 }) => (
  <svg
    viewBox="0 0 540 220"
    width={width}
    className="w-full max-w-xl mx-auto bg-[#141518]/90 rounded-2xl border border-white/10 p-4 shadow-xl"
  >
    {/* Staff guide line */}
    <line x1="30" y1="160" x2="510" y2="160" stroke="#333742" strokeWidth="2" strokeDasharray="4 4" />
    <text x="510" y="155" textAnchor="end" fill="#6b7280" fontSize="10" fontFamily="sans-serif">
      Staff Line Reference
    </text>

    {/* Note 1: Eighth Note with Flag */}
    <g transform="translate(190, 40)">
      {/* Notehead */}
      <ellipse cx="40" cy="120" rx="20" ry="14" transform="rotate(-25 40 120)" fill="#c5a880" />
      {/* Stem */}
      <rect x="55" y="40" width="4.5" height="80" rx="2" fill="#c5a880" />
      {/* Flag */}
      <path
        d="M59 40c10 8 22 16 24 30 1 11-5 20-11 24-2 1-4 2-6 2 4-7 6-16 5-24-1-9-7-17-12-24v-8z"
        fill="#c5a880"
      />

      {/* Annotations */}
      {/* 1. Notehead callout */}
      <line x1="20" y1="135" x2="-20" y2="150" stroke="#c5a880" strokeWidth="1.5" />
      <circle cx="-20" cy="150" r="3" fill="#c5a880" />
      <text x="-26" y="154" textAnchor="end" fill="#f5f3ef" fontSize="11" fontWeight="bold">
        1. Notehead (Pitch)
      </text>

      {/* 2. Stem callout */}
      <line x1="57" y1="75" x2="-10" y2="75" stroke="#c5a880" strokeWidth="1.5" />
      <circle cx="-10" cy="75" r="3" fill="#c5a880" />
      <text x="-16" y="79" textAnchor="end" fill="#f5f3ef" fontSize="11" fontWeight="bold">
        2. Stem (Rhythm)
      </text>

      {/* 3. Flag callout */}
      <line x1="80" y1="55" x2="130" y2="35" stroke="#c5a880" strokeWidth="1.5" />
      <circle cx="130" cy="35" r="3" fill="#c5a880" />
      <text x="135" y="39" textAnchor="start" fill="#f5f3ef" fontSize="11" fontWeight="bold">
        3. Flag (Cuts beat in half)
      </text>
    </g>

    {/* Note 2: Beamed Pair */}
    <g transform="translate(370, 40)">
      <ellipse cx="20" cy="120" rx="16" ry="11" transform="rotate(-25 20 120)" fill="#9e7a4b" />
      <rect x="32" y="55" width="3.5" height="65" rx="1.5" fill="#9e7a4b" />
      <ellipse cx="75" cy="110" rx="16" ry="11" transform="rotate(-25 75 110)" fill="#9e7a4b" />
      <rect x="87" y="45" width="3.5" height="65" rx="1.5" fill="#9e7a4b" />
      <polygon points="32,55 90,45 90,54 32,64" fill="#9e7a4b" />

      {/* Beam callout */}
      <line x1="60" y1="48" x2="60" y2="15" stroke="#9e7a4b" strokeWidth="1.5" />
      <circle cx="60" cy="15" r="3" fill="#9e7a4b" />
      <text x="60" y="8" textAnchor="middle" fill="#f5f3ef" fontSize="11" fontWeight="bold">
        4. Beam (Connects notes)
      </text>
    </g>
  </svg>
);

// 19. Stem Direction Rule Graphic SVG (Line 3 threshold)
export const StemRuleDiagramSvg: React.FC<{ width?: number }> = ({ width = 360 }) => (
  <svg
    viewBox="0 0 400 180"
    width={width}
    className="w-full max-w-lg mx-auto bg-[#141518]/90 rounded-2xl border border-white/10 p-4 shadow-xl"
  >
    {/* 5 Staff lines */}
    {[30, 55, 80, 105, 130].map((y, idx) => (
      <line
        key={idx}
        x1="20"
        y1={y}
        x2="380"
        y2={y}
        stroke={idx === 2 ? '#c5a880' : '#404552'}
        strokeWidth={idx === 2 ? 2.5 : 1.5}
      />
    ))}

    {/* Center Line 3 label */}
    <rect x="15" y="70" width="80" height="20" rx="4" fill="#c5a880" />
    <text x="55" y="84" textAnchor="middle" fill="#141518" fontSize="10" fontWeight="bold">
      Line 3 (Threshold)
    </text>

    {/* Note BELOW Line 3 -> Stem UP on Right */}
    <g transform="translate(140, 0)">
      <ellipse cx="25" cy="105" rx="16" ry="11" transform="rotate(-25 25 105)" fill="#10b981" />
      <rect x="37" y="45" width="3.5" height="60" rx="1" fill="#10b981" />
      <text x="30" y="160" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">
        Below Line 3
      </text>
      <text x="30" y="174" textAnchor="middle" fill="#9ca3af" fontSize="9">
        Stem Points UP (Right side)
      </text>
    </g>

    {/* Note ON OR ABOVE Line 3 -> Stem DOWN on Left */}
    <g transform="translate(280, 0)">
      <ellipse cx="35" cy="55" rx="16" ry="11" transform="rotate(-25 35 55)" fill="#38bdf8" />
      <rect x="21" y="55" width="3.5" height="60" rx="1" fill="#38bdf8" />
      <text x="30" y="160" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
        Above Line 3
      </text>
      <text x="30" y="174" textAnchor="middle" fill="#9ca3af" fontSize="9">
        Stem Points DOWN (Left side)
      </text>
    </g>
  </svg>
);

// 20. Bar Lines and Repeat Signs Comparison SVG
export const BarLinesSvg: React.FC<{ width?: number }> = ({ width = 360 }) => (
  <svg
    viewBox="0 0 420 160"
    width={width}
    className="w-full max-w-lg mx-auto bg-[#141518]/90 rounded-2xl border border-white/10 p-4 shadow-xl"
  >
    {/* 5 Staff lines */}
    {[25, 45, 65, 85, 105].map((y, idx) => (
      <line key={idx} x1="20" y1={y} x2="400" y2={y} stroke="#404552" strokeWidth="1.5" />
    ))}

    {/* 1. Single Bar Line */}
    <line x1="100" y1="25" x2="100" y2="105" stroke="#f5f3ef" strokeWidth="2" />
    <text x="100" y="135" textAnchor="middle" fill="#f5f3ef" fontSize="11" fontWeight="bold">
      Single Bar
    </text>
    <text x="100" y="150" textAnchor="middle" fill="#9ca3af" fontSize="9">
      Separates measures
    </text>

    {/* 2. Double Bar Line */}
    <line x1="200" y1="25" x2="200" y2="105" stroke="#c5a880" strokeWidth="2" />
    <line x1="207" y1="25" x2="207" y2="105" stroke="#c5a880" strokeWidth="2" />
    <text x="203" y="135" textAnchor="middle" fill="#c5a880" fontSize="11" fontWeight="bold">
      Double Bar
    </text>
    <text x="203" y="150" textAnchor="middle" fill="#9ca3af" fontSize="9">
      New section or key
    </text>

    {/* 3. Final End Bar Line */}
    <line x1="300" y1="25" x2="300" y2="105" stroke="#f5f3ef" strokeWidth="2" />
    <rect x="307" y="25" width="6" height="80" rx="1" fill="#f5f3ef" />
    <text x="305" y="135" textAnchor="middle" fill="#f5f3ef" fontSize="11" fontWeight="bold">
      Final Bar
    </text>
    <text x="305" y="150" textAnchor="middle" fill="#9ca3af" fontSize="9">
      Song complete
    </text>

    {/* 4. Repeat Sign (Two dots + double bar) */}
    <line x1="375" y1="25" x2="375" y2="105" stroke="#f59e0b" strokeWidth="2" />
    <rect x="382" y="25" width="5" height="80" rx="1" fill="#f59e0b" />
    <circle cx="367" cy="55" r="3.5" fill="#f59e0b" />
    <circle cx="367" cy="75" r="3.5" fill="#f59e0b" />
    <text x="378" y="135" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
      Repeat :||
    </text>
    <text x="378" y="150" textAnchor="middle" fill="#9ca3af" fontSize="9">
      Play section again
    </text>
  </svg>
);

// 21. Key Signature Staff Engraving Visualizer SVG
export const KeySignatureStaffSvg: React.FC<{
  accidentals: string[];
  type: 'natural' | 'sharp' | 'flat';
  clef?: 'treble' | 'bass';
  keyName: string;
}> = ({ accidentals, type, clef = 'treble', keyName }) => {
  // Classical Treble Clef coordinate map for sharps and flats:
  // Staff lines are at Y: L5=20, L4=40, L3=60, L2=80, L1=100
  // Spaces are at Y: S4=30, S3=50, S2=70, S1=90, Space above L5=10
  const sharpPositionsTreble: Record<string, number> = {
    'F#': 20, // Line 5 (F5)
    'C#': 50, // Space 3 (C5)
    'G#': 10, // Space above Line 5 (G5)
    'D#': 40, // Line 4 (D5)
    'A#': 70, // Space 2 (A4)
    'E#': 30, // Space 4 (E5)
    'B#': 60, // Line 3 (B4)
  };

  const flatPositionsTreble: Record<string, number> = {
    Bb: 60, // Line 3 (B4)
    Eb: 30, // Space 4 (E5)
    Ab: 70, // Space 2 (A4)
    Db: 40, // Line 4 (D5)
    Gb: 80, // Line 2 (G4)
    Cb: 50, // Space 3 (C5)
    Fb: 90, // Space 1 (F4)
  };

  const posMap = type === 'sharp' ? sharpPositionsTreble : flatPositionsTreble;

  return (
    <svg
      viewBox="0 0 380 140"
      className="w-full max-w-md mx-auto bg-[#141518] rounded-2xl border border-white/10 p-3 shadow-lg"
    >
      {/* 5 Staff lines */}
      {[20, 40, 60, 80, 100].map((y, idx) => (
        <line
          key={idx}
          x1="20"
          y1={y}
          x2="360"
          y2={y}
          stroke="#404552"
          strokeWidth="1.5"
        />
      ))}

      {/* Clef on Left */}
      <g transform="translate(25, -15) scale(0.65)">
        <TrebleClefSvg color="#c5a880" size={54} />
      </g>

      {/* Key Signature Accidentals */}
      {accidentals.map((acc, idx) => {
        const xPos = 90 + idx * 26;
        const yPos = posMap[acc] ?? 60;

        return (
          <g key={idx} transform={`translate(${xPos}, ${yPos - 22})`}>
            {type === 'sharp' ? (
              <SharpSvg size={18} color="#e5c158" />
            ) : (
              <FlatSvg size={18} color="#38bdf8" />
            )}
            <text
              x="9"
              y="52"
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="9"
              fontFamily="monospace"
            >
              {acc}
            </text>
          </g>
        );
      })}

      {accidentals.length === 0 && (
        <text
          x="200"
          y="65"
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="12"
          fontFamily="sans-serif"
        >
          No sharps or flats (Pure Diatonic C Major)
        </text>
      )}

      {/* Right measure divider */}
      <line x1="330" y1="20" x2="330" y2="100" stroke="#f5f3ef" strokeWidth="2" />
      <rect x="336" y="20" width="5" height="80" rx="1" fill="#f5f3ef" />

      {/* Key name badge at bottom */}
      <text
        x="200"
        y="128"
        textAnchor="middle"
        fill="#c5a880"
        fontSize="11"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        Key Signature: {keyName}
      </text>
    </svg>
  );
};
