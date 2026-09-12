import React, { useState } from 'react';
import { SchoolConfig } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';
import { X, Compass, Maximize2, MapPin, Sparkles, ChevronRight, Eye } from 'lucide-react';

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({ isOpen, onClose, config }) => {
  const [activeSpot, setActiveSpot] = useState(0);

  if (!isOpen) return null;

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  const spots = [
    {
      title: 'Smart Classroom 4.0 Interaktif',
      category: 'Ruang Belajar Digital',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      description: 'Ruang kelas multimedia berpenyejuk udara dengan Smart Board 86", tata audio akustik premium, dan koneksi internet gigabit untuk pembelajaran hybrid mandiri.',
    },
    {
      title: 'Laboratorium Sains & Robotika Terpadu',
      category: 'Pusat Riset & STEM',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      description: 'Fasilitas eksplorasi sains fisika, kimia, biologi, mikrokontroler Arduino, IoT, dan 3D Printing studio untuk penelitian karya ilmiah pelajar berkaliber dunia.',
    },
    {
      title: 'Perpustakaan Digital & Collaborative Hub',
      category: 'Literasi & Riset',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      description: 'Pusat literasi terpadu dengan 25.000+ buku fisik dan akses e-jurnal internasional, reading pod berinsulasi suara, serta zona kolaborasi kreatif.',
    },
    {
      title: 'Sports Hall & Gedung Olahraga Tertutup',
      category: 'Pusat Kebugaran Atletik',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      description: 'Gelanggang olahraga kayu maple standar FIBA untuk turnamen bola basket, lapangan bulu tangkis, lintasan lari indoor, dan ruang ganti higienis.',
    },
    {
      title: 'Amphitheater & Gedung Konser Seni',
      category: 'Panggung Ekspresi Budaya',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      description: 'Auditorium pertunjukan berkapasitas 1.200 penonton berstandar panggung internasional untuk konser musik orkestra, pementasan teater, dan wisuda kenegaraan.',
    },
  ];

  const current = spots[activeSpot];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Jelajah Tur Virtual 360° Kampus
              </h3>
              <p className="text-[11px] text-slate-400">
                {config.name} — Lingkungan Belajar Inovatif
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panoramic Viewer Stage */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] bg-black overflow-hidden group">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30" />

          {/* Interactive 360 Indicator */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cyan-300 flex items-center gap-1.5 border border-cyan-500/30">
            <Eye className="w-3.5 h-3.5" />
            <span>Mode Interaktif 360° Sudut Pandang Siswa</span>
          </div>

          {/* Panoramic Location Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-2xl">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              {current.category}
            </span>
            <h4 className="text-xl sm:text-2xl font-black mt-1 mb-2">
              {current.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {current.description}
            </p>
          </div>
        </div>

        {/* Thumbnails Navigator */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3 overflow-x-auto">
          {spots.map((spot, index) => {
            const isActive = index === activeSpot;
            return (
              <button
                key={index}
                onClick={() => setActiveSpot(index)}
                className={`p-2 rounded-2xl flex items-center gap-2.5 transition-all shrink-0 cursor-pointer text-left ${
                  isActive
                    ? 'bg-slate-800 ring-2 ring-cyan-400 text-white'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="pr-2">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase">Spot 0{index + 1}</div>
                  <div className="text-xs font-semibold text-white max-w-[130px] truncate">{spot.title}</div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
