import React from 'react';
import { SchoolConfig } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';
import { Sparkles, MessageCircle, ArrowUp } from 'lucide-react';

interface FloatingActionsProps {
  config: SchoolConfig;
  onOpenCustomizer: () => void;
  onOpenPPDB: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  config,
  onOpenCustomizer,
  onOpenPPDB,
}) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
        aria-label="Scroll ke atas"
        title="Kembali ke atas"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Floating WhatsApp Consultation Button */}
      <a
        href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(config.name)},%20saya%20tertarik%20dengan%20informasi%20pendaftaran%20sekolah`}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
        title="Konsultasi langsung via WhatsApp Panitia"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline-block">Tanya PPDB Online</span>
      </a>

      {/* Floating Demo Customizer Button */}
      <button
        id="btn-floating-customizer"
        onClick={onOpenCustomizer}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 cursor-pointer ring-4 ring-amber-400/30"
        title="Buka panel kustomisasi identitas dan warna sekolah instan"
      >
        <Sparkles className="w-5 h-5 animate-spin-slow" />
        <span className="flex flex-col text-left leading-none">
          <span className="text-[10px] uppercase tracking-wider text-slate-900 font-extrabold">Mode Presentasi</span>
          <span className="text-xs font-black">Ubah Profil Sekolah</span>
        </span>
      </button>

    </div>
  );
};
