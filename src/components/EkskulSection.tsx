import React, { useState } from 'react';
import { SchoolConfig, ExtracurricularItem } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Users, Clock, Award, Sparkles, UserCheck } from 'lucide-react';

interface EkskulSectionProps {
  config: SchoolConfig;
  ekskulList: ExtracurricularItem[];
}

export const EkskulSection: React.FC<EkskulSectionProps> = ({ config, ekskulList }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const categories = ['Semua', 'Sains & Riset', 'Seni & Budaya', 'Olahraga', 'Kepemimpinan'];

  const filtered = activeCategory === 'Semua'
    ? ekskulList
    : ekskulList.filter(e => e.category === activeCategory);

  return (
    <section id="ekskul" className="scroll-mt-20 pt-7 sm:pt-8 pb-16 sm:pb-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kesiswaan & Eksplorasi Minat Bakat</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 ${font.headingClass}`}>
            34+ Ekstrakurikuler Dinamis di{' '}
            <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
              {config.name}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Setiap siswa difasilitasi pelatih profesional, jadwal teratur, dan ruang unjuk talenta untuk menemukan passion sejati mereka.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === c
                  ? `${theme.btnPrimary} shadow-sm`
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Ekskul Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ek) => (
            <div 
              key={ek.id}
              className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={ek.image}
                    alt={ek.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800">
                    {ek.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 ${font.headingClass}`}>
                    {ek.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {ek.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">Pembina: {ek.coach}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{ek.schedule}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] font-semibold text-amber-900 flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{ek.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
