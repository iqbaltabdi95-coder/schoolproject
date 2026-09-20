import React, { useState } from 'react';
import { 
  UserProfile, 
  SchoolConfig, 
  CounselingNote, 
  SppBill 
} from '../../types';
import { SchoolDbService } from '../../services/schoolDbService';
import { generateKwitansiSPPPdf } from '../../utils/pdfGenerator';
import { 
  Users, 
  MessageSquare, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  Download, 
  Clock, 
  Calendar,
  Sparkles,
  HeartHandshake,
  Check
} from 'lucide-react';

interface WaliPortalSectionProps {
  config: SchoolConfig;
  currentUser: UserProfile;
  counselingNotes: CounselingNote[];
  sppBills: SppBill[];
}

export const WaliPortalSection: React.FC<WaliPortalSectionProps> = ({
  config,
  currentUser,
  counselingNotes,
  sppBills
}) => {
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positif' | 'evaluasi'>('all');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  // Filter notes for the current student
  const filteredNotes = counselingNotes.filter(n => {
    if (filterSentiment === 'positif') return n.sentiment === 'positif';
    if (filterSentiment === 'evaluasi') return n.sentiment === 'evaluasi';
    return true;
  });

  // Mark note as read
  const handleMarkAsRead = async (note: CounselingNote) => {
    try {
      await SchoolDbService.updateCounselingNote(note.id, {
        isRead: true
      });
      showNotice('Catatan ditandai telah dibaca oleh Orang Tua.');
    } catch (err) {
      console.error(err);
    }
  };

  // Download SPP Receipt
  const handleDownloadReceipt = (bill: SppBill) => {
    generateKwitansiSPPPdf(config, bill);
    showNotice(`Kuitansi resmi SPP bulan ${bill.month} berhasil diunduh.`);
  };

  // Find latest bill for Farhan
  const latestBill = sppBills.find(b => b.studentId === 'user_siswa_farhan') || sppBills[0];

  return (
    <div className="space-y-6">
      {/* Parent & Student Information Capsule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{currentUser.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
                Wali Siswa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              NIK: <code className="font-mono text-slate-700 font-bold">{currentUser.identityNumber}</code> • Kontak: {currentUser.phone}
            </p>
            <p className="text-xs font-semibold text-amber-800 mt-1">
              {currentUser.titleOrClass}
            </p>
          </div>
        </div>

        {/* Current SPP Bill Card */}
        <div className="md:col-span-5 bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-600 font-bold">Status Iuran SPP Sekolah</span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              latestBill?.status === 'Lunas' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {latestBill?.status || 'Lunas'}
            </span>
          </div>

          <div className="text-lg font-black text-emerald-900">
            Rp {(latestBill?.amount || 2750000).toLocaleString('id-ID')}
            <span className="text-xs font-normal text-slate-500 ml-1.5">/ {latestBill?.month || 'September 2024'}</span>
          </div>

          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>VA: <code className="font-mono text-slate-800 font-bold">{latestBill?.vaNumber || '8801 0078 1923 4100'}</code></span>
            {latestBill?.status === 'Lunas' && (
              <button
                onClick={() => handleDownloadReceipt(latestBill)}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                title="Cetak Kuitansi SPP"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cetak Kuitansi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {statusNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Main Section: Buku Penghubung & Catatan BK / Wali Kelas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Buku Penghubung & Catatan Wali Kelas / BK
              </h4>
              <p className="text-xs text-slate-500">
                Laporan perkembangan karakter, catatan prestasi, kedisiplinan, dan rekomendasi bimbingan siswa
              </p>
            </div>
          </div>

          {/* Filter Pill Tabs */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setFilterSentiment('all')}
              className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                filterSentiment === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Catatan ({counselingNotes.length})
            </button>

            <button
              onClick={() => setFilterSentiment('positif')}
              className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 ${
                filterSentiment === 'positif'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Prestasi & Teladan ({counselingNotes.filter(n => n.sentiment === 'positif').length})</span>
            </button>

            <button
              onClick={() => setFilterSentiment('evaluasi')}
              className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 ${
                filterSentiment === 'evaluasi'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pembinaan & Afektif ({counselingNotes.filter(n => n.sentiment === 'evaluasi').length})</span>
            </button>
          </div>
        </div>

        {/* Notes Cards List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada catatan pada filter ini.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isPositif = note.sentiment === 'positif';

              return (
                <div 
                  key={note.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-3 ${
                    isPositif
                      ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300'
                      : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  {/* Card Header: Author, Role, Date & Sentiment Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                        isPositif 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-amber-500 text-white'
                      }`}>
                        {isPositif ? <Award className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{isPositif ? 'Catatan Baik & Prestasi' : 'Catatan Pembinaan & Evaluasi'}</span>
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        Kategori: {note.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{note.date}</span>
                      </span>

                      {!note.isRead ? (
                        <button
                          onClick={() => handleMarkAsRead(note)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer transition-colors"
                        >
                          Tandai Telah Dibaca
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                          <Check className="w-3 h-3" />
                          <span>Telah Dibaca</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h5 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {note.title}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pendidik: <strong className="text-slate-800">{note.authorName}</strong> ({note.authorRole})
                    </p>
                  </div>

                  {/* Description / Note */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-slate-200/80">
                    {note.note}
                  </p>

                  {/* Action Needed / Tindak Lanjut dari Orang Tua */}
                  {note.actionNeeded && (
                    <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                      isPositif 
                        ? 'bg-emerald-100/70 border border-emerald-200 text-emerald-900' 
                        : 'bg-amber-100/80 border border-amber-200 text-amber-950 font-medium'
                    }`}>
                      <HeartHandshake className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Tindak Lanjut yang Diharapkan dari Orang Tua / Rumah:</strong>
                        <p className="mt-0.5 leading-normal">{note.actionNeeded}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
