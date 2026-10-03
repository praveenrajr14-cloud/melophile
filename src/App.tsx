import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { ChordsPage } from './components/pages/ChordsPage';
import { ContactPage } from './components/pages/ContactPage';
import { BookingModal } from './components/BookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LogoIntro } from './components/LogoIntro';

export const App: React.FC = () => {
  const resolveTab = (hash: string) => {
    if (['home', 'about', 'courses', 'chords', 'contact'].includes(hash)) return hash;
    if (hash.startsWith('circle') || hash.startsWith('full-triads') || hash.startsWith('topic') || hash === 'subscription-section') {
      return 'chords';
    }
    return 'home';
  };

  const [currentTab, setCurrentTabState] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return resolveTab(hash);
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('Piano & Keyboard');

  // Animated Logo Splash state (runs on first load or manual replay)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('intro') === 'true' || window.location.hash === '#intro') {
        return true;
      }
      return !sessionStorage.getItem('melophile_intro_shown');
    }
    return true;
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('melophile_intro_shown', 'true');
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const setCurrentTab = (tab: string) => {
    window.location.hash = tab;
    setCurrentTabState(tab);
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentTabState(resolveTab(hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenTrial = (courseName?: string) => {
    if (courseName) {
      setSelectedCourse(courseName);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#141518] font-sans selection:bg-[#ecdcc5] selection:text-[#141518]">
      {/* Animated Logo Intro Sequence on First Website Impression */}
      {showIntro && <LogoIntro onComplete={handleIntroComplete} />}

      {/* Minimal bright warm ambient backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft, warm amber/champagne glow at top-right */}
        <div className="absolute -top-[15%] right-[5%] w-[700px] h-[700px] bg-[#b89562]/06 rounded-full blur-[160px]" />
        {/* Soft warm glow at bottom-left */}
        <div className="absolute -bottom-[15%] -left-[10%] w-[600px] h-[600px] bg-[#b89562]/04 rounded-full blur-[160px]" />
      </div>

      {/* Top Navigation Bar with Logo */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onBookTrialClick={() => handleOpenTrial()}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Content Views (SPA Routes) */}
      <main className="relative z-10">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={setCurrentTab}
            onBookTrial={() => handleOpenTrial()}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage onBookTrial={() => handleOpenTrial()} />
        )}

        {currentTab === 'courses' && (
          <CoursesPage
            onSelectCourse={(courseTitle) => handleOpenTrial(courseTitle)}
          />
        )}

        {currentTab === 'chords' && (
          <ChordsPage />
        )}

        {currentTab === 'contact' && (
          <ContactPage initialCourse={selectedCourse} />
        )}
      </main>

      {/* Academy Footer */}
      <Footer onNavigate={setCurrentTab} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCourse={selectedCourse}
      />

      {/* Floating WhatsApp Quick Contact Button */}
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
