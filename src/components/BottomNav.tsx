import React from 'react';
import { Home, BookOpen, GraduationCap, Award, Sparkles } from 'lucide-react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';

interface BottomNavProps {
  config: SchoolConfig;
  currentPage: PageView;
  activeSection: string;
  onNavigate: (page: PageView, anchor?: string) => void;
  onOpenPPDB: () => void;
  onOpenCustomizer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  config,
  currentPage,
  activeSection,
  onNavigate,
  onOpenPPDB,
  onOpenCustomizer,
}) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  const handleItemClick = (targetPage: PageView, anchor?: string) => {
    onNavigate(targetPage, anchor);
  };

  const isHomeActive = currentPage === 'home' && (activeSection === 'beranda' || !activeSection);
  const isProgramActive = currentPage === 'home' && activeSection === 'program';
  const isPrestasiActive = currentPage === 'home' && activeSection === 'prestasi';
  const isPPDBActive = currentPage === 'layanan';

  return (
    <div 
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-safe transition-all duration-300"
    >
      <div className="grid grid-cols-5 items-center justify-around px-2 py-1 max-w-lg mx-auto">
        
        {/* 1. Beranda */}
        <button
          onClick={() => handleItemClick('home', '#beranda')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all cursor-pointer ${
            isHomeActive
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          style={isHomeActive ? { color: theme.primaryColor } : undefined}
          aria-label="Menuju Beranda"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </button>

        {/* 2. Program */}
        <button
          onClick={() => handleItemClick('home', '#program')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all cursor-pointer ${
            isProgramActive
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          style={isProgramActive ? { color: theme.primaryColor } : undefined}
          aria-label="Lihat Program Unggulan"
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Program</span>
        </button>

        {/* 3. Center Elevated Mode Presentasi (Ubah Profil Sekolah) - WCAG 2.5.5 (Min 48x48px touch target) */}
        <button
          id="btn-bottom-customizer"
          onClick={onOpenCustomizer}
          className="flex flex-col items-center justify-center -mt-6 group cursor-pointer min-w-[56px] min-h-[56px] p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl"
          aria-label="Mode Presentasi: Ubah Profil Sekolah"
          title="Ubah Profil Sekolah & Tema Warna"
        >
          <div className="w-13 h-13 min-w-[50px] min-h-[50px] rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 group-active:scale-95 transition-transform ring-4 ring-white">
            <Sparkles className="w-6 h-6 animate-spin-slow text-slate-950" />
          </div>
          <span className="text-[10px] font-black text-amber-800 mt-0.5 tracking-tight select-none">
            Ubah Profil
          </span>
        </button>

        {/* 4. PPDB Menu Item */}
        <button
          id="btn-bottom-ppdb"
          onClick={onOpenPPDB}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all cursor-pointer ${
            isPPDBActive
              ? 'text-indigo-600 font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
          style={isPPDBActive ? { color: theme.primaryColor } : undefined}
          aria-label="Buka Pendaftaran PPDB"
        >
          <div className="relative">
            <GraduationCap className="w-5 h-5 mb-0.5 text-indigo-600" style={{ color: theme.primaryColor }} />
            <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <span className="text-[10px] tracking-tight font-bold text-slate-800">PPDB</span>
        </button>

        {/* 5. Prestasi */}
        <button
          onClick={() => handleItemClick('home', '#prestasi')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all cursor-pointer ${
            isPrestasiActive
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          style={isPrestasiActive ? { color: theme.primaryColor } : undefined}
          aria-label="Lihat Prestasi Siswa"
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Prestasi</span>
        </button>

      </div>
    </div>
  );
};
