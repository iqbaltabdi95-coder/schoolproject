import React from 'react';
import { SchoolConfig, ProgramItem } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Cpu, Globe, ShieldCheck, Trophy, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProgramsSectionProps {
  config: SchoolConfig;
  programs: ProgramItem[];
  onOpenPPDB: () => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ config, programs, onOpenPPDB }) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-indigo-500" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-cyan-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-amber-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-500" />;
    }
  };

  return (
    <section id="program" className="scroll-mt-20 pt-7 sm:pt-8 pb-16 sm:pb-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kurikulum Unggulan & Ekosistem Prestasi</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 ${font.headingClass}`}>
            Empat Pilar Program Unggulan di{' '}
            <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
              {config.name}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Kurikulum kami dirancang untuk memicu rasa ingin tahu, melatih nalar kritis, dan mengasah potensi kepemimpinan setiap peserta didik secara menyeluruh.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program) => (
            <div 
              key={program.id}
              className="group p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(program.iconName)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {program.tagline}
                  </span>
                </div>

                <h3 className={`text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 ${font.headingClass}`}>
                  {program.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {program.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-200/70">
                  {program.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 flex items-center justify-between">
                <button
                  onClick={onOpenPPDB}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer group-hover:translate-x-1"
                >
                  <span>Daftar Melalui Jalur Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
