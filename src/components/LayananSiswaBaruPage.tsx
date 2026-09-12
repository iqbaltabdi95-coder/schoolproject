import React, { useState } from 'react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { PPDB_DETAILS } from '../data/portalAndLibraryData';
import { 
  ArrowLeft, 
  GraduationCap, 
  CheckCircle2, 
  Download, 
  FileText, 
  Calendar, 
  Calculator, 
  Sparkles, 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  Clock, 
  Award, 
  ShieldCheck, 
  ChevronRight,
  BookOpen,
  ArrowRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface LayananSiswaBaruPageProps {
  config: SchoolConfig;
  onNavigate: (page: PageView) => void;
  onOpenPPDB: () => void;
  onOpenVirtualTour: () => void;
}

export const LayananSiswaBaruPage: React.FC<LayananSiswaBaruPageProps> = ({
  config,
  onNavigate,
  onOpenPPDB,
  onOpenVirtualTour
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'jalur' | 'biaya' | 'alur' | 'unduhan' | 'mutasi'>('jalur');
  const [selectedJalur, setSelectedJalur] = useState<'regular' | 'prestasi' | 'tahfidz'>('regular');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const handleDownload = (docTitle: string) => {
    setDownloadSuccess(`Mengunduh file: ${docTitle}... File siap dibaca.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* Top Breadcrumb & Page Header */}
      <div 
        className="text-white relative pt-8 pb-16 border-b border-slate-800"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, ${theme.primaryColor} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">Pusat Layanan</span>
            <span className="text-slate-500">/</span>
            <span className="text-amber-400 font-bold">Layanan & Penerimaan Siswa Baru</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Penerimaan Peserta Didik Baru (PPDB) {config.ppdbStatus.tahunAjaran}</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white ${font.headingClass}`}>
                Gerbang Masuk Menuju Kampus Prestasi
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-3 max-w-2xl leading-relaxed">
                Informasi resmi alur pendaftaran, rincian beasiswa bakat, transparansi investasi pendidikan, hingga prosedur mutasi siswa di {config.name}.
              </p>

              {/* Status Alert Badge */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
                  <span className="text-slate-300 block text-[10px] uppercase font-bold">Tahap Berjalan:</span>
                  <span className="font-bold text-white text-sm">{config.ppdbStatus.gelombang}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
                  <span className="text-slate-300 block text-[10px] uppercase font-bold">Batas Waktu:</span>
                  <span className="font-bold text-amber-300 text-sm">{config.ppdbStatus.deadline}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-xs text-emerald-200">
                  <span className="block text-[10px] uppercase font-bold">Sisa Kuota:</span>
                  <span className="font-bold text-white text-sm">{config.ppdbStatus.kuotaTersisa} Kursi Tersedia</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={onOpenPPDB}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer ${theme.btnPrimary}`}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Isi Pra-Pendaftaran Online</span>
              </button>
              
              <button
                onClick={onOpenVirtualTour}
                className="w-full py-3 px-5 rounded-2xl font-bold text-xs text-slate-200 bg-white/10 hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat Tur Fasilitas Sekolah 360°</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - elevated with relative z-20 to eliminate clipping */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600 mb-8">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveSubTab('jalur')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === 'jalur'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Jalur Penerimaan & Beasiswa</span>
            </button>

            <button
              onClick={() => setActiveSubTab('alur')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'alur'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Alur & Syarat Berkas</span>
            </button>

            <button
              onClick={() => setActiveSubTab('biaya')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'biaya'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Rincian Investasi Biaya</span>
            </button>

            <button
              onClick={() => setActiveSubTab('unduhan')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'unduhan'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Unduh Brosur & Berkas</span>
            </button>

            <button
              onClick={() => setActiveSubTab('mutasi')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'mutasi'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Layanan Mutasi Siswa</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 pr-2 text-slate-500">
            <span className="text-[11px]">Butuh bantuan?</span>
            <a 
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WA Panitia</span>
            </a>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* SUBTAB 1: JALUR PENERIMAAN & BEASISWA */}
        {activeSubTab === 'jalur' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Jalur 1: Reguler */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Jalur Umum</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1 mb-3">
                    Jalur Reguler Umum
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Jalur seleksi terbuka berbasis asesmen diagnostik potensi akademik (TPA), psikotes peminatan bakat, dan wawancara kesiapan belajar.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Tanpa batasan zonasi daerah asal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Rapor semester 1 s.d. 3 min. rata-rata 78.0</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Mendapat diskon early bird jika mendaftar di Gelombang 1</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={onOpenPPDB}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
                >
                  Pilih Jalur Reguler
                </button>
              </div>

              {/* Jalur 2: Prestasi Sains & Riset */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-indigo-500 ring-4 ring-indigo-500/10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">
                  Unggulan Prioritas
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Keringanan s.d 50%</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1 mb-3">
                    Jalur Prestasi Akademik & Sains
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Dikhususkan bagi siswa juara OSN, Olimpiade Riset, Lomba Karya Ilmiah Remaja (KIR), Robotika, atau peraih 3 besar peringkat umum sekolah asal.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Bebas tes tertulis akademik (Langsung Wawancara)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Potongan Uang Pangkal s.d 50%</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Bimbingan intensif tim olimpiade sains laboratorium</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={onOpenPPDB}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-md cursor-pointer ${theme.btnPrimary}`}
                >
                  Daftar Jalur Prestasi
                </button>
              </div>

              {/* Jalur 3: Beasiswa Tahfidz & Bakat Luhur */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Beasiswa Penuh 100%</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1 mb-3">
                    Beasiswa Tahfidz & Kepemimpinan
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Apresiasi bagi penghafal Al-Qur'an minimal 3 juz, atlet prestasi nasional, juara debat bahasa Inggris, atau pengurus inti OSIS berkarakter unggul.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Bebas Uang Pangkal 100% dan SPP bulanan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Verifikasi hafalan & portofolio kepemimpinan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Dimentori langsung oleh dewan pembina institusi</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={onOpenPPDB}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
                >
                  Ajukan Beasiswa Tahfidz
                </button>
              </div>

            </div>

            {/* Jalur Info Tambahan */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Layanan Konsultasi Peminatan</span>
                <h4 className="text-xl font-bold">Ragu Memilih Jalur yang Sesuai untuk Putra-Putri Anda?</h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Tim psikolog pendidikan dan panitia PPDB siap melayani konsultasi portofolio bakat gratis setiap hari kerja.
                </p>
              </div>

              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Panitia%20PPDB,%20saya%20ingin%20konsultasi%20jalur%20penerimaan%20siswa`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Jalur via WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ALUR & SYARAT BERKAS */}
        {activeSubTab === 'alur' && (
          <div className="space-y-8">
            {/* Stepper 4 Langkah */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                4 Tahapan Alur Seleksi Penerimaan Siswa Baru
              </h3>
              <p className="text-xs text-slate-500 mb-8">
                Proses dirancang mudah, terukur, objektif, dan dapat dipantau langsung melalui dashboard digital.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {PPDB_DETAILS.steps.map((item, idx) => (
                  <div key={idx} className="relative flex flex-col">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md">
                      0{item.step}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Persyaratan Berkas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Dokumen Administrasi Wajib</h4>
                    <p className="text-xs text-slate-500">Format digital (PDF/JPG) maks. 2MB per berkas</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Scan Kartu Keluarga (KK) dan Akta Kelahiran resmi.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Scan Rapor 3 semester terakhir yang telah dilegalisir kepala sekolah asal.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pasfoto terbaru calon siswa ukuran 3x4 latar belakang merah/biru (2 lembar).</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Surat Keterangan Berkelakuan Baik dan Nomor Induk Siswa Nasional (NISN) valid.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Surat Keterangan Bebas Narkoba dan Sehat Jasmani dari klinik/RS berwenang.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Dokumen Pendukung Beasiswa & Prestasi</h4>
                    <p className="text-xs text-slate-500">Bagi pendaftar jalur prestasi & afirmasi khusus</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Sertifikat atau piagam kejuaraan minimal tingkat kota/kabupaten, provinsi, nasional, atau internasional.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Syahadah atau surat keterangan tahfidz Al-Qur'an dari lembaga tahfidz terakreditasi.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Surat Keputusan (SK) kepengurusan organisasi siswa (OSIS / MPK / Pramuka).</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Karya portofolio riset, esai, seni rupa, atau video prestasi jika ada.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: RINCIAN INVESTASI BIAYA */}
        {activeSubTab === 'biaya' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Struktur Investasi Pendidikan & Biaya Transparan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tidak ada pungutan tersembunyi. Seluruh sarana laboratorium, lisensi LMS, dan ekstrakurikuler telah terintegrasi.
                  </p>
                </div>

                {/* Filter Selector Jalur */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setSelectedJalur('regular')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                      selectedJalur === 'regular' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Jalur Reguler
                  </button>
                  <button
                    onClick={() => setSelectedJalur('prestasi')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                      selectedJalur === 'prestasi' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Jalur Prestasi
                  </button>
                  <button
                    onClick={() => setSelectedJalur('tahfidz')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                      selectedJalur === 'tahfidz' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Beasiswa Penuh
                  </button>
                </div>
              </div>

              {/* Tabel Komponen Biaya */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/75 text-slate-700 uppercase font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Komponen Pendidikan</th>
                      <th className="py-3 px-4">Estimasi Biaya ({selectedJalur === 'regular' ? 'Reguler' : selectedJalur === 'prestasi' ? 'Prestasi' : 'Beasiswa 100%'})</th>
                      <th className="py-3 px-4 rounded-r-xl">Keterangan & Fasilitas Termasuk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PPDB_DETAILS.feeComponents.map((row, idx) => {
                      const costValue = selectedJalur === 'regular' ? row.regular : selectedJalur === 'prestasi' ? row.prestasi : row.tahfidz;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                          <td className="py-3.5 px-4 font-extrabold text-indigo-600 whitespace-nowrap">{costValue}</td>
                          <td className="py-3.5 px-4 text-slate-500">{row.note}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Promo Early Bird Gelombang Ini:</strong> Dapatkan potongan tambahan sebesar <strong>{config.ppdbStatus.diskonEarlyBird}</strong> untuk penyelesaian daftar ulang sebelum tanggal {config.ppdbStatus.deadline}.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: PUSAT UNDUHAN BERKAS RESMI */}
        {activeSubTab === 'unduhan' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Pusat Dokumen Resmi & Brosur PPDB
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unduh materi informasi, formulir manual, dan panduan teknis asesmen untuk dipelajari di rumah.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PPDB_DETAILS.documents.map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all flex items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{doc.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{doc.desc}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 inline-block">Ukuran file: {doc.size}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(doc.title)}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-600 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: LAYANAN MUTASI SISWA */}
        {activeSubTab === 'mutasi' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Prosedur Pelayanan Mutasi Masuk Siswa Pindahan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Penerimaan siswa mutasi dari sekolah dalam negeri maupun luar negeri (SPK/Internasional) semester ganjil atau genap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">Tahap 1</span>
                <h4 className="text-sm font-bold text-slate-900">Verifikasi Ketersediaan Kuota</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menghubungi bagian Tata Usaha / Kurikulum untuk memastikan ketersediaan rombongan belajar (rombel) di jenjang kelas yang dituju.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">Tahap 2</span>
                <h4 className="text-sm font-bold text-slate-900">Surat Rekomendasi & Dapodik</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menyerahkan Surat Keterangan Pindah resmi dari sekolah asal, surat pelepasan data Dapodik, dan buku rapor asli lengkap.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">Tahap 3</span>
                <h4 className="text-sm font-bold text-slate-900">Tes Penyetaraan & Matrikulasi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengikuti tes pemetaan capaian belajar dan bimbingan matrikulasi kurikulum riset agar adaptasi siswa berjalan optimal.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="text-xs text-indigo-950 font-medium">
                  Informasi kuota mutasi semester ini dapat dikonfirmasi langsung ke Sekretariat Tata Usaha Sekolah.
                </span>
              </div>
              <a
                href={`tel:${config.phone.replace(/[^0-9]/g, '')}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hubungi Tata Usaha</span>
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
