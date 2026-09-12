import React, { useState } from 'react';
import { SchoolConfig, FacilityItem } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Compass, CheckCircle2, Sparkles, Maximize2, Layers } from 'lucide-react';

interface FasilitasSectionProps {
  config: SchoolConfig;
  facilities: FacilityItem[];
  onOpenVirtualTour: () => void;
}

export const FasilitasSection: React.FC<FasilitasSectionProps> = ({ 
  config, 
  facilities,
  onOpenVirtualTour 
}) => {
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem>(facilities[0]);
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  return (
    <section id="fasilitas" className="scroll-mt-20 pt-7 sm:pt-8 pb-16 sm:pb-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 mb-3">
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>Infrastruktur & Lingkungan Belajar Digital</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 tracking-tight ${font.headingClass}`}>
              Fasilitas Modern Penunjang Kreativitas di{' '}
              <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
                {config.name}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Sarana dan prasarana terstandarisasi internasional untuk menjamin kenyamanan belajar, keamanan, dan eksplorasi sains terdepan.
            </p>
          </div>

          <button
            onClick={onOpenVirtualTour}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md cursor-pointer ${theme.btnPrimary}`}
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Virtual Tour 360°</span>
          </button>
        </div>

        {/* Interactive Facility Showcase (Featured View + Selector List) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Selected Image Stage */}
          <div className="lg:col-span-8 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
            <div className="relative h-[340px] sm:h-[420px] overflow-hidden bg-slate-900">
              <img 
                src={selectedFacility.image} 
                alt={selectedFacility.title}
                className="w-full h-full object-cover transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-900">
                {selectedFacility.category}
              </div>

              <button
                onClick={onOpenVirtualTour}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Lihat 360°</span>
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
                  {selectedFacility.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {selectedFacility.description}
                </p>

                {/* Features Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFacility.features.map((f, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-white"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick List Switcher */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pilihan Sarana Kampus
            </h4>
            {facilities.map((fac) => {
              const isSelected = fac.id === selectedFacility.id;
              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white/60 hover:bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {fac.category}
                    </span>
                    <h5 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {fac.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {fac.features[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
