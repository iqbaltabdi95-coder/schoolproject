import React from 'react';
import { SchoolConfig } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Quote, Sparkles, CheckCircle, HeartHandshake, Shield, Compass } from 'lucide-react';

interface SambutanSectionProps {
  config: SchoolConfig;
  onOpenVirtualTour: () => void;
}

export const SambutanSection: React.FC<SambutanSectionProps> = ({ config, onOpenVirtualTour }) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];
  const { principal } = config;

  return (
    <section id="sambutan" className="scroll-mt-20 pt-7 sm:pt-8 pb-16 sm:pb-20 bg-slate-50 relative overflow-hidden border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Photo with Elegant Frame & Quote Tag */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              
              {/* Decorative background shape */}
              <div 
                className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              />

              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                <img
                  src={principal.photo}
                  alt={principal.name}
                  className="w-full h-[460px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                    {principal.title}
                  </span>
                  <h4 className="text-xl font-bold">{principal.name}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{config.name}</p>
                </div>
              </div>

              {/* Floating Quote Badge */}
              <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] hidden sm:block">
                <Quote className="w-5 h-5 text-amber-500 mb-1" />
                <p className="text-[11px] text-slate-700 italic font-medium leading-snug">
                  "Menyalakan lentera budi pekerti dan rasa ingin tahu."
                </p>
              </div>

            </div>
          </div>

          {/* Right: Message Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Pesan Kepemimpinan Institusi</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 ${font.headingClass}`}>
              Sambutan Kepala Sekolah{' '}
              <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
                {config.name}
              </span>
            </h2>

            {/* Blockquote highlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-l-4 border-indigo-600 shadow-xs mb-6 w-full">
              <p className="text-sm sm:text-base font-semibold text-slate-800 italic leading-relaxed">
                "{principal.quote}"
              </p>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              {principal.message.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* 3 Core Values / Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4 border-t border-slate-200 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Ketakwaan</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Moral & spiritual luhur</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Kecendekiaan</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Kritis, riset, & inovatif</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Kepemimpinan</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Empati & dedikasi bangsa</p>
                </div>
              </div>
            </div>

            {/* Principal Signature & Sign-off */}
            <div className="flex items-center justify-between w-full pt-2">
              <div>
                <p className="text-xs text-slate-400 font-medium">Hormat kami,</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{principal.name}</p>
                <p className="text-xs text-slate-500">{principal.title} {config.name}</p>
              </div>

              <button
                onClick={onOpenVirtualTour}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Lihat Fasilitas Sekolah →
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
