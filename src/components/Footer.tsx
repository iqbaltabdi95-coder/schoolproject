import React from 'react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Instagram,
  Youtube,
  Facebook,
  Linkedin
} from 'lucide-react';

interface FooterProps {
  config: SchoolConfig;
  onOpenCustomizer: () => void;
  onOpenPPDB: () => void;
  onOpenVirtualTour: () => void;
  onNavigate?: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenCustomizer,
  onOpenPPDB,
  onOpenVirtualTour,
  onNavigate
}) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const words = config.name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean);
  const initials = words.slice(0, 3).map(w => w[0]).join('').toUpperCase() || 'EDU';

  return (
    <footer id="kontak" className="scroll-mt-20 bg-slate-950 text-slate-400 text-xs border-t border-slate-800 relative overflow-hidden">
      
      {/* Top Banner Call to Action */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 font-bold tracking-wider uppercase text-[11px]">
              Gerbang Menuju Prestasi Masa Depan
            </span>
            <h3 className={`text-2xl sm:text-3xl font-extrabold text-white mt-1 ${font.headingClass}`}>
              Siap Mendaftarkan Putra-Putri Anda di {config.name}?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Konsultasikan peminatan bakat dan dapatkan informasi beasiswa pendidikan terbaik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenPPDB}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg cursor-pointer ${theme.btnPrimary}`}
            >
              Daftar PPDB {config.ppdbStatus.tahunAjaran}
            </button>
            <button
              onClick={onOpenVirtualTour}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            >
              Tur Virtual Kampus
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: School Identity & Accreditation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <GraduationCap className="w-5 h-5 mb-0.5 text-white/90" />
                  <span className="text-[10px] font-extrabold">{initials}</span>
                </div>
              </div>

              <div>
                <h4 className={`text-base font-extrabold text-white ${font.headingClass}`}>
                  {config.name}
                </h4>
                <p className="text-[11px] text-slate-400">{config.tagline.split('—')[0]}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Institusi laboratorium pendidikan modern yang mendedikasikan diri untuk pembinaan nalar kritis, inovasi sains robotika, dan karakter moral mulia generasi bangsa.
            </p>

            <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block">{config.accreditation}</span>
                <span className="text-slate-400">Peringkat Unggul Nasional</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center text-slate-400">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center text-slate-400">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-slate-400">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center text-slate-400">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Navigasi Utama</h5>
            <ul className="space-y-2">
              <li><a href="#beranda" className="hover:text-white transition-colors">Beranda Utama</a></li>
              <li><a href="#sambutan" className="hover:text-white transition-colors">Profil & Sambutan</a></li>
              <li><a href="#program" className="hover:text-white transition-colors">Program Unggulan</a></li>
              <li><a href="#prestasi" className="hover:text-white transition-colors">Galeri Prestasi</a></li>
              <li><a href="#ekskul" className="hover:text-white transition-colors">Ekstrakurikuler</a></li>
              <li><a href="#fasilitas" className="hover:text-white transition-colors">Fasilitas Kampus</a></li>
              <li><a href="#berita" className="hover:text-white transition-colors">Warta & Agenda</a></li>
            </ul>
          </div>

          {/* Col 3: Layanan & PPDB */}
          <div className="lg:col-span-3 space-y-3">
            <h5 
              onClick={() => onNavigate?.('layanan')}
              className="text-xs font-bold uppercase tracking-wider text-white hover:text-amber-400 transition-colors cursor-pointer"
            >
              Layanan & Siswa Baru →
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenPPDB} className="hover:text-white transition-colors text-left cursor-pointer">
                  Pendaftaran PPDB {config.ppdbStatus.tahunAjaran}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('layanan')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Alur & Jalur Beasiswa Masuk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('layanan')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Rincian Biaya & Dokumen Unduhan
                </button>
              </li>
              <li>
                <button onClick={onOpenVirtualTour} className="hover:text-white transition-colors text-left cursor-pointer">
                  Tur Virtual Fasilitas Kampus
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('elibrary')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Akses Katalog E-Library Digital
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('portal')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Portal Siswa & Guru (Smart LMS)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi Kontak & Lokasi */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Sekretariat & Lokasi</h5>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{config.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {config.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{config.email}</span>
              </div>
            </div>

            {/* Customizer trigger highlight in footer */}
            <div className="pt-2">
              <button
                onClick={onOpenCustomizer}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Kustomisasi Identitas Sekolah</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {config.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Standar Web Institusi Pendidikan Modern</span>
            <span>•</span>
            <button 
              onClick={onOpenCustomizer} 
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Mode Presentasi Demo Sekolah
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
