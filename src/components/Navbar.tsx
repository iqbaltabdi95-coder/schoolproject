import React, { useState, useEffect, useRef } from 'react';
import { SchoolConfig, PageView, UserProfile } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Menu, X, ChevronDown, GraduationCap, Sparkles, Award, BookOpen, Layers, Users, PhoneCall, UserCheck, LogIn } from 'lucide-react';

interface NavbarProps {
  config: SchoolConfig;
  onOpenCustomizer: () => void;
  onOpenPPDB: () => void;
  onOpenVirtualTour: () => void;
  currentPage?: PageView;
  onNavigate?: (page: PageView, scrollToTop?: boolean) => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  currentUser?: UserProfile | null;
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
  onNavigate,
  isMobileMenuOpen,
  onToggleMobileMenu,
  currentUser
}) => {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const isMenuOpen = isMobileMenuOpen !== undefined ? isMobileMenuOpen : internalMobileMenuOpen;
  const toggleMenu = onToggleMobileMenu || (() => setInternalMobileMenuOpen(prev => !prev));
  const closeMenu = () => {
    if (onToggleMobileMenu && isMobileMenuOpen) {
      onToggleMobileMenu();
    } else {
      setInternalMobileMenuOpen(false);
    }
  };

  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [isScrolled, setIsScrolled] = useState(false);
  const isManualScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  // Extract initials for crest (e.g. "SLK" for "Sekolah Labschool Kebangsaan")
  const words = config.name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean);
  const initials = words.slice(0, 3).map(w => w[0]).join('').toUpperCase() || 'EDU';

  // ScrollSpy: dynamically detect currently visible section during scroll on the landing page
  useEffect(() => {
    let isThrottled = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      if (currentPage !== 'home') return;
      if (isManualScrollRef.current) return;
      if (isThrottled) return;

      isThrottled = true;
      requestAnimationFrame(() => {
        isThrottled = false;

        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 1. Reached bottom of document -> Kontak
        if (currentScrollY + windowHeight >= documentHeight - 70) {
          setActiveSection('kontak');
          return;
        }

        // 2. Near top of page -> Beranda
        if (currentScrollY < 120) {
          setActiveSection('beranda');
          return;
        }

        // 3. Check each section top relative to header offset line (~110px from top)
        const offsetLine = 120;
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
    closeMenu();

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
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${
      isScrolled ? 'shadow-md border-b border-slate-200/90' : 'shadow-xs border-b border-slate-200/70'
    }`}>
      {/* Top Brand Accent Strip */}
      <div 
        className="h-[3px] w-full transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor})`
        }}
      />

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

          {/* Desktop Nav Links - with vibrant theme colored active pill & color transformation on click */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-sm font-semibold text-slate-700">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === 'home' && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick('home', item.anchor)}
                  className={`px-3.5 py-2 rounded-xl text-sm transition-all duration-300 cursor-pointer relative font-bold ${
                    isActive
                      ? 'text-white shadow-md transform scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          color: '#ffffff',
                          boxShadow: `0 4px 14px ${theme.primaryColor}40`,
                        }
                      : undefined
                  }
                >
                  {item.label}
                  {isActive && (
                    <span 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 rounded-full bg-amber-400"
                    />
                  )}
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

          {/* Mobile hamburger button & PPDB CTA with minimum 44px touch targets */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenPPDB}
              className={`min-h-[44px] px-3.5 py-2 text-xs font-bold text-white rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${theme.btnPrimary}`}
              aria-label="Daftar PPDB Online"
            >
              <GraduationCap className="w-4 h-4" />
              <span>PPDB</span>
            </button>
            <button
              onClick={toggleMenu}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              aria-label={isMenuOpen ? "Tutup Navigasi Menu" : "Buka Navigasi Menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-rose-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu with generous touch targets (min 44px) and smooth hierarchy */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
          
          {/* Layanan & Portals in Mobile */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 px-1">Layanan Mandiri & Portal</p>
            
            <button
              onClick={() => {
                closeMenu();
                handleNavClick('layanan');
              }}
              className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                currentPage === 'layanan' ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Layanan & Siswa Baru (PPDB & Biaya)</span>
              </div>
              <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 shrink-0" />
            </button>

            <button
              onClick={() => {
                closeMenu();
                handleNavClick('elibrary');
              }}
              className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                currentPage === 'elibrary' ? 'bg-sky-100 text-sky-900' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                <span>E-Library Digital & Katalog Riset</span>
              </div>
              <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 shrink-0" />
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  closeMenu();
                  handleNavClick('portal');
                }}
                className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                  currentPage === 'portal' ? 'bg-indigo-100 text-indigo-950 ring-1 ring-indigo-300' : 'bg-indigo-50/90 text-indigo-900 hover:bg-indigo-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                    {currentUser.role === 'it' ? 'A' : currentUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wider">
                      {currentUser.role === 'it' ? 'Admin' : currentUser.role}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-indigo-500 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => {
                  closeMenu();
                  handleNavClick('portal');
                }}
                className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                  currentPage === 'portal' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LogIn className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Login (Portal Siswa, Guru & Admin)</span>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 shrink-0" />
              </button>
            )}
          </div>

          {/* Main Navigation Links in Mobile with Active Highlights */}
          <div className="py-2 border-b border-slate-100">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 px-1">Navigasi Halaman Utama</p>
            <nav className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPage === 'home' && activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      closeMenu();
                      handleNavClick('home', item.anchor);
                    }}
                    className={`text-left px-3.5 py-2.5 min-h-[44px] text-sm rounded-xl cursor-pointer transition-all flex items-center justify-between ${
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
                        className="w-2.5 h-2.5 rounded-full shrink-0 ml-2" 
                        style={{ backgroundColor: theme.primaryColor }} 
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                closeMenu();
                onOpenVirtualTour();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Jelajah Tur Virtual 360°</span>
            </button>
            <button
              onClick={() => {
                closeMenu();
                onOpenPPDB();
              }}
              className={`w-full min-h-[48px] py-3 px-4 font-bold text-sm text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${theme.btnPrimary}`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Daftar PPDB Online {config.ppdbStatus.tahunAjaran}</span>
            </button>
            <button
              onClick={() => {
                closeMenu();
                onOpenCustomizer();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
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

