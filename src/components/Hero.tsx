import React, { useState, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const INTRO_LINE1 = 'Hey there, meet Praveen,';
const INTRO_LINE2 = "Melophile's Adaptive Response Interface Agent";
const TYPEWRITER_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?';

export const Hero: React.FC = () => {
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT, 38, 600);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPillsVisible(true);
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hello@mainframe.co');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const whitePills = [
    'Pitch us an idea',
    'Come work here',
    'Send a brief hello',
    'See how we operate',
  ];

  return (
    <main className="relative z-[1] w-full h-screen overflow-hidden flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10">
      <div className="max-w-xl relative z-10 w-full">
        {/* 1. Blurred intro label */}
        <div
          className="pointer-events-none select-none mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            fontWeight: 400,
            color: '#fff',
            filter: 'blur(4px)',
          }}
          aria-hidden="true"
        >
          {INTRO_LINE1}
          <br />
          {INTRO_LINE2}
        </div>

        {/* 2. Typewriter text */}
        <p
          className="text-white mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: '54px',
          }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink"
              aria-hidden="true"
            />
          )}
        </p>

        {/* 3. Action pill buttons */}
        <div
          className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${
            pillsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
          style={{
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.4s',
            transitionTimingFunction: 'ease',
          }}
        >
          {whitePills.map((label) => (
            <button
              key={label}
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {label}
            </button>
          ))}

          {/* Outline pill button */}
          <button
            type="button"
            onClick={handleCopyEmail}
            title="Click to copy email address"
            className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer relative group"
          >
            <span>
              Reach us:{' '}
              <span className="underline underline-offset-1">
                hello@mainframe.co
              </span>
            </span>

            {/* 12x12 copy icon (inline SVG of two overlapping rectangles) */}
            <span className="inline-flex items-center justify-center">
              {copied ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 6.5L4.5 8.5L9.5 3.5" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <rect x="1.5" y="3.5" width="6.5" height="7" rx="1" />
                  <path d="M4 3.5V2C4 1.44772 4.44772 1 5 1H10C10.5523 1 11 1.44772 11 2V7C11 7.55228 10.5523 8 10 8H8.5" />
                </svg>
              )}
            </span>

            {/* Optional subtle copied badge */}
            {copied && (
              <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white text-black text-[11px] font-medium px-2 py-0.5 rounded shadow pointer-events-none animate-fadeIn">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};
