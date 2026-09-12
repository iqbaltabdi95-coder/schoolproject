import React, { useState } from 'react';
import { SchoolConfig, FAQItem } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQSectionProps {
  config: SchoolConfig;
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ config, faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pusat Bantuan & Informasi Terbuka</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3 ${font.headingClass}`}>
            Pertanyaan yang Kerap Diajukan
          </h2>
          <p className="text-sm text-slate-600">
            Temukan jawaban komprehensif mengenai kurikulum, seleksi PPDB, dan ekosistem pendidikan kami.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-3xl bg-white border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">Masih memiliki pertanyaan lain seputar PPDB?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Tim konselor dan sekretariat PPDB siap mendampingi Anda.</p>
          </div>

          <a
            href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(config.name)},%20saya%20ingin%20bertanya%20seputar%20pendaftaran`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Konselor</span>
          </a>
        </div>

        </div>
      </div>
    </section>
  );
};
