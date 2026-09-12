import React, { useState } from 'react';
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
  const [copiedNotification, setCopiedNotification] = useState(false);

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Studio Kustomisasi Sekolah</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase">
                    Demo Mode
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ubah nama, gradasi warna, dan identitas seketika saat presentasi.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 text-xs font-bold text-slate-600 overflow-x-auto">
            <button
              onClick={() => setActiveTab('preset')}
              className={`px-3 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'preset'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Preset 1-Klik</span>
            </button>

            <button
              onClick={() => setActiveTab('warna')}
              className={`px-3 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'warna'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span>Palet & Gradasi</span>
            </button>

            <button
              onClick={() => setActiveTab('huruf')}
              className={`px-3 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'huruf'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-cyan-500" />
              <span>Jenis Huruf</span>
            </button>

            <button
              onClick={() => setActiveTab('identitas')}
              className={`px-3 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'identitas'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Identitas Teks</span>
            </button>

            <button
              onClick={() => setActiveTab('ppdb')}
              className={`px-3 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ppdb'
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
              <span>Info PPDB</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
            
            {/* TAB 1: PRESET 1-KLIK UNTUK PRESENTASI */}
            {activeTab === 'preset' && (
              <div className="space-y-4">
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
                        onClick={() => handleApplyPreset(preset.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                            style={{
                              background: `linear-gradient(135deg, ${presetTheme.primaryColor}, ${presetTheme.secondaryColor})`
                            }}
                          >
                            {preset.name.split(' ').map(w => w[0]).slice(0, 3).join('')}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{preset.name}</span>
                              {isSelected && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.2 rounded-full font-semibold">Aktif</span>}
                            </div>
                            <div className="text-[11px] text-slate-500 italic line-clamp-1">{preset.tagline}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{preset.city}</span>
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 hover:text-indigo-600">Pilih</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: PALET & GRADASI */}
            {activeTab === 'warna' && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                  Pilih skema warna gradasi yang memikat calon siswa. Gradasi diterapkan pada headline, tombol CTA, kartu prestasi, dan aksen navigasi.
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(THEME_CONFIGS).map(([key, item]) => {
                    const isSelected = config.themePreset === key;
                    return (
                      <div
                        key={key}
                        onClick={() => onChangeConfig({ ...config, themePreset: key as ThemePreset })}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Color preview bar */}
                          <div 
                            className="w-12 h-10 rounded-xl shadow-xs border border-black/10 flex items-center justify-center"
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
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
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
              <div className="space-y-4">
                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                  Ubah kombinasi jenis huruf judul (Heading Display) dan teks paragraf (Body Font) untuk mencocokkan karakter institusi sekolah.
                </div>

                <div className="space-y-3">
                  {Object.entries(FONT_CONFIGS).map(([key, item]) => {
                    const isSelected = config.fontPairing === key;
                    return (
                      <div
                        key={key}
                        onClick={() => onChangeConfig({ ...config, fontPairing: key as FontPairing })}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
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
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
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
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Sekolah (Tanpa Label SMA/SMP/SD/SMK) *
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => onChangeConfig({ ...config, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: Sekolah Labschool Kebangsaan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Panggilan Singkat Sekolah
                  </label>
                  <input
                    type="text"
                    value={config.shortName}
                    onChange={(e) => onChangeConfig({ ...config, shortName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: Labschool Kebangsaan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Motto / Slogan Sekolah
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => onChangeConfig({ ...config, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="Iman, Ilmu, Amal — Unggul, Mandiri, Berkarakter"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Akreditasi
                  </label>
                  <input
                    type="text"
                    value={config.accreditation}
                    onChange={(e) => onChangeConfig({ ...config, accreditation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="Terakreditasi A (Unggul) BAN-S/M"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Kota / Wilayah
                    </label>
                    <input
                      type="text"
                      value={config.city}
                      onChange={(e) => onChangeConfig({ ...config, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tahun Berdiri
                    </label>
                    <input
                      type="text"
                      value={config.establishedYear}
                      onChange={(e) => onChangeConfig({ ...config, establishedYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor WhatsApp Penerimaan Siswa (PPDB)
                  </label>
                  <input
                    type="text"
                    value={config.whatsapp}
                    onChange={(e) => onChangeConfig({ ...config, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="0812-8889-1968"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: PENGATURAN PPDB */}
            {activeTab === 'ppdb' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tahun Ajaran PPDB
                  </label>
                  <input
                    type="text"
                    value={config.ppdbStatus.tahunAjaran}
                    onChange={(e) => onChangeConfig({
                      ...config,
                      ppdbStatus: { ...config.ppdbStatus, tahunAjaran: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Gelombang PPDB
                  </label>
                  <input
                    type="text"
                    value={config.ppdbStatus.gelombang}
                    onChange={(e) => onChangeConfig({
                      ...config,
                      ppdbStatus: { ...config.ppdbStatus, gelombang: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Batas Pendaftaran
                    </label>
                    <input
                      type="text"
                      value={config.ppdbStatus.deadline}
                      onChange={(e) => onChangeConfig({
                        ...config,
                        ppdbStatus: { ...config.ppdbStatus, deadline: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sisa Kuota Kursi
                    </label>
                    <input
                      type="number"
                      value={config.ppdbStatus.kuotaTersisa}
                      onChange={(e) => onChangeConfig({
                        ...config,
                        ppdbStatus: { ...config.ppdbStatus, kuotaTersisa: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Promo / Beasiswa Khusus
                  </label>
                  <input
                    type="text"
                    value={config.ppdbStatus.diskonEarlyBird}
                    onChange={(e) => onChangeConfig({
                      ...config,
                      ppdbStatus: { ...config.ppdbStatus, diskonEarlyBird: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions: Export, Import, Reset, Close */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleExportJSON}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Unduh konfigurasi sebagai file JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor JSON</span>
              </button>

              <label className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Impor JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <button
                onClick={onResetConfig}
                className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                title="Kembalikan ke pengaturan awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-sm cursor-pointer ${currentTheme.btnPrimary}`}
            >
              Tutup & Tampilkan Hasil Live
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
