import React from 'react';
import { SchoolConfig, PageView, UserProfile } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';
import { Phone, MessageCircle, Clock, BookOpen, LogIn, GraduationCap, User } from 'lucide-react';

interface TopBarProps {
  config: SchoolConfig;
  onOpenCustomizer?: () => void;
  onNavigate?: (page: PageView) => void;
  currentPage?: PageView;
  currentUser?: UserProfile | null;
}

export const TopBar: React.FC<TopBarProps> = ({ config, onNavigate, currentPage, currentUser }) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'siswa': return 'Siswa';
      case 'guru': return 'Guru';
      case 'wali': return 'Wali';
      case 'perpustakaan': return 'Pustaka';
      case 'bendahara': return 'Bendahara';
      case 'it': return 'Admin';
      default: return role;
    }
  };

  return (
    <div id="top-bar" className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 flex items-center justify-between gap-3">
        {/* Left: Jam Pelayanan & Kontak */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">Senin - Jumat: 07.00 - 16.00 WIB</span>
          </div>

          <a 
            href={`tel:${config.phone.replace(/[^0-9]/g, '')}`} 
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors min-h-[36px]"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">{config.phone.split('/')[0]}</span>
          </a>

          <a 
            href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(config.name)},%20saya%20ingin%20konsultasi%20PPDB`}
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold min-h-[36px] sm:min-h-auto"
            aria-label={`Hubungi WhatsApp Sekolah: ${config.whatsapp}`}
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0 fill-current" />
            <span className="text-[11px] sm:text-xs">WA Center: {config.whatsapp}</span>
          </a>
        </div>

        {/* Right: Layanan & Siswa Baru, E-Library, Login Portal (Desktop / Tablet) */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="btn-topbar-layanan"
            onClick={() => onNavigate?.('layanan')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer min-h-[36px] ${
              currentPage === 'layanan' 
                ? 'text-amber-400 bg-amber-400/10 font-bold ring-1 ring-amber-400/30' 
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="Buka Pusat Layanan Siswa Baru & PPDB"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">Layanan & Siswa Baru</span>
          </button>

          <button
            id="btn-topbar-elibrary"
            onClick={() => onNavigate?.('elibrary')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer min-h-[36px] ${
              currentPage === 'elibrary' 
                ? 'text-sky-400 bg-sky-400/10 font-bold ring-1 ring-sky-400/30' 
                : 'text-slate-300 hover:text-sky-300 hover:bg-slate-800'
            }`}
            title="Buka Perpustakaan Digital & Katalog Riset"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-medium">E-Library</span>
          </button>

          {currentUser ? (
            <button
              id="btn-topbar-portal"
              onClick={() => onNavigate?.('portal')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all cursor-pointer min-h-[36px] ${
                currentPage === 'portal' 
                  ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400/60 shadow-sm' 
                  : 'text-indigo-100 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 shadow-xs'
              }`}
              title={`Akun Aktif: ${currentUser.name} (${getRoleLabel(currentUser.role)}) — Klik untuk ke Portal`}
            >
              <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black uppercase ring-1 ring-white/20">
                {currentUser.role === 'it' ? 'A' : currentUser.name.charAt(0)}
              </div>
              <span className="font-bold text-xs max-w-[130px] truncate text-white">{currentUser.name}</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/40 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider">
                {getRoleLabel(currentUser.role)}
              </span>
            </button>
          ) : (
            <button
              id="btn-topbar-portal"
              onClick={() => onNavigate?.('portal')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer min-h-[36px] ${
                currentPage === 'portal' 
                  ? 'text-indigo-300 bg-indigo-500/20 font-bold ring-1 ring-indigo-400/40 shadow-xs' 
                  : 'text-indigo-300 hover:text-white hover:bg-indigo-600/30'
              }`}
              title="Masuk ke Portal Sekolah (Login Siswa, Guru, Wali & Staf)"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-bold">Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
