import React from 'react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  FileText, 
  Play, 
  CheckCircle2,
  Users
} from 'lucide-react';

interface HeroSectionProps {
  config: SchoolConfig;
  onOpenPPDB: () => void;
  onOpenVirtualTour: () => void;
  onOpenCustomizer: () => void;
  onNavigate?: (page: PageView) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onOpenPPDB,
  onOpenVirtualTour,
  onOpenCustomizer,
  onNavigate
}) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  return (
    <section id="beranda" className="scroll-mt-20 relative overflow-hidden bg-white pt-6 pb-16 lg:py-20">
      {/* Background Decorative Ambient Blobs */}
      <div 
        className={`absolute -top-24 -left-24 w-96 h-96 rounded-full filter blur-3xl opacity-30 pointer-events-none ${theme.blob1}`} 
      />
      <div 
        className={`absolute top-1/2 -right-24 w-96 h-96 rounded-full filter blur-3xl opacity-25 pointer-events-none ${theme.blob2}`} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text, Value Proposition, Dynamic Gradient Heading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Accreditation & Badge Capsule */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all mb-6 bg-slate-50 border-slate-200">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-800 font-semibold">{config.accreditation}</span>
              <span className="text-slate-300">|</span>
              <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent font-extrabold`}>
                Est. {config.establishedYear}
              </span>
            </div>

            {/* Main Headline with Captivating Gradient Typography */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6 ${font.headingClass}`}>
              Masa Depan Gemilang{' '}
              <span className="block mt-1">
                Dimulai Bersama{' '}
                <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent underline decoration-wavy decoration-indigo-400/30 decoration-2`}>
                  {config.name}
                </span>
              </span>
            </h1>

            {/* Sub-headline / Tagline */}
            <p className={`text-base sm:text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed ${font.bodyClass}`}>
              {config.subTagline} Kami membina talenta siswa dengan pendekatan holistik: kematangan intelektual, kecakapan riset abad ke-21, serta integritas budi pekerti luhur.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 w-full max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bilingual & Digital Learning</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Riset Sains & STEM Lab</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tripilar Karakter Unggul</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                id="btn-hero-ppdb"
                onClick={onOpenPPDB}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${theme.btnPrimary} ${theme.btnGlow}`}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Daftar Siswa Baru {config.ppdbStatus.tahunAjaran}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="btn-hero-tour"
                onClick={onOpenVirtualTour}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-600" />
                <span>Jelajahi Tur Virtual 360°</span>
              </button>
            </div>

            {/* Quick Demo Customizer Hint Pill */}
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 bg-amber-50/80 border border-amber-200/70 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                Sedang mempresentasikan website ini?{' '}
                <button 
                  onClick={onOpenCustomizer} 
                  className="font-bold text-amber-800 underline hover:text-amber-900 cursor-pointer"
                >
                  Ubah identitas & warna sekolah seketika di sini →
                </button>
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Visual Showcase with Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Decorative Gradient Frame */}
              <div 
                className="absolute -inset-2 rounded-3xl opacity-40 blur-xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              />

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80"
                  alt="Kegiatan Belajar Siswa Berprestasi"
                  className="w-full h-[430px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                {/* Overlay Floating Badge 1: Tingkat Kelulusan & Beasiswa */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/50 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ background: theme.primaryColor }}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Tingkat Kelulusan</div>
                    <div className="text-base font-extrabold text-slate-900">{config.stats.kelulusan} Unggul</div>
                  </div>
                </div>

                {/* Overlay Floating Badge 2: Video Profile Trigger */}
                <button
                  onClick={onOpenVirtualTour}
                  className="absolute top-4 right-4 group p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md hover:bg-slate-900 text-white flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
                  title="Tonton Profil Sekolah"
                >
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span className="text-xs font-semibold pr-1">Video Profil</span>
                </button>

                {/* Bottom Overlay Info Banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                      {config.ppdbStatus.gelombang}
                    </span>
                    <span className="text-[11px] bg-red-500/20 border border-red-500/30 text-red-300 font-bold px-2 py-0.5 rounded-full">
                      Tersisa {config.ppdbStatus.kuotaTersisa} Kursi
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-100 line-clamp-1">
                    Penerimaan Siswa Baru: {config.ppdbStatus.diskonEarlyBird}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                    <span>Batas Pendaftaran:</span>
                    <span className="text-white font-bold">{config.ppdbStatus.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Pill */}
              <div className="absolute -bottom-5 -right-3 sm:right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Prestasi Pelajar</div>
                  <div className="text-sm font-black text-slate-900">{config.stats.medaliPrestasi} Medali Juara</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4 Interactive Quick Action Cards under Hero (Labschool signature style) */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: PPDB Online & Layanan Siswa Baru */}
          <div 
            onClick={() => onNavigate ? onNavigate('layanan') : onOpenPPDB()}
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Layanan & Jalur Masuk</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 font-semibold rounded">{config.ppdbStatus.tahunAjaran}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              PPDB & Layanan Siswa Baru
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Informasi lengkap alur seleksi, rincian biaya transparan, beasiswa prestasi, dan unduh berkas.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Buka Pusat Layanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Tur Kampus Virtual */}
          <div 
            onClick={onOpenVirtualTour}
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Eksplorasi</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-cyan-100 text-cyan-700 font-semibold rounded">360° View</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
              Tur Kampus & Fasilitas
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Jelajahi smart classroom, laboratorium riset robotika, perpustakaan digital, dan arena olahraga.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-cyan-600 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Buka Tur Virtual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Kurikulum & Riset */}
          <a 
            href="#program"
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer relative overflow-hidden block"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Akademik</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-semibold rounded">Kurikulum Mandiri</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Program Unggulan Riset
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Kombinasi sains robotika, bilingual immersion, dan pembinaan karakter kepemimpinan siswa.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Pelajari Kurikulum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Card 4: Brosur & Beasiswa */}
          <a 
            href="#prestasi"
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer relative overflow-hidden block"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Prestasi</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 font-semibold rounded">100% Beasiswa</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Galeri Prestasi & Beasiswa
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Peluang beasiswa pendidikan penuh bagi siswa berprestasi sains, seni, hafiz, dan olahraga.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-600 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Lihat Rekognisi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

        </div>

      </div>
    </section>
  );
};
