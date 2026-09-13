import React, { useState, useEffect } from 'react';
import { SchoolConfig, ThemePreset, FontPairing } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS, PRESET_SCHOOLS, DEFAULT_SCHOOL_CONFIG } from '../data/defaultSchoolData';
import { 
  X, 
  Sparkles, 
  Palette, 
  Type, 
  Building2, 
  GraduationCap, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  Sliders, 
  Flame, 
  MapPin, 
  Phone, 
  HelpCircle,
  Eye
} from 'lucide-react';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
  onChangeConfig: (newConfig: SchoolConfig) => void;
  onResetConfig: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onResetConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'identitas' | 'warna' | 'huruf' | 'ppdb'>('preset');

  // WCAG 2.1: Lock background scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTheme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_SCHOOLS.find(p => p.id === presetId);
    if (!preset) return;

    onChangeConfig({
      ...config,
      name: preset.name,
      shortName: preset.shortName,
      tagline: preset.tagline,
      city: preset.city,
      themePreset: preset.themePreset,
      fontPairing: preset.fontPairing,
    });
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `profil-sekolah-${config.shortName.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.name && parsed.themePreset) {
            onChangeConfig(parsed);
          }
        } catch (err) {
          console.error("Gagal mengimpor file konfigurasi:", err);
        }
      };
    }
  };

  return (
    <div 
      id="customizer-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
    >
      {/* Backdrop tap to dismiss */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6 pointer-events-none">
        <div className="w-screen max-w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
          
          {/* Header with WCAG 2.5.5 minimum 44x44px touch close button */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 id="customizer-drawer-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Studio Kustomisasi Sekolah</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide">
                    Demo
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Ubah identitas, gradasi warna, dan tipografi seketika.
                </p>
              </div>
            </div>

            {/* WCAG 2.5.5 Compliant: 44x44px Minimum Touch Target Close Button */}
            <button
              id="btn-close-customizer"
              onClick={onClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 shrink-0"
              aria-label="Tutup Panel Kustomisasi Sekolah"
              title="Tutup Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation: WCAG 2.5.5 min 44px touch targets with smooth touch scroll */}
          <div 
            role="tablist"
            aria-label="Kategori Kustomisasi"
            className="flex border-b border-slate-200 bg-slate-50 px-2 sm:px-3 pt-2 gap-1 text-xs font-bold text-slate-600 overflow-x-auto no-scrollbar scroll-smooth"
          >
            <button
              id="tab-preset"
              role="tab"
              aria-selected={activeTab === 'preset'}
              aria-controls="panel-preset"
              onClick={() => setActiveTab('preset')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-98 ${
                activeTab === 'preset'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Preset 1-Klik</span>
            </button>

            <button
              id="tab-warna"
              role="tab"
              aria-selected={activeTab === 'warna'}
              aria-controls="panel-warna"
              onClick={() => setActiveTab('warna')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-98 ${
                activeTab === 'warna'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Palet & Warna</span>
            </button>

            <button
              id="tab-huruf"
              role="tab"
              aria-selected={activeTab === 'huruf'}
              aria-controls="panel-huruf"
              onClick={() => setActiveTab('huruf')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-98 ${
                activeTab === 'huruf'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Jenis Huruf</span>
            </button>

            <button
              id="tab-identitas"
              role="tab"
              aria-selected={activeTab === 'identitas'}
              aria-controls="panel-identitas"
              onClick={() => setActiveTab('identitas')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-98 ${
                activeTab === 'identitas'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Identitas</span>
            </button>

            <button
              id="tab-ppdb"
              role="tab"
              aria-selected={activeTab === 'ppdb'}
              aria-controls="panel-ppdb"
              onClick={() => setActiveTab('ppdb')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-98 ${
                activeTab === 'ppdb'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-rose-500 shrink-0" />
              <span>PPDB</span>
            </button>
          </div>

          {/* Content Body: Smooth Touch Scrolling */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 overscroll-contain">
            
            {/* TAB 1: PRESET 1-KLIK UNTUK PRESENTASI */}
            {activeTab === 'preset' && (
              <div id="panel-preset" role="tabpanel" aria-labelledby="tab-preset" className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">Sangat Praktis untuk Demo Keliling:</strong>
                    Pilih nama contoh sekolah di bawah ini untuk melihat bagaimana keseluruhan portal berubah warna, gradasi, tipografi, dan identitas dalam 1 detik!
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {PRESET_SCHOOLS.map((preset) => {
                    const presetTheme = THEME_CONFIGS[preset.themePreset];
                    const isSelected = config.name === preset.name;

                    return (
                      <div
                        key={preset.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleApplyPreset(preset.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleApplyPreset(preset.id);
                          }
                        }}
                        aria-pressed={isSelected}
                        aria-label={`Pilih preset sekolah ${preset.name}`}
                        className={`p-4 min-h-[64px] rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${presetTheme.primaryColor}, ${presetTheme.secondaryColor})`
                            }}
                          >
                            {preset.name.split(' ').map(w => w[0]).slice(0, 3).join('')}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{preset.name}</span>
                              {isSelected && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">Aktif</span>}
                            </div>
                            <div className="text-[11px] text-slate-500 italic line-clamp-1">{preset.tagline}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{preset.city}</span>
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-bold text-slate-500 hover:text-indigo-600">Pilih</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: PALET & GRADASI */}
            {activeTab === 'warna' && (
              <div id="panel-warna" role="tabpanel" aria-labelledby="tab-warna" className="space-y-4">
                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                  Pilih skema warna gradasi yang memikat calon siswa. Gradasi diterapkan pada headline, tombol CTA, kartu prestasi, dan aksen navigasi.
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(THEME_CONFIGS).map(([key, item]) => {
                    const isSelected = config.themePreset === key;
                    return (
                      <div
                        key={key}
                        role="button"
                        tabIndex={0}
                        onClick={() => onChangeConfig({ ...config, themePreset: key as ThemePreset })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onChangeConfig({ ...config, themePreset: key as ThemePreset });
                          }
                        }}
                        aria-pressed={isSelected}
                        aria-label={`Pilih skema warna ${item.name}`}
                        className={`p-3.5 min-h-[56px] rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Color preview bar */}
                          <div 
                            className="w-12 h-11 min-w-[44px] min-h-[44px] rounded-xl shadow-xs border border-black/10 flex items-center justify-center shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${item.primaryColor}, ${item.secondaryColor})`
                            }}
                          >
                            <span className="text-white text-[10px] font-extrabold">Aa</span>
                          </div>

                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Warna Utama: <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">{item.primaryColor}</code>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: JENIS HURUF / TYPOGRAPHY */}
            {activeTab === 'huruf' && (
              <div id="panel-huruf" role="tabpanel" aria-labelledby="tab-huruf" className="space-y-4">
                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                  Ubah kombinasi jenis huruf judul (Heading Display) dan teks paragraf (Body Font) untuk mencocokkan karakter institusi sekolah.
                </div>

                <div className="space-y-3">
                  {Object.entries(FONT_CONFIGS).map(([key, item]) => {
                    const isSelected = config.fontPairing === key;
                    return (
                      <div
                        key={key}
                        role="button"
                        tabIndex={0}
                        onClick={() => onChangeConfig({ ...config, fontPairing: key as FontPairing })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onChangeConfig({ ...config, fontPairing: key as FontPairing });
                          }
                        }}
                        aria-pressed={isSelected}
                        aria-label={`Pilih pasangan tipografi ${item.name}`}
                        className={`p-4 min-h-[64px] rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.name}
                          </div>
                          <div className={`text-base font-extrabold text-slate-800 mt-1 ${item.headingClass}`}>
                            {config.name}
                          </div>
                          <div className={`text-xs text-slate-500 mt-0.5 ${item.bodyClass}`}>
                            Contoh tampilan teks paragraf dan motto pendidikan sekolah.
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: IDENTITAS TEKS MANUAL */}
            {activeTab === 'identitas' && (
              <div id="panel-identitas" role="tabpanel" aria-labelledby="tab-identitas" className="space-y-4">
                <div>
                  <label htmlFor="custom-school-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Sekolah (Tanpa Label SMA/SMP/SD/SMK) *
                  </label>
                  <input
                    id="custom-school-name"
                    type="text"
                    value={config.name}
                    onChange={(e) => onChangeConfig({ ...config, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Contoh: Sekolah Labschool Kebangsaan"
                  />
                </div>

                <div>
                  <label htmlFor="custom-short-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Panggilan Singkat Sekolah
                  </label>
                  <input
                    id="custom-short-name"
                    type="text"
                    value={config.shortName}
                    onChange={(e) => onChangeConfig({ ...config, shortName: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Contoh: Labschool Kebangsaan"
                  />
                </div>

                <div>
                  <label htmlFor="custom-tagline" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Motto / Slogan Sekolah
                  </label>
                  <input
                    id="custom-tagline"
                    type="text"
                    value={config.tagline}
                    onChange={(e) => onChangeConfig({ ...config, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Iman, Ilmu, Amal — Unggul, Mandiri, Berkarakter"
                  />
                </div>

                <div>
                  <label htmlFor="custom-accreditation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Akreditasi
                  </label>
                  <input
                    id="custom-accreditation"
                    type="text"
                    value={config.accreditation}
                    onChange={(e) => onChangeConfig({ ...config, accreditation: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Terakreditasi A (Unggul) BAN-S/M"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="custom-city" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kota / Wilayah
                    </label>
                    <input
                      id="custom-city"
                      type="text"
                      value={config.city}
                      onChange={(e) => onChangeConfig({ ...config, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="custom-est-year" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tahun Berdiri
                    </label>
                    <input
                      id="custom-est-year"
                      type="text"
                      value={config.establishedYear}
                      onChange={(e) => onChangeConfig({ ...config, establishedYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="custom-whatsapp" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp Penerimaan Siswa (PPDB)
                  </label>
                  <input
                    id="custom-whatsapp"
                    type="text"
                    value={config.whatsapp}
                    onChange={(e) => onChangeConfig({ ...config, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="0812-8889-1968"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: PENGATURAN PPDB */}
            {activeTab === 'ppdb' && (
              <div id="panel-ppdb" role="tabpanel" aria-labelledby="tab-ppdb" className="space-y-4">
                <div>
                  <label htmlFor="ppdb-school-year" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tahun Ajaran PPDB
                  </label>
                  <input
                    id="ppdb-school-year"
                    type="text"
                    value={config.ppdbStatus.tahunAjaran}
                    onChange={(e) => onChangeConfig({
                      ...config,
                      ppdbStatus: { ...config.ppdbStatus, tahunAjaran: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="ppdb-wave" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Gelombang PPDB
                  </label>
                  <input
                    id="ppdb-wave"
                    type="text"
                    value={config.ppdbStatus.gelombang}
                    onChange={(e) => onChangeConfig({
                      ...config,
                      ppdbStatus: { ...config.ppdbStatus, gelombang: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ppdb-deadline" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Batas Pendaftaran
                    </label>
                    <input
                      id="ppdb-deadline"
                      type="text"
                      value={config.ppdbStatus.deadline}
                      onChange={(e) => onChangeConfig({
                        ...config,
                        ppdbStatus: { ...config.ppdbStatus, deadline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="ppdb-quota" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Sisa Kuota Kursi
                    </label>
                    <input
                      id="ppdb-quota"
                      type="number"
                      value={config.ppdbStatus.kuotaTersisa}
                      onChange={(e) => onChangeConfig({
                        ...config,
                        ppdbStatus: { ...config.ppdbStatus, kuotaTersisa: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ppdb-promo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Promo / Beasiswa Khusus
                  </label>
                  <input
                    id="ppdb-promo"
                    type="text"
                    value={config.ppdbStatus.diskonEarlyBird}
                    onChange={(e) => onChangeConfig({
                      ...config,
                      ppdbStatus: { ...config.ppdbStatus, diskonEarlyBird: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions: WCAG 2.5.5 Compliant (All interactive buttons >= 48px height) */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-3 pb-safe">
            <div className="flex items-center justify-between gap-2.5">
              <button
                id="btn-export-json"
                onClick={handleExportJSON}
                className="flex-1 min-h-[48px] py-2.5 px-3.5 bg-white hover:bg-slate-100 active:scale-95 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Unduh konfigurasi sebagai file JSON"
                aria-label="Ekspor Konfigurasi Sekolah ke JSON"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Ekspor JSON</span>
              </button>

              <label 
                htmlFor="upload-json-input"
                className="flex-1 min-h-[48px] py-2.5 px-3.5 bg-white hover:bg-slate-100 active:scale-95 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer text-center focus-within:ring-2 focus-within:ring-indigo-500"
                aria-label="Impor Konfigurasi Sekolah dari JSON"
              >
                <Upload className="w-4 h-4 shrink-0" />
                <span>Impor JSON</span>
                <input
                  id="upload-json-input"
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="sr-only"
                />
              </label>

              {/* Reset button: WCAG 2.5.5 min 48x48px touch target */}
              <button
                id="btn-reset-customizer"
                onClick={onResetConfig}
                className="w-12 h-12 min-w-[48px] min-h-[48px] bg-white hover:bg-rose-50 active:scale-95 border border-slate-300 hover:border-rose-300 rounded-xl text-slate-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0"
                title="Kembalikan ke pengaturan awal"
                aria-label="Reset Konfigurasi Sekolah ke Pengaturan Awal"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Main Action Close & Live Button: 48px height */}
            <button
              id="btn-apply-close-customizer"
              onClick={onClose}
              className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm sm:text-base text-white shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.btnPrimary}`}
            >
              <Check className="w-5 h-5" />
              <span>Tutup & Tampilkan Hasil Live</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
