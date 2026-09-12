import React from 'react';
import { SchoolConfig } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Award, GraduationCap, Medal, Activity, Users, Star } from 'lucide-react';

interface StatsCounterSectionProps {
  config: SchoolConfig;
}

export const StatsCounterSection: React.FC<StatsCounterSectionProps> = ({ config }) => {
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];
  const { stats } = config;

  const statList = [
    {
      label: 'Tingkat Kelulusan Siswa',
      value: stats.kelulusan,
      sub: 'Konsisten Unggul Tiap Angkatan',
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      label: 'Lolos Sekolah Lanjutan & PTN',
      value: stats.ptnFavorit,
      sub: 'Jalur Prestasi & Mandiri Favorit',
      icon: <Star className="w-6 h-6 text-white" />,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      label: 'Medali Prestasi Kompetisi',
      value: stats.medaliPrestasi,
      sub: 'Tingkat Internasional & Nasional',
      icon: <Medal className="w-6 h-6 text-white" />,
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Pilihan Ekstrakurikuler',
      value: stats.ekskulCount,
      sub: 'Sains, Seni, Olahraga & Kepemimpinan',
      icon: <Activity className="w-6 h-6 text-white" />,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'Pendidik Berkualifikasi S2/S3',
      value: stats.pengajarS2S3,
      sub: 'Sertifikasi Profesi & Riset Unggul',
      icon: <Award className="w-6 h-6 text-white" />,
      color: 'from-purple-600 to-pink-600',
    },
    {
      label: 'Jejaring Alumni Nusantara',
      value: stats.alumniTersebar,
      sub: 'Pemimpin di Berbagai Bidang',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'from-rose-600 to-red-600',
    },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
            Indikator Mutu & Rekam Jejak
          </span>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 ${font.headingClass}`}>
            Dedikasi Menjaga Standar Keunggulan Sekolah
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statList.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700/60 hover:border-slate-500 transition-all text-center flex flex-col items-center justify-between"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md mb-3`}>
                {item.icon}
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-black tracking-tight text-white mb-1 ${font.headingClass}`}>
                  {item.value}
                </div>
                <div className="text-xs font-bold text-slate-300 leading-snug">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
