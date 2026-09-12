import React, { useState, useEffect } from 'react';
import { SchoolConfig, PageView } from './types';
import { 
  DEFAULT_SCHOOL_CONFIG, 
  DEFAULT_PROGRAMS, 
  DEFAULT_ACHIEVEMENTS, 
  DEFAULT_EKSEKUL, 
  DEFAULT_FACILITIES, 
  DEFAULT_NEWS, 
  DEFAULT_TESTIMONIALS, 
  DEFAULT_FAQS,
  FONT_CONFIGS
} from './data/defaultSchoolData';

import { TopBar } from './components/TopBar';
import { TickerBar } from './components/TickerBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SambutanSection } from './components/SambutanSection';
import { ProgramsSection } from './components/ProgramsSection';
import { StatsCounterSection } from './components/StatsCounterSection';
import { PrestasiSection } from './components/PrestasiSection';
import { EkskulSection } from './components/EkskulSection';
import { FasilitasSection } from './components/FasilitasSection';
import { PPDBSection } from './components/PPDBSection';
import { TestimoniSection } from './components/TestimoniSection';
import { BeritaSection } from './components/BeritaSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { CustomizerDrawer } from './components/CustomizerDrawer';
import { PPDBModal } from './components/PPDBModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { FloatingActions } from './components/FloatingActions';
import { LayananSiswaBaruPage } from './components/LayananSiswaBaruPage';
import { PortalAkademikPage } from './components/PortalAkademikPage';
import { ELibraryPage } from './components/ELibraryPage';

const STORAGE_KEY = 'school_portal_custom_config_v1';

export default function App() {
  const [config, setConfig] = useState<SchoolConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SCHOOL_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read saved config from localStorage', e);
    }
    return DEFAULT_SCHOOL_CONFIG;
  });

  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('layanan')) return 'layanan';
    if (hash.includes('portal')) return 'portal';
    if (hash.includes('perpustakaan') || hash.includes('elibrary') || hash.includes('e-library')) return 'elibrary';
    return 'home';
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isPPDBModalOpen, setIsPPDBModalOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('layanan')) {
        setCurrentPage('layanan');
      } else if (hash.includes('portal')) {
        setCurrentPage('portal');
      } else if (hash.includes('perpustakaan') || hash.includes('elibrary') || hash.includes('e-library')) {
        setCurrentPage('elibrary');
      } else if (hash === '' || hash === '#' || hash.includes('beranda') || hash.includes('sambutan') || hash.includes('program') || hash.includes('prestasi') || hash.includes('fasilitas') || hash.includes('berita') || hash.includes('kontak')) {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageView, scrollToTop: boolean = true) => {
    setCurrentPage(page);
    if (page === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = page;
    }
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save changes to localStorage for presentation persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Could not save config to localStorage', e);
    }
    // Update document title dynamically to reflect current school name & view
    const viewTitle = 
      currentPage === 'layanan' ? 'Pusat Layanan & PPDB' :
      currentPage === 'portal' ? 'Portal Siswa & Guru' :
      currentPage === 'elibrary' ? 'E-Library & Literasi' : 'Portal Resmi Sekolah Modern';
    document.title = `${config.name} — ${viewTitle}`;
  }, [config, currentPage]);

  const handleResetConfig = () => {
    setConfig(DEFAULT_SCHOOL_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 ${font.bodyClass}`}>
      
      {/* 1. Top Bar */}
      <TopBar 
        config={config} 
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* 2. Running Announcement Ticker */}
      <TickerBar 
        config={config} 
        onOpenPPDB={() => setIsPPDBModalOpen(true)}
        onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* 3. Main Navigation */}
      <Navbar 
        config={config} 
        onOpenCustomizer={() => setIsCustomizerOpen(true)} 
        onOpenPPDB={() => setIsPPDBModalOpen(true)}
        onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* MAIN VIEW ROUTER */}
      {currentPage === 'layanan' && (
        <LayananSiswaBaruPage 
          config={config}
          onNavigate={handleNavigate}
          onOpenPPDB={() => setIsPPDBModalOpen(true)}
          onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
        />
      )}

      {currentPage === 'portal' && (
        <PortalAkademikPage 
          config={config}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'elibrary' && (
        <ELibraryPage 
          config={config}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'home' && (
        <>
          {/* 4. Hero Section */}
          <HeroSection 
            config={config}
            onOpenPPDB={() => setIsPPDBModalOpen(true)}
            onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            onNavigate={handleNavigate}
          />

          {/* 5. Sambutan Kepala Sekolah */}
          <SambutanSection 
            config={config}
            onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
          />

          {/* 6. Program Unggulan Akademik & Riset */}
          <ProgramsSection 
            config={config}
            programs={DEFAULT_PROGRAMS}
            onOpenPPDB={() => setIsPPDBModalOpen(true)}
          />

          {/* 7. Statistik Capaian Mutu */}
          <StatsCounterSection 
            config={config} 
          />

          {/* 8. Prestasi Siswa & Rekognisi Internasional/Nasional */}
          <PrestasiSection 
            config={config}
            achievements={DEFAULT_ACHIEVEMENTS}
          />

          {/* 9. Ekstrakurikuler & Eksplorasi Bakat */}
          <EkskulSection 
            config={config}
            ekskulList={DEFAULT_EKSEKUL}
          />

          {/* 10. Fasilitas Kampus & Sarana Modern */}
          <FasilitasSection 
            config={config}
            facilities={DEFAULT_FACILITIES}
            onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
          />

          {/* 11. Informasi PPDB Penerimaan Siswa Baru */}
          <PPDBSection 
            config={config}
            onOpenPPDB={() => setIsPPDBModalOpen(true)}
          />

          {/* 12. Testimoni Komunitas & Rekam Jejak Alumni */}
          <TestimoniSection 
            config={config}
            testimonials={DEFAULT_TESTIMONIALS}
          />

          {/* 13. Warta Berita & Kalender Agenda */}
          <BeritaSection 
            config={config}
            newsList={DEFAULT_NEWS}
          />

          {/* 14. Pertanyaan Umum (FAQ) */}
          <FAQSection 
            config={config}
            faqs={DEFAULT_FAQS}
          />
        </>
      )}

      {/* 15. Mega Footer */}
      <Footer 
        config={config}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenPPDB={() => setIsPPDBModalOpen(true)}
        onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Floating Action Controls */}
      <FloatingActions 
        config={config}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenPPDB={() => setIsPPDBModalOpen(true)}
      />

      {/* Drawer Studio Kustomisasi Sekolah (Demo Presenter) */}
      <CustomizerDrawer 
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onChangeConfig={setConfig}
        onResetConfig={handleResetConfig}
      />

      {/* Interactive PPDB Online Modal */}
      <PPDBModal 
        isOpen={isPPDBModalOpen}
        onClose={() => setIsPPDBModalOpen(false)}
        config={config}
      />

      {/* Virtual Campus Tour 360° Modal */}
      <VirtualTourModal 
        isOpen={isVirtualTourOpen}
        onClose={() => setIsVirtualTourOpen(false)}
        config={config}
      />

    </div>
  );
}

