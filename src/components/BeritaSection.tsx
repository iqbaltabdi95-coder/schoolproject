import React, { useState } from 'react';
import { SchoolConfig, NewsItem } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { Newspaper, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface BeritaSectionProps {
  config: SchoolConfig;
  newsList: NewsItem[];
}

export const BeritaSection: React.FC<BeritaSectionProps> = ({ config, newsList }) => {
  const [activeTab, setActiveTab] = useState<'Berita' | 'Agenda'>('Berita');
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const agendas = [
    {
      day: '19',
      month: 'SEP',
      year: '2026',
      title: 'Simulasi Akbar Olimpiade Sains & Riset Pelajar',
      time: '08.00 - 12.00 WIB',
      location: 'Laboratorium Terpadu Kampus',
    },
    {
      day: '26',
      month: 'SEP',
      year: '2026',
      title: 'Open House & Parents Gathering PPDB 2026/2027',
      time: '09.00 - 13.00 WIB',
      location: 'Amphitheater & Hall Pertunjukan',
    },
    {
      day: '03',
      month: 'OKT',
      year: '2026',
      title: 'Latihan Dasar Kepemimpinan Siswa (LDKS) Angkatan Anyar',
      time: '07.00 - Selesai',
      location: 'Bumi Perkemahan Karakter Mandiri',
    },
    {
      day: '15',
      month: 'OKT',
      year: '2026',
      title: 'Gelar Seni & Budaya Nusantara Tahunan',
      time: '13.00 - 18.00 WIB',
      location: 'Plaza Kreativitas Siswa',
    },
  ];

  return (
    <section id="berita" className="scroll-mt-20 pt-7 sm:pt-8 pb-16 sm:pb-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 mb-3">
              <Newspaper className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kabar & Informasi Terkini</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 tracking-tight ${font.headingClass}`}>
              Warta & Agenda Kegiatan di{' '}
              <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
                {config.name}
              </span>
            </h2>
          </div>

          {/* Toggle Tab Berita / Agenda */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('Berita')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'Berita'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Berita & Artikel
            </button>
            <button
              onClick={() => setActiveTab('Agenda')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'Agenda'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kalender Agenda
            </button>
          </div>
        </div>

        {activeTab === 'Berita' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsList.map((item) => (
              <div 
                key={item.id}
                className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h3 className={`text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 ${font.headingClass}`}>
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1">
                  <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agendas.map((agenda, index) => (
              <div
                key={index}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all flex items-start gap-5"
              >
                {/* Date Box */}
                <div 
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                >
                  <span className="text-xl font-black leading-none">{agenda.day}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{agenda.month}</span>
                </div>

                {/* Agenda Info */}
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {agenda.title}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{agenda.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Lokasi:</span>
                      <span>{agenda.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
