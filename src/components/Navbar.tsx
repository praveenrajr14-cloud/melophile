import React, { useState } from 'react';
import { Logo } from './Logo';
import { soundEngine } from '../utils/audioSynth';
import { InstagramIcon, WhatsAppIcon } from './SocialIcons';
import { Menu, X, ArrowRight, PhoneCall, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onBookTrialClick: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onBookTrialClick,
  onReplayIntro,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'courses', label: 'Courses' },
    { id: 'chords', label: 'Chord Library' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    soundEngine.playClick(580);
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#faf8f5]/85 backdrop-blur-md border-b border-[#eae6de] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with ripple effect and tooltip */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer transition-transform hover:scale-105"
            title="Melophile Music Academy"
          >
            <Logo size="md" showSubtitle={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#ede8e0] p-1.5 rounded-full border border-[#ded9cf] shadow-xs">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-[#141518] shadow-sm font-semibold'
                      : 'text-[#5c5f6a] hover:text-[#141518] hover:bg-white/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Replay Intro Button */}
            {onReplayIntro && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(680);
                  onReplayIntro();
                }}
                title="Replay Animated Logo Intro"
                className="p-2 rounded-full border border-[#ded9cf] text-[#5c5f6a] hover:text-[#b89562] hover:border-[#b89562]/40 hover:bg-white transition-all shadow-2xs group hidden lg:inline-flex"
                aria-label="Replay Logo Intro"
              >
                <Sparkles className="w-4 h-4 text-[#b89562] transition-transform group-hover:rotate-12" />
              </button>
            )}

            {/* Instagram Quick Link */}
            <a
              href="https://www.instagram.com/melophileacademy_?utm_source=qr&stkn=MWw5eXZxY2pqNzIwZQ=="
              target="_blank"
              rel="noopener noreferrer"
              title="Follow on Instagram @melophileacademy_"
              aria-label="Instagram @melophileacademy_"
              className="p-2 rounded-full border border-[#ded9cf] text-[#5c5f6a] hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-white transition-all shadow-2xs group hidden lg:inline-flex"
            >
              <InstagramIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            {/* WhatsApp Quick Link */}
            <a
              href="https://wa.me/917356146076?text=Hi%20Melophile%20Academy,%20I%20would%20like%20to%20inquire%20about%20music%20classes."
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp: +91 7356146076"
              aria-label="WhatsApp +91 7356146076"
              className="p-2 rounded-full border border-[#25D366]/30 text-emerald-700 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all shadow-2xs group hidden sm:inline-flex"
            >
              <WhatsAppIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(720);
                onBookTrialClick();
              }}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#141518] text-[#141518] hover:bg-[#141518] hover:text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer group shadow-xs"
            >
              <span>Book Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl bg-[#ede8e0] border border-[#ded9cf] text-[#141518] hover:bg-[#e4dfd5] transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#141518]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#faf8f5]/98 backdrop-blur-2xl md:hidden flex flex-col justify-center items-center px-8 transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="mb-6">
          <Logo size="lg" showSubtitle={true} />
        </div>

        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full py-2.5 text-base font-medium rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#141518] text-white font-bold shadow-md'
                    : 'text-[#5c5f6a] hover:text-[#141518] hover:bg-[#ede8e0]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(720);
              setMobileMenuOpen(false);
              onBookTrialClick();
            }}
            className="w-full mt-2 py-3 rounded-2xl bg-[#141518] text-white hover:bg-[#2b2d35] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            Book Free Trial Lesson
          </button>

          {onReplayIntro && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8c734b] hover:text-[#141518] transition-colors py-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b89562]" />
              <span>Replay Animated Intro</span>
            </button>
          )}

          {/* Mobile Social Links */}
          <div className="flex items-center justify-center gap-6 w-full mt-2 pt-4 border-t border-[#ded9cf]">
            <a
              href="https://www.instagram.com/melophileacademy_?utm_source=qr&stkn=MWw5eXZxY2pqNzIwZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-[#141518] hover:text-[#E1306C]"
            >
              <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
              <span>@melophileacademy_</span>
            </a>
            <a
              href="https://wa.me/917356146076?text=Hi%20Melophile%20Academy,%20I%20would%20like%20to%20inquire%20about%20music%20classes."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-emerald-800"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>+91 7356146076</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
