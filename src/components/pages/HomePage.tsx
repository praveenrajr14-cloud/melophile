import React from 'react';
import { InteractivePiano3D } from '../InteractivePiano3D';
import { soundEngine } from '../../utils/audioSynth';
import {
  Award,
  Music,
  Users,
  ArrowRight,
  Clock,
  MapPin,
  Laptop,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onBookTrial: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onBookTrial,
}) => {
  const stats = [
    { label: 'Years Pedagogy', value: '10+', icon: Award },
    { label: 'Students Mentored', value: '150+', icon: Users },
    {
      label: 'Grade Certification Track',
      value: 'Coming Soon',
      isComingSoon: true,
      icon: Clock,
    },
    { label: 'Concerts & Recitals', value: '50+', icon: Music },
  ];

  const pillars = [
    {
      title: 'Personalized 1-on-1 Mentorship',
      desc: 'Individual guidance tailored to each student’s mechanical touch, ear acuity, and personal musical goals.',
      icon: Users,
    },
    {
      title: 'Foundational & Modern Pedagogy',
      desc: 'Balancing classical finger dexterity and notation sight-reading with contemporary improvisation and ear training.',
      icon: Award,
    },
    {
      title: 'Acoustic & Studio Immersion',
      desc: 'Learn on authentic grand and upright pianos, professional keyboard workstations, and sound-treated studio rooms.',
      icon: Music,
    },
    {
      title: 'Flexible Learning Modes',
      desc: 'In-studio sessions at Parassala, TVM alongside high-definition live online lessons for remote students.',
      icon: Laptop,
    },
  ];

  const featuredDisciplines = [
    {
      title: 'Piano & Keyboard',
      level: 'Beginner to Advanced',
      desc: 'Classical dexterity, contemporary voicing, pop accompaniment, and sight reading.',
      badge: 'Core Program',
      examStatus: 'Grade Certification: Coming Soon',
    },
    {
      title: 'Acoustic & Classical Guitar',
      level: 'Beginner to Advanced',
      desc: 'Fingerstyle technique, rhythm strumming, lead scale improvisation, and fretboard fluency.',
      badge: 'Popular',
      examStatus: 'Grade Certification: Coming Soon',
    },
    {
      title: 'Western Contemporary Vocals',
      level: 'All Age Groups',
      desc: 'Diaphragmatic breath support, vocal register blending, pitch stability, and microphone technique.',
      badge: 'Voice Coaching',
      examStatus: 'Grade Certification: Coming Soon',
    },
    {
      title: 'Applied Music Theory',
      level: 'Foundational to Advanced',
      desc: 'Harmony, intervals, chord progressions, sight-reading, and ear transcription.',
      badge: 'Essential',
      examStatus: 'Exam Syllabus: Coming Soon',
    },
  ];

  return (
    <div className="relative w-full text-[#141518] pt-24 pb-24">
      {/* 1. CINEMATIC HERO SECTION WITH UPLOADED BANNER */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        {/* Cinematic Banner Container - Upscaled Display with 2560:1180 Aspect Ratio */}
        <div className="relative rounded-3xl overflow-hidden border border-[#e5e0d8] shadow-[0_20px_50px_rgba(0,0,0,0.07)] bg-white aspect-[2560/1180] group">
          <img
            src="/hero-banner.jpg"
            alt="Melophile Music Academy - The sound of love - Keyboard • Piano • Music Theory - Parassala | TVM"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* Top-Right Action Pill Overlay */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 sm:gap-3 z-10">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-[#f5f4f0] uppercase tracking-wider font-mono">
              ● Admissions Open
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(750);
                onBookTrial();
              }}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white hover:bg-[#faf8f5] text-[#141518] border border-white/50 shadow-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Book Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clickable Hotspot directly over the printed 'EXPLORE COURSES ->' button in exact alignment */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(600);
              onNavigate('courses');
            }}
            aria-label="Explore Courses"
            title="Click to Explore Courses"
            style={{
              left: '24.88%',
              top: '69.66%',
              width: '16.95%',
              height: '7.63%',
            }}
            className="absolute rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] hover:bg-[#c5a880]/15 active:scale-[0.98] transition-all duration-200"
          />
        </div>

        {/* Hero Introduction Headline & Subtitle */}
        <div className="mt-12 text-center max-w-3xl mx-auto">
          <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.35em] font-semibold mb-3">
            The Sound of Love • Parassala, Trivandrum
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#141518] leading-tight mb-4">
            Where Discipline Meets Musical Soul
          </h1>
          <p className="text-[#5c5f6a] text-sm sm:text-base leading-relaxed mb-6">
            Welcome to <strong className="text-[#141518] font-semibold">Melophile Music Academy</strong>. Founded and mentored by instructor{' '}
            <strong className="text-[#141518] font-semibold">Praveen Raj R</strong> with over a decade of pedagogical excellence. Empowering students of all ages in Piano, Keyboard, Guitar, Vocals, and Applied Music Theory.
          </p>

          {/* Coming Soon Notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4efe6] border border-[#e5dcce] text-xs text-[#5c5f6a]">
            <Clock className="w-3.5 h-3.5 text-[#9e7a4b]" />
            <span>
              <strong className="text-[#141518]">International Grade Certification:</strong> Trinity College London & Rockschool exam preparation tracks are in <span className="text-[#9e7a4b] font-semibold">Coming Soon</span> mode.
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 pt-8 border-t border-[#eae6de]">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-[#eae6de] shadow-xs flex flex-col items-center justify-center hover:border-[#b89562]/40 hover:shadow-md transition-all"
              >
                <Icon className="w-5 h-5 text-[#9e7a4b] mb-2" />
                <span
                  className={`text-xl sm:text-2xl font-bold text-[#141518] font-mono ${
                    stat.isComingSoon ? 'text-[#9e7a4b] text-base sm:text-lg' : ''
                  }`}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-[#5c5f6a] mt-1 text-center font-medium">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. INTERACTIVE PIANO STUDIO SECTION */}
      <section className="relative my-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.3em] font-semibold">
            Interactive Experience
          </p>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight mt-1 text-[#141518]">
            Touch, Play & Feel The Sound
          </h2>
          <p className="text-[#5c5f6a] text-xs sm:text-sm max-w-xl mx-auto mt-2">
            Try our Web Audio synthesized keyboard below. Experience the responsiveness and harmonic warmth that every Melophile student learns to harness.
          </p>
        </div>

        {/* Piano Component */}
        <InteractivePiano3D />

        {/* Chord Library Banner Card */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#f4efe6] via-[#f9f6f0] to-[#f4efe6] border border-[#e5dcce] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#141518] text-[#c5a880] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141518]/08 text-[#9e7a4b] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                New Harmony Lab
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-[#141518]">
                Interactive Chord Library & Progression Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5f6a] max-w-xl mt-1">
                Explore diatonic triads, 7th chords, R&B cadences, Neo-Soul loops, and cinematic film score voicings with live audio synthesis and visual voicing inspect.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(650);
              onNavigate('chords');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full md:w-auto px-6 py-3.5 rounded-full bg-[#141518] text-white hover:bg-[#2b2d35] text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center gap-2 shrink-0 group"
          >
            <span>Explore Chords & Progressions</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* 3. CORE PILLARS / WHY CHOOSE MELOPHILE */}
      <section className="relative my-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.3em] font-semibold">
            The Melophile Philosophy
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight mt-1 text-[#141518]">
            Crafting Complete Musicians
          </h2>
          <p className="text-[#5c5f6a] text-sm max-w-2xl mx-auto mt-2">
            A decade of refined pedagogical methods cultivating finger precision, harmonic understanding, and authentic creative confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-[#eae6de] shadow-xs hover:border-[#b89562]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f4efe6] border border-[#e5dcce] flex items-center justify-center text-[#9e7a4b] mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-[#141518] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-[#5c5f6a] leading-relaxed text-sm">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CURATED DISCIPLINES SNAPSHOT */}
      <section className="relative my-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.3em] font-semibold">
              Curriculum Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight mt-1 text-[#141518]">
              Signature Programs
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-2 text-[#9e7a4b] font-medium text-sm hover:text-[#141518] transition-colors cursor-pointer"
          >
            View all courses & syllabi <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDisciplines.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-[#eae6de] shadow-xs hover:border-[#b89562]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#e5dcce] text-[#8a6839] bg-[#f4efe6] mb-3">
                  {item.badge}
                </span>
                <h3 className="text-lg font-medium text-[#141518] mb-1">{item.title}</h3>
                <p className="text-xs text-[#9e7a4b] font-mono mb-2 font-medium">
                  {item.level}
                </p>
                <div className="mb-3">
                  <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-[#f5f3ef] text-[#5c5f6a] border border-[#e2ded5]">
                    {item.examStatus}
                  </span>
                </div>
                <p className="text-[#5c5f6a] text-xs sm:text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#f5f3ef] hover:bg-[#141518] hover:text-white text-[#141518] transition-colors cursor-pointer border border-[#e2ded5]"
              >
                Course Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="relative my-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.3em] font-semibold">
            Student Stories
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight mt-1 text-[#141518]">
            Words from Our Students
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Aditi Varma',
              role: 'Advanced Piano Student',
              quote:
                'Praveen sir made complex classical dynamics and sight-reading effortless. His patience and ear for micro-tonality transformed how I understand music.',
              rating: 5,
            },
            {
              name: 'Karthik Menon',
              role: 'Independent Film Music Composer',
              quote:
                'I joined Melophile for keyboard harmony and production. Within a year, my chord voicing and modulation skills leapt to professional cinematic quality.',
              rating: 5,
            },
            {
              name: 'Dr. Shalini Rao',
              role: 'Adult Piano Learner & Parent',
              quote:
                'Both my 10-year-old son and I take lessons at Melophile. Praveen sir creates an encouraging, pressure-free yet disciplined environment where true love for music flourishes.',
              rating: 5,
            },
          ].map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-[#eae6de] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[#9e7a4b] mb-4">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[#4a4d56] text-sm leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>
              <div className="border-t border-[#eae6de] pt-4">
                <h4 className="font-medium text-[#141518] text-sm">{t.name}</h4>
                <p className="text-xs text-[#9e7a4b] font-medium">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM BANNER */}
      <section className="relative my-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#ffffff] via-[#f7f5f0] to-[#eeeae2] border border-[#e2ded5] shadow-lg text-center overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#141518] tracking-tight mb-3">
              Begin Your Musical Journey
            </h2>
            <p className="text-[#5c5f6a] text-sm max-w-lg mx-auto mb-8">
              Schedule a complimentary 30-minute consultation and introductory session with instructor Praveen Raj R.
            </p>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(720);
                onBookTrial();
              }}
              className="px-8 py-3.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.01] active:scale-95"
            >
              Reserve Your Complimentary Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

