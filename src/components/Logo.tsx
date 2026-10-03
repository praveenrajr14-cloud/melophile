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

  const meloTextSizes = {
    sm: 'text-[11px]',
    md: 'text-[15px]',
    lg: 'text-[20px]',
    xl: 'text-[28px]',
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
        className={`${badgeHeights[size]} bg-[#23272d] group-hover:bg-[#2c313a] border border-white/10 group-hover:border-[#c5a880]/60 rounded-xl px-2.5 sm:px-3.5 py-1.5 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-black/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(197,168,128,0.15)]`}
      >
        {/* Left side: Stylized Piano Keys SVG with hover ripple */}
        <div className="h-full aspect-[0.92/1] relative flex items-center justify-center">
          <svg
            viewBox="0 0 94 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-auto"
          >
            {/* White keys */}
            <rect
              x="3"
              y="8"
              width="19"
              height="84"
              rx="3.5"
              fill={activeKey === 0 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 0 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 0 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />
            <rect
              x="26"
              y="8"
              width="19"
              height="84"
              rx="3.5"
              fill={activeKey === 1 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 1 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 1 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />
            <rect
              x="49"
              y="8"
              width="19"
              height="84"
              rx="3.5"
              fill={activeKey === 2 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 2 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 2 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />
            <rect
              x="72"
              y="8"
              width="19"
              height="84"
              rx="3.5"
              fill={activeKey === 3 ? '#f4efe6' : '#F8F9FA'}
              className="transition-all duration-150 origin-top"
              style={{
                transform: activeKey === 3 ? 'scaleY(0.94) translateY(2px)' : 'scaleY(1)',
                filter: activeKey === 3 ? 'drop-shadow(0 0 6px #c5a880)' : 'none',
              }}
            />

            {/* Black keys */}
            <rect x="15.5" y="8" width="13.5" height="50" rx="2.5" fill="#23272d" stroke="#17191d" strokeWidth="0.8" />
            <rect x="38.5" y="8" width="13.5" height="50" rx="2.5" fill="#23272d" stroke="#17191d" strokeWidth="0.8" />
            <rect x="61.5" y="8" width="13.5" height="50" rx="2.5" fill="#23272d" stroke="#17191d" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Right side: MELO PHILE text with exact snug spacing */}
        <div className="flex flex-col justify-center leading-[0.88] text-left">
          <span className={`text-white font-black tracking-tight font-sans ${meloTextSizes[size]}`}>
            MELO
          </span>
          <span className={`text-white font-black tracking-tight font-sans ${meloTextSizes[size]}`}>
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
