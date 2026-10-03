import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  interactive = true,
  onClick,
}) => {
  const [activeKey, setActiveKey] = useState<number>(-1);

  const badgeHeights = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  const textSizes = {
    sm: 'text-[9px] tracking-[0.3em]',
    md: 'text-[11px] tracking-[0.35em]',
    lg: 'text-[13px] tracking-[0.4em]',
    xl: 'text-[16px] tracking-[0.45em]',
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    // Sequential piano key ripple on hover
    [0, 1, 2, 3].forEach((idx) => {
      setTimeout(() => {
        setActiveKey(idx);
      }, idx * 80);
    });
    setTimeout(() => {
      setActiveKey(-1);
    }, 450);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={`inline-flex flex-col items-center select-none group cursor-pointer ${className}`}
    >
      {/* Outer rounded badge matching reference image */}
      <div
        className={`${badgeHeights[size]} aspect-[2.4/1] bg-[#16181d] group-hover:bg-[#1f232b] border border-white/10 group-hover:border-[#c5a880]/60 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2.5 shadow-md shadow-black/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(197,168,128,0.15)]`}
      >
        {/* Left side: Stylized Piano Keys SVG with hover ripple */}
        <div className="h-full aspect-[1/1] relative flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-auto"
          >
            {/* White keys */}
            <rect
              x="5"
              y="10"
              width="18"
              height="80"
              rx="4"
              fill={activeKey === 0 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 0 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 0 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />
            <rect
              x="29"
              y="10"
              width="18"
              height="80"
              rx="4"
              fill={activeKey === 1 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 1 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 1 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />
            <rect
              x="53"
              y="10"
              width="18"
              height="80"
              rx="4"
              fill={activeKey === 2 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 2 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 2 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />
            <rect
              x="77"
              y="10"
              width="18"
              height="80"
              rx="4"
              fill={activeKey === 3 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 3 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 3 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />

            {/* Black keys */}
            <rect x="18" y="10" width="14" height="48" rx="3" fill="#16181d" stroke="#252932" strokeWidth="0.8" />
            <rect x="42" y="10" width="14" height="48" rx="3" fill="#16181d" stroke="#252932" strokeWidth="0.8" />
            <rect x="66" y="10" width="14" height="48" rx="3" fill="#16181d" stroke="#252932" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Right side: MELO PHILE text */}
        <div className="flex flex-col justify-center leading-none text-left">
          <span className="text-white font-extrabold tracking-wider text-[1.1em] font-sans">
            MELO
          </span>
          <span className="text-white font-extrabold tracking-wider text-[1.1em] font-sans">
            PHILE
          </span>
        </div>
      </div>

      {/* Subtitle: MUSIC ACADEMY */}
      {showSubtitle && (
        <span
          className={`mt-1 font-semibold text-[#c5a880] uppercase transition-colors group-hover:text-[#e4cfb5] ${textSizes[size]}`}
          style={{ letterSpacing: '0.35em' }}
        >
          MUSIC ACADEMY
        </span>
      )}
    </div>
  );
};
