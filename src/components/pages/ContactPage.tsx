import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth';
import { InstagramIcon, WhatsAppIcon } from '../SocialIcons';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react';

interface ContactPageProps {
  initialCourse?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialCourse = '',
}) => {
  const instagramUrl = 'https://www.instagram.com/melophileacademy_?utm_source=qr&stkn=MWw5eXZxY2pqNzIwZQ==';
  const whatsappUrl = 'https://wa.me/917356146076?text=Hi%20Melophile%20Music%20Academy,%20I%20would%20like%20to%20inquire%20about%20music%20classes.';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: initialCourse || 'Piano & Keyboard',
    level: 'Complete Beginner',
    mode: 'In-Studio (Offline)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick(800);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a880', '#e5c494', '#ffffff', '#22262d'],
      });
    } catch {
      // Ignored
    }

    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'Do I need to own a piano or guitar before taking my first lesson?',
      a: 'Not at all! You are welcome to take your first trial lesson at our Melophile studio in Parassala, TVM where we provide acoustic grand/upright pianos, keyboards, and acoustic guitars. During the trial, Praveen Raj R will also advise you on the best instrument to purchase for your budget.',
    },
    {
      q: 'When will international grade certifications (Trinity / Rockschool) become available?',
      a: 'Our formal examination track aligned with international boards (including Trinity College London and Rockschool) is currently in Coming Soon mode for our upcoming academic cycle. In the meantime, students master the exact technical scales, finger dexterity, and ear training required to excel when the exam sessions open.',
    },
    {
      q: 'What is the recommended age to start learning at Melophile?',
      a: 'We teach passionate students of all ages! Our junior programs welcome children as young as 5.5 years old, while adult learners (working professionals, college students, and hobbyists) make up a significant part of our academy.',
    },
    {
      q: 'Are online lessons effective for acoustic instruments?',
      a: 'Yes! Our studio uses high-fidelity multi-angle cameras and dedicated stereo microphones with direct DAW audio streaming, giving remote students crystal-clear audio fidelity and overhead fingerboard views.',
    },
    {
      q: 'Where is the studio located?',
      a: 'Melophile Music Academy is conveniently located in Parassala, Thiruvananthapuram (TVM), Kerala with parking and easy access.',
    },
  ];

  return (
    <div className="relative w-full text-[#141518] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.35em] font-semibold mb-2">
          Contact & Enrollment
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#141518] mb-3">
          Book Your Free Trial
        </h1>
        <p className="max-w-xl mx-auto text-[#5c5f6a] text-sm sm:text-base leading-relaxed">
          Take the first step toward musical fluency. Schedule a complimentary 30-minute consultation and trial lesson at our studio or online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-24">
        {/* Contact Info & Studio details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-2xl bg-white border border-[#eae6de] shadow-xs">
            <h3 className="text-xl font-medium text-[#141518] mb-6">
              Studio Details
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f4efe6] border border-[#e5dcce] flex items-center justify-center text-[#9e7a4b] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#8a6839]">
                    Location
                  </h4>
                  <p className="text-sm font-medium text-[#141518] mt-0.5">
                    Melophile Music Academy
                  </p>
                  <p className="text-xs text-[#5c5f6a] leading-relaxed">
                    Parassala, Thiruvananthapuram (TVM), Kerala, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0">
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-emerald-800">
                    Direct WhatsApp & Call
                  </h4>
                  <p className="text-sm font-semibold text-[#141518] mt-0.5">
                    +91 7356146076
                  </p>
                  <p className="text-xs text-[#5c5f6a] mb-2">
                    Instant response from Praveen Raj R
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-xs transition-transform hover:scale-105"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E1306C]/10 border border-[#E1306C]/30 flex items-center justify-center text-[#E1306C] shrink-0">
                  <InstagramIcon className="w-5 h-5 text-[#E1306C]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-rose-800">
                    Official Instagram
                  </h4>
                  <p className="text-sm font-semibold text-[#141518] mt-0.5">
                    @melophileacademy_
                  </p>
                  <p className="text-xs text-[#5c5f6a] mb-2">
                    Student recitals, piano videos & reels
                  </p>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white text-xs font-semibold shadow-xs transition-transform hover:scale-105"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Follow on Instagram</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f4efe6] border border-[#e5dcce] flex items-center justify-center text-[#9e7a4b] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#8a6839]">
                    Email
                  </h4>
                  <p className="text-sm font-medium text-[#141518] mt-0.5">
                    contact@melophile.com
                  </p>
                  <p className="text-xs text-[#5c5f6a]">
                    Direct: praveen@melophile.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f4efe6] border border-[#e5dcce] flex items-center justify-center text-[#9e7a4b] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#8a6839]">
                    Studio Timings
                  </h4>
                  <p className="text-sm font-medium text-[#141518] mt-0.5">
                    Monday – Saturday: 9:00 AM – 8:30 PM
                  </p>
                  <p className="text-xs text-[#5c5f6a]">
                    Sunday: Special Masterclasses
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-6 rounded-2xl bg-[#f4efe6] border border-[#e5dcce]">
            <h4 className="text-sm font-medium text-[#8a6839] mb-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#9e7a4b]" />
              Complimentary 30-Minute Trial
            </h4>
            <p className="text-xs text-[#5c5f6a] leading-relaxed">
              No instrument or prior music knowledge required. Meet Praveen Raj R and discover your personalized learning pathway.
            </p>
          </div>
        </div>

        {/* Interactive Booking Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#eae6de] shadow-xs">
            {submitted ? (
              <div className="text-center py-10 space-y-5 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-[#f4efe6] border border-[#e5dcce] text-[#9e7a4b] mx-auto flex items-center justify-center">
                  <CalendarCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-normal text-[#141518]">
                  Trial Lesson Booked
                </h3>
                <p className="text-[#5c5f6a] max-w-md mx-auto text-sm leading-relaxed">
                  Thank you, <strong className="text-[#141518]">{formData.name}</strong>! We have received your inquiry for the{' '}
                  <strong className="text-[#9e7a4b]">{formData.course}</strong> course.
                </p>
                <div className="p-4 rounded-xl bg-[#f5f3ef] border border-[#e2ded5] max-w-sm mx-auto text-left text-xs text-[#4a4d56] space-y-1 font-mono">
                  <div>• Student: {formData.name}</div>
                  <div>• Instrument: {formData.course}</div>
                  <div>• Level: {formData.level}</div>
                  <div>• Mode: {formData.mode}</div>
                  <div>• Phone: {formData.phone}</div>
                </div>
                <p className="text-xs text-[#9e7a4b] font-medium">
                  We will contact you via WhatsApp / Phone within 4 business hours to finalize your exact slot!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-full border border-[#eae6de] hover:border-[#141518] text-[#141518] text-xs font-medium cursor-pointer transition-colors"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-[#eae6de] pb-3 mb-2">
                  <h3 className="text-xl font-medium text-[#141518] tracking-tight">
                    Reserve Your Free 30-Min Trial
                  </h3>
                  <p className="text-xs text-[#5c5f6a] mt-1">
                    Fill in your details below to schedule your personalized session.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:bg-white transition-colors"
                  />
                </div>

                {/* Email & Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 Phone"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Course & Level grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                      Course of Interest
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm focus:outline-none focus:border-[#9e7a4b] focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="Piano & Keyboard">Piano & Keyboard</option>
                      <option value="Acoustic Fingerstyle Guitar">
                        Acoustic Fingerstyle Guitar
                      </option>
                      <option value="Electric Guitar & Soloing">
                        Electric Guitar & Soloing
                      </option>
                      <option value="Western Contemporary Vocals">
                        Western Contemporary Vocals
                      </option>
                      <option value="Applied Music Theory">
                        Applied Music Theory
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                      Experience Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm focus:outline-none focus:border-[#9e7a4b] focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="Complete Beginner">
                        Complete Beginner (No prior experience)
                      </option>
                      <option value="Elementary (Under 1 year)">
                        Elementary (Under 1 year)
                      </option>
                      <option value="Intermediate">
                        Intermediate
                      </option>
                      <option value="Advanced">
                        Advanced
                      </option>
                    </select>
                  </div>
                </div>

                {/* Learning Mode */}
                <div>
                  <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                    Preferred Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['In-Studio (Parassala, TVM)', 'Live Online (HD Audio)'].map(
                      (modeOption) => (
                        <button
                          key={modeOption}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, mode: modeOption })
                          }
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            formData.mode === modeOption
                              ? 'bg-[#141518] border-[#141518] text-white shadow-xs'
                              : 'bg-[#f5f3ef] border-[#e2ded5] text-[#5c5f6a] hover:text-[#141518]'
                          }`}
                        >
                          {modeOption}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                    Your Musical Goals (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us what songs, styles, or goals you want to conquer..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  Confirm & Schedule Free Trial
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="my-20">
        <div className="text-center mb-12">
          <p className="text-[#9e7a4b] text-xs uppercase tracking-[0.35em] font-semibold mb-2">
            Got Questions?
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#141518]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-[#eae6de] shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-medium text-[#141518] text-sm hover:text-[#9e7a4b] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#9e7a4b] shrink-0 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-[#5c5f6a] text-xs sm:text-sm leading-relaxed border-t border-[#eae6de] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

