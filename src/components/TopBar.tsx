import React from 'react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';
import { Phone, MessageCircle, Clock, BookOpen, UserCheck, GraduationCap } from 'lucide-react';

interface TopBarProps {
  config: SchoolConfig;
  onOpenCustomizer?: () => void;
  onNavigate?: (page: PageView) => void;
  currentPage?: PageView;
}

export const TopBar: React.FC<TopBarProps> = ({ config, onNavigate, currentPage }) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  return (
    <div id="top-bar" className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none whitespace-nowrap">
        {/* Left: Jam Pelayanan & Kontak */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">Senin - Jumat: 07.00 - 16.00 WIB</span>
          </div>

          <a 
            href={`tel:${config.phone.replace(/[^0-9]/g, '')}`} 
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">{config.phone.split('/')[0]}</span>
          </a>

          <a 
            href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(config.name)},%20saya%20ingin%20konsultasi%20PPDB`}
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">WA Center: {config.whatsapp}</span>
          </a>
        </div>

        {/* Right: Layanan & Siswa Baru, E-Library, Portal Siswa & Guru */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="btn-topbar-layanan"
            onClick={() => onNavigate?.('layanan')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              currentPage === 'layanan' 
                ? 'text-amber-400 bg-amber-400/10 font-bold ring-1 ring-amber-400/30' 
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="Buka Pusat Layanan Siswa Baru & PPDB"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap font-medium">Layanan & Siswa Baru</span>
          </button>

          <button
            id="btn-topbar-elibrary"
            onClick={() => onNavigate?.('elibrary')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              currentPage === 'elibrary' 
                ? 'text-sky-400 bg-sky-400/10 font-bold ring-1 ring-sky-400/30' 
                : 'text-slate-300 hover:text-sky-300 hover:bg-slate-800'
            }`}
            title="Buka Perpustakaan Digital & Katalog Riset"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="whitespace-nowrap font-medium">E-Library</span>
          </button>

          <button
            id="btn-topbar-portal"
            onClick={() => onNavigate?.('portal')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              currentPage === 'portal' 
                ? 'text-indigo-400 bg-indigo-400/10 font-bold ring-1 ring-indigo-400/30' 
                : 'text-slate-300 hover:text-indigo-300 hover:bg-slate-800'
            }`}
            title="Buka Portal Akademik Siswa, Guru & Orang Tua"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="whitespace-nowrap font-medium">Portal Siswa & Guru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
