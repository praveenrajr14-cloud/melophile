import React from 'react';
import { CheckCircle, Clock, MapPin } from 'lucide-react';

interface AboutPageProps {
  onBookTrial: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBookTrial }) => {
  const credentials = [
    '10+ Years of Dedicated Musical & Pedagogical Mastery',
    'Pianist, Multi-Instrumentalist & Film Composer',
    'Mentored Over 150+ Dedicated Students Across All Age Groups',
    'Western Classical, Jazz, Contemporary Pop & Audio Production',
    'International Grade Certification (Trinity & Rockschool) — Coming Soon',
    'Studio Located in Parassala, Trivandrum (TVM), Kerala',
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Inception of Melophile Music Academy',
      desc: 'Praveen Raj R established Melophile in Parassala, TVM with an acoustic piano and a vision to make structured, compassionate music education accessible.',
    },
    {
      year: '2017',
      title: 'Curriculum & Technique Lab',
      desc: 'Formulated our signature finger-dexterity, ear-training, and sight-reading modules, building early confidence in students performing complex classical and pop works.',
    },
    {
      year: '2020',
      title: 'Global Remote Studio Launch',
      desc: 'Expanded digital broadcast capabilities to train talented students across the US, UK, Middle East, and beyond in real-time high-definition audio.',
    },
    {
      year: '2023',
      title: 'DAW & Music Production Wing',
      desc: 'Inaugurated our multi-track recording wing, teaching students how to bridge acoustic piano dexterity with modern music production and MIDI orchestration.',
    },
    {
      year: 'Upcoming',
      title: 'International Board Certification Track (Coming Soon)',
      desc: 'Affiliation with international exam boards (including Trinity College London & Rockschool) is currently in preparation for formal launch.',
    },
  ];

  const studioFeatures = [
    {
      title: 'Acoustic Grand & Uprights',
      desc: 'Authentic weighted wooden action so students develop finger dexterity, touch sensitivity, and harmonic ear precision.',
    },
    {
      title: 'Workstation Keyboards',
      desc: 'Experience modern sound synthesis, vintage electric pianos, organ drawbars, and layered synth patches.',
    },
    {
      title: 'Acoustically Isolated Suites',
      desc: 'Custom-designed acoustic dampening ensures students focus 100% on their tone and articulation without external noise.',
    },
    {
      title: 'Audio Recording & Playback',
      desc: 'High-definition stereo microphones allow instant recording of student rehearsals for objective feedback and portfolio building.',
    },
  ];

  return (
    <div className="relative w-full text-[#141518] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.35em] font-semibold mb-2">
          The Instructor & Academy
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#141518] mb-3">
          Meet Praveen Raj R
        </h1>
        <p className="max-w-xl mx-auto text-[#5c5f6a] text-sm sm:text-base leading-relaxed">
          Over a decade of dedicated pedagogy, shaping aspiring musicians into expressive, confident, and versatile artists.
        </p>
      </div>

      {/* Instructor Showcase Banner */}
      <div className="rounded-3xl bg-white border border-[#eae6de] shadow-sm p-8 sm:p-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Portrait Image */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border border-[#e2ded5] shadow-md bg-[#f5f3ef]">
              <img
                src="/instructor-hero.jpg"
                alt="Praveen Raj R"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="mt-5">
              <h3 className="text-xl font-medium text-[#141518]">PRAVEEN RAJ R</h3>
              <p className="text-xs text-[#9e7a4b] font-semibold uppercase tracking-widest mt-0.5">
                Founder & Lead Instructor
              </p>
              <p className="text-xs text-[#5c5f6a] mt-1 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9e7a4b]" />
                Parassala | TVM, Kerala
              </p>
            </div>
          </div>

          {/* Biography text */}
          <div className="lg:col-span-7">
            <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.3em] font-semibold mb-2">
              Teaching Philosophy
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#141518] mb-4">
              "Music is not merely muscle memory — it is learning how to speak with your soul."
            </h2>
            <div className="space-y-4 text-[#5c5f6a] text-sm sm:text-base leading-relaxed">
              <p>
                With over <strong className="text-[#141518]">10 years of professional teaching and performance experience</strong>, Praveen Raj R is renowned for his ability to demystify complex harmony and translate it into intuitive, expressive musicianship.
              </p>
              <p>
                Praveen has mentored students who have gone on to compose for independent films, lead live bands, or simply discover the meditative peace of acoustic piano playing after a long workday.
              </p>
              <p>
                Under his leadership, Melophile Music Academy in Parassala, TVM has grown into a benchmark music studio equipped with acoustic grand pianos, synth workstations, and recording facilities.
              </p>
            </div>

            {/* Credentials grid */}
            <div className="mt-8 pt-6 border-t border-[#eae6de] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {credentials.map((c, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#9e7a4b] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#4a4d56]">{c}</span>
                </div>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-6 p-4 rounded-xl bg-[#f4efe6] border border-[#e5dcce] flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#9e7a4b] shrink-0" />
              <p className="text-xs text-[#5c5f6a]">
                <strong className="text-[#141518]">International Grade Certification Track:</strong> Preparation for formal board examinations (including Trinity College London & Rockschool) is in progress and launching soon.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Year Timeline */}
      <div className="my-24">
        <div className="text-center mb-14">
          <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.3em] font-semibold mb-2">
            A Decade of Pedagogy
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#141518]">
            The Melophile Journey
          </h2>
        </div>

        <div className="relative border-l border-[#d5cebf] ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-10">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#9e7a4b] border-4 border-[#faf8f5]" />

              <span className="inline-block text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] border border-[#e5dcce] mb-2">
                {m.year}
              </span>

              <h3 className="text-lg font-medium text-[#141518] mb-1.5">{m.title}</h3>
              <p className="text-[#5c5f6a] text-sm leading-relaxed max-w-2xl">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Studio Facilities */}
      <div className="my-24">
        <div className="text-center mb-14">
          <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.3em] font-semibold mb-2">
            Infrastructure
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#141518]">
            Our Studio Environment
          </h2>
          <p className="text-[#5c5f6a] text-xs sm:text-sm max-w-lg mx-auto mt-2">
            Designed to stimulate acoustic warmth, creative experimentation, and stage-ready confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {studioFeatures.map((f, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-[#eae6de] shadow-xs hover:border-[#b89562]/40 hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-lg font-medium text-[#141518] mb-2">{f.title}</h3>
              <p className="text-[#5c5f6a] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <button
          type="button"
          onClick={onBookTrial}
          className="px-8 py-3.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-95"
        >
          Book An Introductory Session with Praveen
        </button>
      </div>
    </div>
  );
};

