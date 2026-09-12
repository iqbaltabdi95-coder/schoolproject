import React from 'react';
import { SchoolConfig, PageView } from '../types';
import { Megaphone, ExternalLink, ChevronRight } from 'lucide-react';

interface TickerBarProps {
  config: SchoolConfig;
  onOpenPPDB: () => void;
  onOpenVirtualTour?: () => void;
  onNavigate?: (page: PageView, scrollToTop?: boolean) => void;
}

interface AnnouncementItem {
  id: string;
  badge: string;
  badgeColor: string;
  text: string;
  actionHint: string;
  actionType: 'ppdb' | 'virtual-tour' | 'anchor' | 'whatsapp';
  target?: string;
}

export const TickerBar: React.FC<TickerBarProps> = ({ 
  config, 
  onOpenPPDB,
  onOpenVirtualTour,
  onNavigate
}) => {
  const announcements: AnnouncementItem[] = [
    {
      id: 'ppdb',
      badge: 'PPDB 2026/2027',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      text: `🎓 Penerimaan Siswa Baru: ${config.ppdbStatus.gelombang} resmi dibuka! Kuota tersisa tinggal ${config.ppdbStatus.kuotaTersisa} kursi.`,
      actionHint: 'Buka Info & Formulir',
      actionType: 'ppdb',
    },
    {
      id: 'prestasi',
      badge: 'Prestasi Siswa',
      badgeColor: 'bg-amber-100 text-amber-800',
      text: `⭐ Kontingen ${config.name} berhasil meraih 185+ Medali Kompetisi Riset, Robotika & Olimpiade Sains Nasional & Internasional 2026.`,
      actionHint: 'Lihat Prestasi',
      actionType: 'anchor',
      target: 'prestasi',
    },
    {
      id: 'tour',
      badge: 'Tur Kampus 360°',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      text: `🏛️ Eksplorasi Fasilitas Kampus secara Interaktif melalui Tur Virtual 360° — Jelajah ruang kelas, lab sains, dan sarana olahraga.`,
      actionHint: 'Mulai Jelajah',
      actionType: 'virtual-tour',
    },
    {
      id: 'program',
      badge: 'Program Unggulan',
      badgeColor: 'bg-purple-100 text-purple-700',
      text: `🚀 Empat Pilar Kurikulum Unggulan (STEAM Innovation, Cambridge Bilingual, Leadership, & Islamic Character) berstandar global.`,
      actionHint: 'Pelajari Kurikulum',
      actionType: 'anchor',
      target: 'program',
    },
    {
      id: 'fasilitas',
      badge: 'Fasilitas Digital',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      text: `🔬 Fasilitas Riset Digital Modern: Laboratorium VR & IoT, Perpustakaan Multimedia, dan Arena Olahraga berstandar federasi.`,
      actionHint: 'Lihat Fasilitas',
      actionType: 'anchor',
      target: 'fasilitas',
    },
    {
      id: 'berita',
      badge: 'Agenda Kampus',
      badgeColor: 'bg-blue-100 text-blue-700',
      text: `📅 Agenda Dies Natalis, Pameran Karya Siswa Nasional & Edufair Kampus 2026 segera diselenggarakan.`,
      actionHint: 'Baca Agenda',
      actionType: 'anchor',
      target: 'berita',
    },
    {
      id: 'layanan',
      badge: 'Layanan Hotline',
      badgeColor: 'bg-rose-100 text-rose-700',
      text: `💬 Pusat Layanan Informasi & Konsultasi Konseling Peserta Didik: Hubungi admin sekolah via WhatsApp resmi.`,
      actionHint: 'Hubungi Sekolah',
      actionType: 'whatsapp',
    },
  ];

  const handleAction = (item: AnnouncementItem) => {
    if (item.actionType === 'ppdb') {
      onOpenPPDB();
    } else if (item.actionType === 'virtual-tour') {
      if (onOpenVirtualTour) onOpenVirtualTour();
    } else if (item.actionType === 'anchor' && item.target) {
      if (onNavigate) {
        onNavigate('home', false);
      }
      setTimeout(() => {
        const el = document.getElementById(item.target!);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, elementPosition - navOffset);
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 60);
    } else if (item.actionType === 'whatsapp') {
      const waNumber = config.whatsapp.replace(/[^0-9]/g, '');
      window.open(
        `https://wa.me/${waNumber}?text=Halo%20Admin%20${encodeURIComponent(config.name)},%20saya%20ingin%20konsultasi%20informasi%20sekolah`,
        '_blank'
      );
    }
  };

  const renderAnnouncementSet = (keyPrefix: string) => (
    <div className="flex items-center shrink-0">
      {announcements.map((item) => (
        <button
          key={`${keyPrefix}-${item.id}`}
          onClick={() => handleAction(item)}
          className="group inline-flex items-center gap-2.5 mx-5 py-1 px-2.5 rounded-lg hover:bg-white hover:shadow-xs transition-all text-slate-700 hover:text-indigo-950 cursor-pointer text-left border-0 bg-transparent shrink-0"
          title={`Klik untuk: ${item.actionHint}`}
        >
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase shrink-0 transition-transform group-hover:scale-105 ${item.badgeColor}`}>
            {item.badge}
          </span>
          <span className="text-xs font-medium text-slate-800 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
            {item.text}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 group-hover:text-indigo-800 opacity-80 group-hover:opacity-100 transition-opacity bg-indigo-50/80 px-1.5 py-0.5 rounded shrink-0">
            <span>{item.actionHint}</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="text-slate-300 ml-3 shrink-0 font-light select-none">|</span>
        </button>
      ))}
    </div>
  );

  return (
    <div 
      id="ticker-bar" 
      className="bg-slate-100/90 border-b border-slate-200/80 overflow-hidden text-xs py-1.5 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Fixed Red Announcement Pill Badge as requested in UI5.png */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold tracking-wider uppercase text-[10px] shrink-0 shadow-xs z-10">
          <Megaphone className="w-3 h-3 animate-pulse" />
          <span>Pengumuman</span>
        </div>

        {/* Continuous Smooth Infinite Marquee from Right to Left */}
        <div 
          className="overflow-hidden whitespace-nowrap w-full relative flex items-center"
          title="Arahkan kursor untuk menjeda dan klik informasi"
        >
          <div className="animate-marquee-left flex items-center">
            {renderAnnouncementSet('set1')}
            {renderAnnouncementSet('set2')}
          </div>
        </div>
      </div>
    </div>
  );
};
