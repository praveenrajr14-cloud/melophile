import React from 'react';
import { Logo } from './Logo';
import { soundEngine } from '../utils/audioSynth';
import { InstagramIcon, WhatsAppIcon } from './SocialIcons';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const instagramUrl = 'https://www.instagram.com/melophileacademy_?utm_source=qr&stkn=MWw5eXZxY2pqNzIwZQ==';
  const whatsappUrl = 'https://wa.me/917356146076?text=Hi%20Melophile%20Academy,%20I%20would%20like%20to%20inquire%20about%20music%20classes.';

  return (
    <footer className="relative z-10 bg-[#f3f0ea] border-t border-[#e2ded5] text-[#5c5f6a] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1 & 2: Academy Info & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer inline-block"
            >
              <Logo size="lg" showSubtitle={true} />
            </div>
            <p className="text-sm text-[#5c5f6a] leading-relaxed max-w-sm mt-4">
              Led by master instructor <strong className="text-[#141518]">Praveen Raj R</strong> with over a decade of teaching excellence. Developing musical sensibility, technique, and creative confidence in Parassala, TVM.
            </p>

            {/* Social badges: Instagram & WhatsApp */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Melophile Academy on Instagram"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-[#faf8f5] border border-[#ded9cf] text-xs font-medium text-[#141518] hover:text-[#E1306C] transition-colors shadow-2xs group"
              >
                <InstagramIcon className="w-4 h-4 text-[#E1306C] transition-transform group-hover:scale-110" />
                <span>@melophileacademy_</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Melophile Academy on WhatsApp"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs font-semibold text-emerald-800 transition-colors shadow-2xs group"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] transition-transform group-hover:scale-110" />
                <span>+91 7356146076</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#9e7a4b] pt-1 font-medium">
              <Clock className="w-4 h-4 text-[#9e7a4b] shrink-0" />
              <span>International Board Exam Curriculum (Trinity / Rockschool) — Coming Soon</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#141518] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Instructor' },
                { id: 'courses', label: 'Courses & Fees' },
                { id: 'chords', label: 'Chord Library & Lab' },
                { id: 'contact', label: 'Contact & Trial' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(500);
                      onNavigate(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#141518] transition-colors cursor-pointer text-[#5c5f6a]"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Programs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#141518] mb-4">
              Curriculum
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5c5f6a]">
              <li>Keyboard (Electronic & Modern)</li>
              <li>Piano (Classical & Contemporary)</li>
              <li>Music Theory & Sight Reading</li>
              <li>Ear Training & Improvisation</li>
              <li>Online & Offline Formats</li>
            </ul>
          </div>

          {/* Col 5: Studio Address */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#141518] mb-4">
              Parassala Studio
            </h4>
            <div className="space-y-3 text-sm text-[#5c5f6a]">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9e7a4b] shrink-0 mt-0.5" />
                <span>Melophile Academy, Main Road, Parassala, Thiruvananthapuram, Kerala - 695502</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9e7a4b] shrink-0" />
                <a href="tel:+917356146076" className="hover:text-[#141518] transition-colors">
                  +91 7356146076
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors font-medium text-[#141518]"
                >
                  WhatsApp: +91 7356146076
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-[#E1306C] shrink-0" />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E1306C] transition-colors"
                >
                  @melophileacademy_
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9e7a4b] shrink-0" />
                <span>contact@melophile.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-[#e2ded5] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b6e7b] gap-4">
          <p>© {new Date().getFullYear()} Melophile Music Academy — <em>The sound of love</em>. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Mentorship by <strong className="text-[#141518]">Praveen Raj R</strong> (10+ Yrs Exp) • Parassala | TVM
          </p>
        </div>
      </div>
    </footer>
  );
};


