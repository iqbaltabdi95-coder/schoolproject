import React, { useState } from 'react';
import { SchoolConfig } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { generateBrosurPPDB } from '../utils/pdfGenerator';
import { 
  GraduationCap, 
  FileText, 
  Calendar, 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface PPDBSectionProps {
  config: SchoolConfig;
  onOpenPPDB: () => void;
}

export const PPDBSection: React.FC<PPDBSectionProps> = ({ config, onOpenPPDB }) => {
  const [isDownloadingBrosur, setIsDownloadingBrosur] = useState(false);
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];
  const { ppdbStatus } = config;

  const handleDownloadBrosur = () => {
    setIsDownloadingBrosur(true);
    setTimeout(() => {
      generateBrosurPPDB(config);
      setIsDownloadingBrosur(false);
    }, 400);
  };

  const steps = [
    {
      num: '01',
      title: 'Pendaftaran Akun & Berkas',
      desc: 'Pengisian biodata calon siswa secara daring melalui portal PPDB serta mengunggah pindaian rapor dan dokumen pendukung.',
    },
    {
      num: '02',
      title: 'Pembayaran Biaya Seleksi',
      desc: 'Melakukan pembayaran biaya seleksi dan tes pemetaan bakat melalui Virtual Account bank resmi yang otomatis terverifikasi.',
    },
    {
      num: '03',
      title: 'Asesmen Bakat & Wawancara',
      desc: 'Pelaksanaan asesmen diagnostik potensi akademik, tes psikologi minat bakat, dan wawancara interaktif orang tua serta calon siswa.',
    },
    {
      num: '04',
      title: 'Pengumuman & Daftar Ulang',
      desc: 'Pengumuman kelulusan hasil seleksi secara online dan konfirmasi administrasi daftar ulang bagi peserta didik yang diterima.',
    },
  ];

  return (
    <section id="ppdb" className="py-20 bg-white relative overflow-hidden">
      {/* Ambient background decoration */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-20 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Alert Status PPDB */}
        <div className="rounded-3xl p-6 sm:p-10 mb-16 text-white shadow-xl relative overflow-hidden"
             style={{
               background: `linear-gradient(135deg, #0f172a 0%, ${theme.primaryColor} 100%)`
             }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-amber-300 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Penerimaan Peserta Didik Baru (PPDB) {ppdbStatus.tahunAjaran}</span>
              </div>
              <h3 className={`text-2xl sm:text-4xl font-black text-white tracking-tight mb-3 ${font.headingClass}`}>
                {ppdbStatus.gelombang}
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6">
                Peluang bergabung bersama keluarga besar {config.name}. Raih lingkungan pendidikan yang menumbuhkan karakter mulia dan prestasi dunia.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Batas Pendaftaran: <strong className="text-white">{ppdbStatus.deadline}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Sisa Kuota: <strong className="text-white">{ppdbStatus.kuotaTersisa} Kursi</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                id="btn-ppdb-register-now"
                onClick={onOpenPPDB}
                className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Daftar Sekarang Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownloadBrosur}
                disabled={isDownloadingBrosur}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer min-h-[44px] disabled:opacity-60"
                aria-label="Unduh Brosur Resmi dan Rincian Biaya PPDB dalam format PDF"
              >
                {isDownloadingBrosur ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Membuat PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Unduh e-Brosur & Biaya (PDF)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step Registration Process */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className={`text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight ${font.headingClass}`}>
              Alur Ringkas Pendaftaran Siswa Baru
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Proses pendaftaran transparan, modern, dan mudah dipantau status kelulusannya secara daring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all relative"
              >
                <div className="text-3xl font-black text-slate-300 mb-3">
                  {step.num}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Jalur Masuk Pendaftaran (Reguler, Prestasi, Beasiswa) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Jalur 01</span>
            <h4 className="text-lg font-bold text-slate-900 mt-1 mb-2">Jalur Reguler Umum</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Terbuka untuk seluruh calon peserta didik dari sekolah mana pun dengan seleksi tes potensi akademik dan wawancara.
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Rapor semester terakhir minimal rata-rata 75</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Lulus tes potensi akademik terpadu</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl border-2 border-indigo-500 bg-indigo-50/30 shadow-md relative">
            <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Favorit
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Jalur 02</span>
            <h4 className="text-lg font-bold text-slate-900 mt-1 mb-2">Jalur Prestasi Unggulan</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Jalur khusus tanpa tes tertulis bagi peraih medali olimpiade sains, olahraga, seni budaya, atau ketua OSIS.
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sertifikat juara min. tingkat kota/provinsi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Bebas tes tulis & wawancara prioritas</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Jalur 03</span>
            <h4 className="text-lg font-bold text-slate-900 mt-1 mb-2">Jalur Beasiswa Tahfidz & Bakat</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Beasiswa pembebasan SPP dan dana pendidikan hingga 100% bagi hafiz/hafizah Al-Qur'an dan talenta istimewa.
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Hafalan minimal 3 Juz mutqin</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Tes uji hafalan bersama penguji sekolah</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};
