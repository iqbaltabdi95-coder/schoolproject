import React, { useState } from 'react';
import { SchoolConfig, PageView } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { 
  MOCK_STUDENT_DATA, 
  MOCK_TEACHER_DATA, 
  MOCK_PARENT_DATA 
} from '../data/portalAndLibraryData';
import { 
  ArrowLeft, 
  UserCheck, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Award, 
  Calendar, 
  CheckCircle, 
  Upload, 
  CreditCard, 
  MessageSquare, 
  Bell, 
  FileSpreadsheet, 
  Users, 
  QrCode, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface PortalAkademikPageProps {
  config: SchoolConfig;
  onNavigate: (page: PageView) => void;
}

export const PortalAkademikPage: React.FC<PortalAkademikPageProps> = ({
  config,
  onNavigate
}) => {
  const [activeRole, setActiveRole] = useState<'siswa' | 'guru' | 'wali'>('siswa');
  const [taskUploaded, setTaskUploaded] = useState<string | null>(null);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const handleSimulateSubmit = (taskTitle: string) => {
    setTaskUploaded(`Tugas "${taskTitle}" berhasil diunggah ke server LMS.`);
    setTimeout(() => setTaskUploaded(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* Top Banner & Breadcrumb */}
      <div 
        className="text-white relative pt-8 pb-16 border-b border-slate-800"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, ${theme.primaryColor} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">Sistem Informasi Akademik</span>
            <span className="text-slate-500">/</span>
            <span className="text-indigo-300 font-bold">Portal Terpadu Siswa & Guru</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold mb-3 border border-indigo-400/30">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Smart Campus LMS & Sistem Informasi Manajemen Sekolah</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white ${font.headingClass}`}>
                Portal Akademik & Pembelajaran Digital
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-3 max-w-2xl leading-relaxed">
                Pusat kendali kegiatan belajar mengajar mandiri di {config.name}. Jadwal kelas terpadu, presensi kehadiran realtime, rekap nilai rapor, pengumpulan tugas, dan komunikasi terintegrasi.
              </p>
            </div>

            {/* Quick stats capsule on right */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 font-bold uppercase">Status Sistem</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Terhubung
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Tahun Ajaran: <strong>2024/2025 Ganjil</strong></div>
                  <div>Server Kecepatan Tinggi: <strong>Gigabit Campus Cloud</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - elevated with relative z-20 to eliminate clipping */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Role Selector Tabs (Siswa, Guru, Orang Tua) */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 hidden md:inline-block">
              Simulasi Akses Peran:
            </span>

            <button
              onClick={() => setActiveRole('siswa')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'siswa'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Portal Siswa (Farhan Aditya)</span>
            </button>

            <button
              onClick={() => setActiveRole('guru')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'guru'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Portal Guru (Dr. Hendra Gunawan)</span>
            </button>

            <button
              onClick={() => setActiveRole('wali')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'wali'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Portal Orang Tua / Wali</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('elibrary')}
              className="px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-sky-100"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buka E-Library</span>
            </button>
          </div>
        </div>

        {/* Upload feedback notification */}
        {taskUploaded && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{taskUploaded}</span>
          </div>
        )}

        {/* VIEW 1: ROLE SISWA */}
        {activeRole === 'siswa' && (
          <div className="space-y-6">
            
            {/* Student ID Card & Key Stats */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  FA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{MOCK_STUDENT_DATA.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                      Siswa Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NISN: <code className="font-mono text-slate-700 font-bold">{MOCK_STUDENT_DATA.nisn}</code> | NIS: {MOCK_STUDENT_DATA.nis}
                  </p>
                  <p className="text-xs font-semibold text-indigo-600 mt-1">
                    {MOCK_STUDENT_DATA.grade}
                  </p>
                </div>
              </div>

              {/* Attendance Capsule */}
              <div className="md:col-span-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Presensi Kehadiran</span>
                  <span className="text-emerald-600 font-extrabold">{MOCK_STUDENT_DATA.attendance.present}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${MOCK_STUDENT_DATA.attendance.present}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Sakit: {MOCK_STUDENT_DATA.attendance.sick}%</span>
                  <span>Izin: {MOCK_STUDENT_DATA.attendance.excused}%</span>
                  <span>Alpa: 0%</span>
                </div>
              </div>
            </div>

            {/* Grid 2 Cols: Schedule Today & Pending Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Col Left: Jadwal Pelajaran Hari Ini */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-base font-bold text-slate-900">Jadwal Kelas Hari Ini</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Senin, Pekan Efektif 07</span>
                </div>

                <div className="space-y-3">
                  {MOCK_STUDENT_DATA.scheduleToday.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 transition-all flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold font-mono">
                            {item.time}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Ruang: {item.room}</span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{item.subject}</h5>
                        <p className="text-[11px] text-slate-500">{item.teacher}</p>
                      </div>

                      <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold shrink-0">
                        Pertemuan {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col Right: Tugas & Proyek Digital */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <h4 className="text-base font-bold text-slate-900">Tugas & Asesmen Digital</h4>
                  </div>
                  <span className="text-xs text-slate-500">{MOCK_STUDENT_DATA.tasks.length} Terdata</span>
                </div>

                <div className="space-y-3">
                  {MOCK_STUDENT_DATA.tasks.map((task) => (
                    <div key={task.id} className="p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold text-indigo-600">{task.subject}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          task.status.includes('Sudah') 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{task.title}</h5>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Batas: {task.deadline}</span>
                        {!task.status.includes('Sudah') && (
                          <button
                            onClick={() => handleSimulateSubmit(task.title)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Rapor & Evaluasi Nilai Akademik */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Rekapitulasi Capaian Rapor Digital Siswa</h4>
                  <p className="text-xs text-slate-500">Penilaian Formatif & Asesmen Sumatif Tengah Semester</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                  Indeks Prestasi Rata-rata: <span className="text-indigo-600 font-extrabold text-sm">92.2 / 100</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/80 text-slate-700 uppercase font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Mata Pelajaran</th>
                      <th className="py-3 px-4">Beban Jam</th>
                      <th className="py-3 px-4">Nilai Angka</th>
                      <th className="py-3 px-4 rounded-r-xl">Predikat & Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_STUDENT_DATA.grades.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{g.subject}</td>
                        <td className="py-3 px-4 text-slate-500">{g.credit} Jam/Minggu</td>
                        <td className="py-3 px-4 font-black text-indigo-600">{g.score}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-600">{g.predicate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: ROLE GURU */}
        {activeRole === 'guru' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  HG
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{MOCK_TEACHER_DATA.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase">
                      Pendidik Tetap
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NIP: <code className="font-mono text-slate-700 font-bold">{MOCK_TEACHER_DATA.nip}</code>
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">
                    {MOCK_TEACHER_DATA.position}
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">Kelas Diampu:</div>
                <div className="flex flex-wrap gap-1.5">
                  {MOCK_TEACHER_DATA.classesTaught.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Agenda Mengajar & Antrean Penilaian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>Jurnal Mengajar Hari Ini</span>
                </h4>

                <div className="space-y-3">
                  {MOCK_TEACHER_DATA.todayClasses.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{item.time}</span>
                        <h5 className="text-xs font-bold text-slate-900">{item.class} — {item.topic}</h5>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.completed ? 'Telah Terlaksana' : 'Akan Datang'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <span>Antrean Penilaian Formatif & Tugas</span>
                </h4>

                <div className="space-y-3">
                  {MOCK_TEACHER_DATA.gradingQueue.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                        <p className="text-[11px] text-slate-500">Terkumpul: {item.submitted}/{item.total} Siswa</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors">
                        Input Nilai
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ROLE ORANG TUA / WALI */}
        {activeRole === 'wali' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  BW
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{MOCK_PARENT_DATA.parentName}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                      Wali Siswa
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nama Siswa: <strong>{MOCK_PARENT_DATA.studentName}</strong>
                  </p>
                  <p className="text-xs font-semibold text-amber-700 mt-1">
                    {MOCK_PARENT_DATA.studentClass}
                  </p>
                </div>
              </div>

              {/* Status SPP */}
              <div className="md:col-span-4 bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">Tagihan SPP {MOCK_PARENT_DATA.monthlyFee.period}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    {MOCK_PARENT_DATA.monthlyFee.status}
                  </span>
                </div>
                <div className="text-lg font-black text-emerald-800">{MOCK_PARENT_DATA.monthlyFee.amount}</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  VA: {MOCK_PARENT_DATA.monthlyFee.vaNumber}
                </div>
              </div>
            </div>

            {/* Counseling & Notes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Buku Penghubung & Catatan Wali Kelas / BK</span>
              </h4>

              <div className="space-y-3">
                {MOCK_PARENT_DATA.counselingNotes.map((note, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{note.teacher}</span>
                      <span className="text-slate-400">{note.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
