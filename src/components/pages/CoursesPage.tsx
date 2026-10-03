import React, { useState } from 'react';
import {
  Users,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

interface Course {
  id: string;
  category: 'keyboard' | 'guitar' | 'vocals' | 'production';
  title: string;
  level: string;
  duration: string;
  format: string;
  exam: string;
  description: string;
  modules: string[];
  popular?: boolean;
}

interface CoursesPageProps {
  onSelectCourse: (courseTitle: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onSelectCourse }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'keyboard', label: 'Piano & Keyboard' },
    { id: 'guitar', label: 'Guitars' },
    { id: 'vocals', label: 'Vocals' },
    { id: 'production', label: 'Music Theory & Tech' },
  ];

  const courses: Course[] = [
    {
      id: 'piano-classical',
      category: 'keyboard',
      title: 'Classical Piano & Western Repertoire',
      level: 'Beginner to Advanced',
      duration: 'Weekly 1-on-1 Sessions',
      format: 'Personalized 1-on-1',
      exam: 'Grade Certification: Coming Soon',
      popular: true,
      description:
        'Structured classical piano training focusing on finger articulation, touch dynamics, polyphonic independence, sight reading, and masterworks from Bach to Debussy.',
      modules: [
        'Hanon & Czerny finger dexterity and posture mechanics',
        'Sight-reading notation and aural pitch calibration',
        'Classical, Baroque, Romantic & 20th Century repertoire',
        'Grade Examination Syllabus (Trinity / ABRSM Alignment) — Coming Soon',
      ],
    },
    {
      id: 'keyboard-contemporary',
      category: 'keyboard',
      title: 'Contemporary Keyboard, Jazz & Pop Voicing',
      level: 'Intermediate to Advanced',
      duration: 'Flexible Schedule',
      format: 'Personalized 1-on-1',
      exam: 'Modern Exam Track: Coming Soon',
      description:
        'Learn how professional session keyboardists play. Master rich 7th/9th/11th chord extensions, lead sheet improvisation, pop accompaniment, and synth playing.',
      modules: [
        'Advanced chord substitutions and II-V-I progressions',
        'Rhythmic comping patterns across Pop, Funk, R&B and Ballads',
        'Improvisation using pentatonic, blues, and modal scales',
        'Synthesizer sound design, layering, and split-key performance',
      ],
    },
    {
      id: 'guitar-acoustic',
      category: 'guitar',
      title: 'Acoustic Fingerstyle & Classical Guitar',
      level: 'Beginner to Advanced',
      duration: 'Weekly 1-on-1 Sessions',
      format: '1-on-1 or Small Batch',
      exam: 'Acoustic Exam Prep: Coming Soon',
      popular: true,
      description:
        'Master the organic warmth of acoustic guitar. Build clean fingerpicking agility, fretboard geography, percussive tapping, and lyrical chord melodies.',
      modules: [
        'Right-hand fingerpicking accuracy and thumb-bass independence',
        'Open, barre, and suspended chord transitions',
        'Travis picking, folk, and contemporary fingerstyle pieces',
        'Reading standard staff notation and guitar tablature (TAB)',
      ],
    },
    {
      id: 'guitar-electric',
      category: 'guitar',
      title: 'Electric Guitar: Riffs, Solos & Tone Shaping',
      level: 'All Levels',
      duration: 'Weekly Sessions',
      format: 'Personalized 1-on-1',
      exam: 'Rock Guitar Certification: Coming Soon',
      description:
        'From explosive rock riffs to soulful blues bends. Develop lighting-fast alternate picking, expressive vibrato, modal theory, and professional tone shaping.',
      modules: [
        'Alternate picking, sweep picking, and legato soloing',
        'Pentatonic, blues, and modal scale fluency across the fretboard',
        'Bending, vibrato, slide, and tone pedal staging',
        'Amplifier modeling, drive pedal staging, and FX chains',
      ],
    },
    {
      id: 'vocals-contemporary',
      category: 'vocals',
      title: 'Western Contemporary Vocal Coaching',
      level: 'Beginner to Advanced',
      duration: 'Weekly 1-on-1 Sessions',
      format: 'Exclusive 1-on-1',
      exam: 'Vocal Exam Prep: Coming Soon',
      popular: true,
      description:
        'Discover your authentic singing voice without straining. Learn scientific diaphragmatic breathing, vocal register blending, pitch control, and microphone presence.',
      modules: [
        'Diaphragmatic breath support and vocal cord decompression',
        'Smooth chest voice to head voice mixed-voice transitions',
        'Pitch stabilization and microtonal interval ear training',
        'Studio microphone technique, resonance, and stage charisma',
      ],
    },
    {
      id: 'music-production',
      category: 'production',
      title: 'Audio Production, DAWs & Beat Design',
      level: 'Beginner to Professional',
      duration: '8 - 16 Week Immersive',
      format: 'Studio Mentorship',
      exam: 'Melophile Studio Certified',
      description:
        'Turn your musical ideas into radio-ready tracks. Master DAWs like Logic Pro, Ableton, and FL Studio, alongside MIDI sequencing, sound synthesis, and mixing.',
      modules: [
        'DAW workflows, audio recording, and MIDI programming',
        'Synthesizer sound design (Subtractive, FM, Wavetable)',
        'Vocal production, tuning, automation, and layering',
        'EQ, compression, spatial reverb/delay, and mastering chains',
      ],
    },
    {
      id: 'music-theory',
      category: 'production',
      title: 'Applied Music Theory & Ear Training',
      level: 'Foundational to Advanced',
      duration: 'Weekly Classes',
      format: 'Small Interactive Groups',
      exam: 'Theory Exam Syllabus: Coming Soon',
      description:
        'Demystify the language of music. Understand why chords evoke specific emotions, transpose songs on the fly, and transcribe music solely by ear.',
      modules: [
        'Scales, keys, modes, and the circle of fifths',
        'Chord construction, inversions, voice leading, and cadences',
        'Aural interval identification and rhythmic dictation',
        'Formal Board Theory Exam Tracks — Coming Soon',
      ],
    },
  ];

  const filteredCourses =
    activeCategory === 'all'
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="relative w-full text-[#141518] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.35em] font-semibold mb-2">
          Curriculum & Offerings
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#141518] mb-3">
          Academic Programs
        </h1>
        <p className="max-w-xl mx-auto text-[#5c5f6a] text-sm sm:text-base leading-relaxed">
          Structured 1-on-1 mentorship for beginners taking their first steps to advanced musicians refining their technical fluency.
        </p>

        {/* Global Notice */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4efe6] border border-[#e5dcce] text-xs text-[#5c5f6a]">
          <Clock className="w-3.5 h-3.5 text-[#9e7a4b]" />
          <span>Notice: Formal international grade examination modules (Trinity / Rockschool) are in preparation and launching soon.</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundEngine.playClick(600);
                setActiveCategory(cat.id);
              }}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#141518] text-white font-semibold shadow-xs'
                  : 'bg-white text-[#5c5f6a] hover:text-[#141518] hover:bg-[#ede8e0] border border-[#eae6de]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="relative rounded-2xl bg-white border border-[#eae6de] shadow-xs hover:border-[#b89562]/40 hover:shadow-md p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
          >
            {course.popular && (
              <span className="absolute -top-2.5 right-6 text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-[#9e7a4b] text-white shadow-xs">
                Popular
              </span>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-mono font-medium text-[#8a6839] bg-[#f4efe6] border border-[#e5dcce] px-2 py-0.5 rounded">
                  {course.level}
                </span>
                <span className="text-xs text-[#5c5f6a] flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3 text-[#9e7a4b]" />
                  {course.format}
                </span>
              </div>

              <h3 className="text-xl font-medium text-[#141518] mb-2">
                {course.title}
              </h3>

              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#5c5f6a] bg-[#f5f3ef] border border-[#e2ded5] px-2.5 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-[#9e7a4b]" />
                  {course.exam}
                </span>
              </div>

              <p className="text-[#5c5f6a] text-sm leading-relaxed mb-6">
                {course.description}
              </p>

              {/* Module Highlights */}
              <div className="space-y-1.5 mb-8 pt-4 border-t border-[#eae6de]">
                <h4 className="text-[11px] font-semibold text-[#141518] uppercase tracking-wider mb-2">
                  Syllabus Highlights:
                </h4>
                {course.modules.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#4a4d56]">
                    <span className="text-[#9e7a4b] font-bold">•</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(680);
                onSelectCourse(course.title);
              }}
              className="w-full py-3 rounded-xl border border-[#141518] hover:bg-[#141518] hover:text-white text-[#141518] font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              Enroll / Book Free Trial
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

