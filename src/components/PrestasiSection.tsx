import React, { useState } from 'react';
import { SchoolConfig, AchievementItem } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Award, Trophy, Medal, Sparkles, Filter, ExternalLink } from 'lucide-react';

interface PrestasiSectionProps {
  config: SchoolConfig;
  achievements: AchievementItem[];
}

export const PrestasiSection: React.FC<PrestasiSectionProps> = ({ config, achievements }) => {
  const [activeTab, setActiveTab] = useState<string>('Semua');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const categories = ['Semua', 'Internasional', 'Nasional', 'Sains', 'Seni & Olahraga'];

  const filteredAchievements = activeTab === 'Semua' 
    ? achievements 
    : achievements.filter(a => a.category === activeTab);

  return (
    <section id="prestasi" className="scroll-mt-20 pt-7 sm:pt-8 pb-16 sm:pb-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Rekam Jejak Keberhasilan Siswa</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 tracking-tight ${font.headingClass}`}>
              Prestasi Membanggakan Siswa{' '}
              <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
                {config.name}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Dedikasi tanpa henti para siswa yang dibimbing secara intensif oleh guru dan pembina berdedikasi tinggi hingga panggung dunia.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === cat
                    ? `${theme.btnPrimary} shadow-sm`
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAchievement(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Badge Category */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm">
                  {item.category}
                </div>

                {/* Badge Year */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-400">
                  {item.year}
                </div>

                {/* Badge Prize */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <Medal className="w-4 h-4" />
                  <span className="truncate">{item.badge}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Kompetisi: <span className="text-slate-700">{item.competition}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Peraih: <span className="text-indigo-600 font-bold">{item.studentName}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Lihat Detail Prestasi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail Prestasi */}
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95">
              <div className="relative h-56">
                <img 
                  src={selectedAchievement.image} 
                  alt={selectedAchievement.title}
                  className="w-full h-full object-cover" 
                />
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 cursor-pointer"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Medal className="w-4 h-4" />
                  <span>{selectedAchievement.badge}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-bold text-indigo-600">{selectedAchievement.category}</span>
                  <span>•</span>
                  <span>Tahun {selectedAchievement.year}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {selectedAchievement.title}
                </h3>

                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 mb-6">
                  <p><strong>Ajang / Penyelenggara:</strong> {selectedAchievement.competition}</p>
                  <p><strong>Nama Peserta Didik:</strong> {selectedAchievement.studentName}</p>
                  <p><strong>Institusi Asal:</strong> {config.name}</p>
                </div>

                <button
                  onClick={() => setSelectedAchievement(null)}
                  className={`w-full py-3 rounded-xl font-bold text-sm text-white ${theme.btnPrimary} cursor-pointer`}
                >
                  Tutup Informasi
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
