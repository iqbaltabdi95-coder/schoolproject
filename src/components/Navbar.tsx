import React, { useState, useEffect, useRef } from 'react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Menu, X, ChevronDown, GraduationCap, Sparkles, Award, BookOpen, Layers, Users, PhoneCall, UserCheck } from 'lucide-react';

interface NavbarProps {
  config: SchoolConfig;
  onOpenCustomizer: () => void;
  onOpenPPDB: () => void;
  onOpenVirtualTour: () => void;
  currentPage?: PageView;
  onNavigate?: (page: PageView, scrollToTop?: boolean) => void;
}

const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', mobileLabel: 'Beranda Utama', anchor: '#beranda' },
  { id: 'sambutan', label: 'Profil', mobileLabel: 'Profil & Sambutan Kepala Sekolah', anchor: '#sambutan' },
  { id: 'program', label: 'Program', mobileLabel: 'Program Unggulan', anchor: '#program' },
  { id: 'prestasi', label: 'Prestasi', mobileLabel: 'Prestasi Siswa', anchor: '#prestasi' },
  { id: 'fasilitas', label: 'Fasilitas', mobileLabel: 'Fasilitas Kampus', anchor: '#fasilitas' },
  { id: 'berita', label: 'Berita', mobileLabel: 'Berita & Agenda', anchor: '#berita' },
  { id: 'kontak', label: 'Kontak', mobileLabel: 'Kontak & Lokasi', anchor: '#kontak' },
];

export const Navbar: React.FC<NavbarProps> = ({ 
  config, 
  onOpenCustomizer, 
  onOpenPPDB,
  onOpenVirtualTour,
  currentPage = 'home',
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const isManualScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  // Extract initials for crest (e.g. "SLK" for "Sekolah Labschool Kebangsaan")
  const words = config.name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean);
  const initials = words.slice(0, 3).map(w => w[0]).join('').toUpperCase() || 'EDU';

  // ScrollSpy: dynamically detect currently visible section during scroll on the landing page
  useEffect(() => {
    if (currentPage !== 'home') return;

    let isThrottled = false;

    const handleScroll = () => {
      if (isManualScrollRef.current) return;
      if (isThrottled) return;

      isThrottled = true;
      requestAnimationFrame(() => {
        isThrottled = false;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 1. Reached bottom of document -> Kontak
        if (scrollY + windowHeight >= documentHeight - 60) {
          setActiveSection('kontak');
          return;
        }

        // 2. Near top of page -> Beranda
        if (scrollY < 120) {
          setActiveSection('beranda');
          return;
        }

        // 3. Check each section top relative to header offset line (~110px from top)
        const offsetLine = 110;
        let currentSection = 'beranda';

        for (const item of NAV_ITEMS) {
          const el = document.getElementById(item.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= offsetLine) {
              currentSection = item.id;
            }
          }
        }

        setActiveSection(currentSection);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentPage]);

  const scrollToAnchor = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const navOffset = 80; // Exactly matches the sticky header h-20 (80px)
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - navOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (page: PageView, anchor?: string) => {
    setMobileMenuOpen(false);

    if (page !== 'home') {
      if (onNavigate) onNavigate(page);
      return;
    }

    if (anchor) {
      const sectionId = anchor.replace('#', '');
      setActiveSection(sectionId);
      isManualScrollRef.current = true;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        isManualScrollRef.current = false;
      }, 900);

      if (currentPage !== 'home') {
        if (onNavigate) onNavigate('home', false);
        setTimeout(() => {
          scrollToAnchor(sectionId);
        }, 100);
      } else {
        scrollToAnchor(sectionId);
      }
    } else {
      setActiveSection('beranda');
      if (currentPage !== 'home') {
        if (onNavigate) onNavigate('home', true);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <button 
            onClick={() => handleNavClick('home', '#beranda')}
            className="flex items-center gap-3.5 group cursor-pointer text-left bg-transparent border-0 p-0"
          >
            <div 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md transition-transform duration-300 group-hover:scale-105 relative overflow-hidden`}
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
              }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col items-center justify-center leading-none">
                <GraduationCap className="w-5 h-5 mb-0.5 text-white/90" />
                <span className="text-[10px] tracking-wider font-extrabold">{initials}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className={`text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors ${font.headingClass}`}>
                {config.name}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
                {config.tagline.split('—')[0]}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links - with dynamic theme colored text and rectangular highlight indicator */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-sm font-semibold text-slate-700">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === 'home' && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick('home', item.anchor)}
                  className={`px-3.5 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold'
                  }`}
                  style={
                    isActive
                      ? {
                          color: theme.primaryColor,
                          backgroundColor: `${theme.primaryColor}14`,
                          boxShadow: `inset 0 0 0 1px ${theme.primaryColor}30`,
                        }
                      : undefined
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenVirtualTour}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              <span>Tur Kampus 360°</span>
            </button>

            {/* PPDB CTA Button with dynamic gradient & pulse tag */}
            <button
              id="btn-nav-ppdb"
              onClick={onOpenPPDB}
              className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${theme.btnPrimary} ${theme.btnGlow}`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>PPDB {config.ppdbStatus.tahunAjaran}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
              </span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenPPDB}
              className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg cursor-pointer ${theme.btnPrimary}`}
            >
              PPDB
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          
          {/* Layanan & Portals in Mobile */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Layanan Mandiri & Portal</p>
            <button
              onClick={() => handleNavClick('layanan')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                currentPage === 'layanan' ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Layanan & Siswa Baru (PPDB & Biaya)</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavClick('elibrary')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                currentPage === 'elibrary' ? 'bg-sky-100 text-sky-900' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>E-Library Digital & Katalog Riset</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavClick('portal')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                currentPage === 'portal' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Portal Akademik Siswa & Guru</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
            </button>
          </div>

          {/* Main Navigation Links in Mobile with Active Rectangle and Text Highlights */}
          <div className="py-2 border-b border-slate-100">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Navigasi Halaman Utama</p>
            <nav className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPage === 'home' && activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick('home', item.anchor)}
                    className={`text-left px-3.5 py-2.5 text-sm rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      isActive ? 'font-bold' : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                    style={
                      isActive
                        ? {
                            color: theme.primaryColor,
                            backgroundColor: `${theme.primaryColor}14`,
                            boxShadow: `inset 0 0 0 1px ${theme.primaryColor}30`,
                          }
                        : undefined
                    }
                  >
                    <span>{item.mobileLabel}</span>
                    {isActive && (
                      <span 
                        className="w-2 h-2 rounded-full shrink-0 ml-2" 
                        style={{ backgroundColor: theme.primaryColor }} 
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVirtualTour();
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Jelajah Tur Virtual 360°</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPPDB();
              }}
              className={`w-full py-2.5 px-4 font-bold text-sm text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer ${theme.btnPrimary}`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Daftar PPDB Online {config.ppdbStatus.tahunAjaran}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomizer();
              }}
              className="w-full py-2 px-4 border border-amber-400 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Buka Studio Kustomisasi Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

