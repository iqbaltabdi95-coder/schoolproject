import React, { useState } from 'react';
import { SchoolConfig } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';
import { 
  X, 
  GraduationCap, 
  CheckCircle, 
  MessageCircle, 
  User, 
  Phone, 
  School, 
  FileCheck,
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';

interface PPDBModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
}

export const PPDBModal: React.FC<PPDBModalProps> = ({ isOpen, onClose, config }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    whatsapp: '',
    previousSchool: '',
    jalur: 'Jalur Reguler Umum',
    message: '',
  });

  if (!isOpen) return null;

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      studentName: '',
      parentName: '',
      whatsapp: '',
      previousSchool: '',
      jalur: 'Jalur Reguler Umum',
      message: '',
    });
  };

  const createWhatsAppUrl = () => {
    const text = `Halo Panitia PPDB ${config.name},
Saya ingin mendaftarkan calon siswa:
• Nama Siswa: ${formData.studentName || '-'}
• Nama Wali: ${formData.parentName || '-'}
• No. WhatsApp: ${formData.whatsapp || '-'}
• Sekolah Asal: ${formData.previousSchool || '-'}
• Jalur Pendaftaran: ${formData.jalur}
• Catatan/Pertanyaan: ${formData.message || 'Mohon info tindak lanjut pendaftaran'}`;

    return `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, ${theme.primaryColor} 100%)`
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>PPDB Online Tahun Ajaran {config.ppdbStatus.tahunAjaran}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black">
            Pendaftaran Calon Peserta Didik Baru
          </h3>
          <p className="text-xs text-slate-200 mt-1">
            {config.name} — {config.ppdbStatus.gelombang}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <h4 className="text-xl font-black text-slate-900 mb-2">
                Data Pra-Pendaftaran Diterima!
              </h4>
              
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                Terima kasih, Bapak/Ibu <strong>{formData.parentName}</strong>. Data calon siswa <strong>{formData.studentName}</strong> telah tercatat pada sistem penerimaan kami.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 mb-6">
                <div><span className="text-slate-500">Jalur Dipilih:</span> <strong className="text-slate-800">{formData.jalur}</strong></div>
                <div><span className="text-slate-500">Sekolah Asal:</span> <strong className="text-slate-800">{formData.previousSchool || '-'}</strong></div>
                <div><span className="text-slate-500">Nomor WhatsApp:</span> <strong className="text-slate-800">{formData.whatsapp || '-'}</strong></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={createWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Konfirmasi via WhatsApp Panitia</span>
                </a>

                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Daftar Lagi
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-2.5 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Batas akhir gelombang: <strong>{config.ppdbStatus.deadline}</strong>. Kuota tersisa tinggal {config.ppdbStatus.kuotaTersisa} kursi!
                </span>
              </div>

              {/* Nama Siswa */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Calon Siswa *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Contoh: Muhammad Rayhan Pratama"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Nama Orang Tua */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Orang Tua / Wali *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Contoh: Ir. Bambang Wicaksono"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Grid 2: WhatsApp & Sekolah Asal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. WhatsApp Aktif *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="0812-3456-7890"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sekolah Asal Siswa
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="Nama institusi sekolah asal"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Jalur Masuk */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilihan Jalur Pendaftaran
                </label>
                <select
                  value={formData.jalur}
                  onChange={(e) => setFormData({ ...formData, jalur: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Jalur Reguler Umum">Jalur Reguler Umum</option>
                  <option value="Jalur Prestasi Akademik & Sains">Jalur Prestasi Akademik & Sains</option>
                  <option value="Jalur Prestasi Olahraga & Seni Budaya">Jalur Prestasi Olahraga & Seni Budaya</option>
                  <option value="Jalur Beasiswa Tahfidz Al-Qur'an">Jalur Beasiswa Tahfidz Al-Qur'an</option>
                  <option value="Jalur Kepemimpinan & Pengurus OSIS">Jalur Kepemimpinan & Pengurus OSIS</option>
                </select>
              </div>

              {/* Catatan / Pesan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pertanyaan / Konsultasi Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pertanyaan mengenai kurikulum, program beasiswa, atau kebutuhan khusus anak..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-md cursor-pointer ${theme.btnPrimary}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pra-Pendaftaran</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
