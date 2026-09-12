import React from 'react';
import { SchoolConfig, TestimonialItem } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Quote, Star, Sparkles } from 'lucide-react';

interface TestimoniSectionProps {
  config: SchoolConfig;
  testimonials: TestimonialItem[];
}

export const TestimoniSection: React.FC<TestimoniSectionProps> = ({ config, testimonials }) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Suara Komunitas & Rekam Jejak</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 ${font.headingClass}`}>
            Pengalaman Nyata di{' '}
            <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
              {config.name}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Kisah kebanggaan para alumni, rasa aman para orang tua, dan dinamika ruang belajar para peserta didik kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-8 h-8 text-amber-400 opacity-80" />
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{testi.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                <img
                  src={testi.avatar}
                  alt={testi.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {testi.name}
                  </h4>
                  <p className="text-xs text-indigo-600 font-medium">
                    {testi.role}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {testi.currentAffiliation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
