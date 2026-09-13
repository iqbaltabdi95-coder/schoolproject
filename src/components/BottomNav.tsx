import React from 'react';
import { Home, BookOpen, GraduationCap, Award, Menu, X } from 'lucide-react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';

interface BottomNavProps {
  config: SchoolConfig;
  currentPage: PageView;
  activeSection: string;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigate: (page: PageView, anchor?: string) => void;
  onOpenPPDB: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  config,
  currentPage,
  activeSection,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onNavigate,
  onOpenPPDB,
}) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  const handleItemClick = (targetPage: PageView, anchor?: string) => {
    if (isMobileMenuOpen) {
      onToggleMobileMenu();
    }
    onNavigate(targetPage, anchor);
  };

  const isHomeActive = currentPage === 'home' && (activeSection === 'beranda' || !activeSection);
  const isProgramActive = currentPage === 'home' && activeSection === 'program';
  const isPrestasiActive = currentPage === 'home' && activeSection === 'prestasi';

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
            isHomeActive && !isMobileMenuOpen
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          style={isHomeActive && !isMobileMenuOpen ? { color: theme.primaryColor } : undefined}
          aria-label="Menuju Beranda"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </button>

        {/* 2. Program */}
        <button
          onClick={() => handleItemClick('home', '#program')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all cursor-pointer ${
            isProgramActive && !isMobileMenuOpen
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          style={isProgramActive && !isMobileMenuOpen ? { color: theme.primaryColor } : undefined}
          aria-label="Lihat Program Unggulan"
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Program</span>
        </button>

        {/* 3. Center Elevated PPDB CTA Button */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            onClick={() => {
              if (isMobileMenuOpen) onToggleMobileMenu();
              onOpenPPDB();
            }}
            className={`w-13 h-13 min-w-[48px] min-h-[48px] rounded-full text-white flex flex-col items-center justify-center shadow-lg transform active:scale-95 transition-all cursor-pointer ${theme.btnPrimary} ${theme.btnGlow} ring-4 ring-white`}
            aria-label="Buka Pendaftaran PPDB"
          >
            <GraduationCap className="w-6 h-6" />
          </button>
          <span className="text-[10px] font-bold text-slate-800 mt-0.5 tracking-tight">PPDB</span>
        </div>

        {/* 4. Prestasi */}
        <button
          onClick={() => handleItemClick('home', '#prestasi')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all cursor-pointer ${
            isPrestasiActive && !isMobileMenuOpen
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          style={isPrestasiActive && !isMobileMenuOpen ? { color: theme.primaryColor } : undefined}
          aria-label="Lihat Prestasi Siswa"
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Prestasi</span>
        </button>

        {/* 5. Menu Hamburger Drawer Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all cursor-pointer ${
            isMobileMenuOpen
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          style={isMobileMenuOpen ? { color: theme.primaryColor } : undefined}
          aria-label={isMobileMenuOpen ? 'Tutup Menu' : 'Buka Menu Lengkap'}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 mb-0.5 text-rose-500" />
          ) : (
            <Menu className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] tracking-tight">{isMobileMenuOpen ? 'Tutup' : 'Menu'}</span>
        </button>

      </div>
    </div>
  );
};
