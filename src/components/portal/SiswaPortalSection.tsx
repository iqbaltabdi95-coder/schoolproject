import React, { useState } from 'react';
import { 
  UserProfile, 
  SchoolConfig, 
  AssignmentQueue, 
  StudentSubmission, 
  LibraryBook 
} from '../../types';
import { SchoolDbService } from '../../services/schoolDbService';
import { generateEbookPdf } from '../../utils/pdfGenerator';
import { MOCK_STUDENT_DATA } from '../../data/portalAndLibraryData';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Upload, 
  BookOpen, 
  CheckCircle, 
  FileText, 
  Eye, 
  Download, 
  X, 
  Star, 
  ExternalLink,
  Award,
  BookMarked
} from 'lucide-react';

interface SiswaPortalSectionProps {
  config: SchoolConfig;
  currentUser: UserProfile;
  assignments: AssignmentQueue[];
  submissions: StudentSubmission[];
  books: LibraryBook[];
  onNavigateToElibrary: () => void;
}

export const SiswaPortalSection: React.FC<SiswaPortalSectionProps> = ({
  config,
  currentUser,
  assignments,
  submissions,
  books,
  onNavigateToElibrary
}) => {
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    submissionType: 'Laporan Praktikum PDF',
    notes: ''
  });

  // E-book reader modal state
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<'normal' | 'large'>('normal');
  const [readerDark, setReaderDark] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Submit task handler
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !uploadForm.fileName.trim()) return;

    const assignment = assignments.find(a => a.id === selectedAssignmentId);
    const title = assignment ? assignment.title : 'Tugas Mandiri Digital';

    try {
      await SchoolDbService.submitStudentTask({
        assignmentId: selectedAssignmentId,
        assignmentTitle: title,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentNisn: currentUser.identityNumber,
        studentClass: currentUser.titleOrClass,
        submissionType: uploadForm.submissionType,
        fileName: uploadForm.fileName.endsWith('.pdf') ? uploadForm.fileName : `${uploadForm.fileName}.pdf`,
        notes: uploadForm.notes,
        status: 'Terkumpul'
      });

      showNotice(`Berkas "${uploadForm.fileName}" berhasil diunggah ke Portal Guru.`);
      setIsUploadModalOpen(false);
      setUploadForm({
        fileName: '',
        submissionType: 'Laporan Praktikum PDF',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle open reader
  const handleOpenReader = (book: LibraryBook) => {
    setActiveReadingBook(book);
    SchoolDbService.incrementBookRead(book.id);
  };

  // Handle download e-book
  const handleDownloadBook = (book: LibraryBook) => {
    generateEbookPdf(config, book);
    showNotice(`E-Book "${book.title}" berhasil diunduh ke perangkat Anda.`);
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Capsule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{currentUser.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Siswa Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              NISN: <code className="font-mono text-slate-700 font-bold">{currentUser.identityNumber}</code> • Semester Ganjil 2024/2025
            </p>
            <p className="text-xs font-semibold text-indigo-600 mt-1">
              {currentUser.titleOrClass}
            </p>
          </div>
        </div>

        {/* Attendance Capsule */}
        <div className="md:col-span-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
          <div className="font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>Presensi Kehadiran Kelas</span>
            <span className="text-emerald-600 font-extrabold">98.2%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.2%' }} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Hadir: 98.2%</span>
            <span>Sakit: 1.8%</span>
            <span>Izin: 0%</span>
            <span>Alpa: 0%</span>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Grid: 2 Cols (Jadwal & Tugas Digital) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Col Left: Jadwal Kelas Hari Ini */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-base font-bold text-slate-900">Jadwal Kelas Hari Ini</h4>
                <p className="text-[11px] text-slate-400">Jadwal tatap muka laboratorium & smart class</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Senin, Pekan 07</span>
          </div>

          <div className="space-y-3">
            {MOCK_STUDENT_DATA.scheduleToday.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex items-start justify-between gap-3 bg-slate-50/50 hover:bg-white">
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

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold shrink-0">
                  Sesi {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col Right: Tugas & Asesmen Digital */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Tugas & Asesmen Digital</h4>
                  <p className="text-[11px] text-slate-400">Unggah tugas laboratorium dan lihat nilai hasil evaluasi guru</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (assignments.length > 0) {
                    setSelectedAssignmentId(assignments[0].id);
                  }
                  setIsUploadModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Tugas</span>
              </button>
            </div>

            {/* List of Active Assignments from Guru */}
            <div className="space-y-3">
              {assignments.map((asg) => {
                const mySubmission = submissions.find(
                  s => s.assignmentId === asg.id && s.studentId === currentUser.id
                );

                return (
                  <div key={asg.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                          {asg.subject} • {asg.type}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{asg.title}</h5>
                      </div>

                      {mySubmission ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          mySubmission.status === 'Dinilai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {mySubmission.status === 'Dinilai' ? `Nilai: ${mySubmission.score}` : 'Terkumpul'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Belum Unggah
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {asg.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Batas: {asg.deadline}</span>
                      
                      {mySubmission ? (
                        <span className="text-emerald-700 font-semibold">
                          Berkas: {mySubmission.fileName}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAssignmentId(asg.id);
                            setIsUploadModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah Sekarang</span>
                        </button>
                      )}
                    </div>

                    {/* Teacher Feedback if graded */}
                    {mySubmission?.feedback && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                        <strong>Feedback Guru ({asg.teacherName}):</strong> "{mySubmission.feedback}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
            <span>Tugas Aktif: {assignments.length}</span>
            <span>Tugas Selesai Dinilai: {submissions.filter(s => s.studentId === currentUser.id && s.status === 'Dinilai').length}</span>
          </div>
        </div>

      </div>

      {/* ==========================================
          E-BOOK & LITERASI DIGITAL (OPEN IN-APP & DOWNLOAD)
          ========================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-700">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">E-Book & Khazanah Literasi Siswa</h4>
              <p className="text-xs text-slate-500">Buka buku langsung di aplikasi atau unduh berkas offline ke perangkat</p>
            </div>
          </div>

          <button
            onClick={onNavigateToElibrary}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            <span>Katalog Lengkap E-Library</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* E-Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {books.slice(0, 4).map((book) => (
            <div 
              key={book.id} 
              className="rounded-2xl border border-slate-200 hover:border-cyan-400 overflow-hidden bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-bold uppercase">
                    {book.category}
                  </span>
                </div>
                <div className="p-4">
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1">
                    {book.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {book.author}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleOpenReader(book)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka E-Book</span>
                </button>

                <button
                  onClick={() => handleDownloadBook(book)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                  title="Unduh E-Book"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rekapitulasi Rapor Digital */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900">Rekapitulasi Capaian Rapor Digital</h4>
            <p className="text-xs text-slate-500">Penilaian Formatif & Asesmen Sumatif Tengah Semester</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 text-xs font-bold">
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

      {/* ==========================================
          MODAL UNGGAH TUGAS & ASESMEN DIGITAL
          ========================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Unggah Tugas & Asesmen Digital</span>
              </h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Penugasan Aktif</label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  {assignments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.subject} — {a.title} ({a.deadline})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Berkas / Judul File</label>
                <input
                  type="text"
                  required
                  value={uploadForm.fileName}
                  onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  placeholder="Laporan_Fisika_Optika_FarhanAditya.pdf"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori Dokumen</label>
                <select
                  value={uploadForm.submissionType}
                  onChange={(e) => setUploadForm({ ...uploadForm, submissionType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Laporan Praktikum PDF">Laporan Praktikum Laboratorium (PDF)</option>
                  <option value="Proposal Riset Ilmiah">Proposal Riset Ilmiah / Karya Ilmiah Remaja</option>
                  <option value="Dokumen Esai Analitis">Esai Analitis & Presentasi Proyek</option>
                  <option value="Portofolio Karya">Portofolio Karya Seni / Pemrograman</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan / Keterangan Siswa</label>
                <textarea
                  rows={3}
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Tuliskan catatan tambahan untuk guru pengampu, lampiran referensi, dll..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Kirim Berkas Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL IN-APP E-BOOK READER
          ========================================== */}
      {activeReadingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-3xl w-full shadow-2xl border transition-all duration-300 max-h-[92vh] flex flex-col ${
            readerDark 
              ? 'bg-slate-950 border-slate-800 text-slate-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className={`p-4 sm:p-6 border-b flex items-center justify-between ${
              readerDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-500 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base line-clamp-1">{activeReadingBook.title}</h3>
                  <p className="text-xs text-slate-400">Oleh: {activeReadingBook.author} • ISBN: {activeReadingBook.isbn}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReaderFontSize(readerFontSize === 'normal' ? 'large' : 'normal')}
                  className="px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer"
                >
                  {readerFontSize === 'normal' ? 'A+' : 'A-'}
                </button>
                <button
                  onClick={() => setReaderDark(!readerDark)}
                  className="px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer"
                >
                  {readerDark ? '☀️ Terang' : '🌙 Gelap'}
                </button>
                <button
                  onClick={() => handleDownloadBook(activeReadingBook)}
                  className="p-1.5 rounded-lg border hover:bg-slate-200/50 cursor-pointer"
                  title="Unduh E-Book"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveReadingBook(null)}
                  className="p-1.5 rounded-lg border hover:bg-rose-100 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reading Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                <strong>Sinopsis:</strong> {activeReadingBook.description}
              </div>

              <div className={`prose max-w-none leading-relaxed whitespace-pre-line font-serif ${
                readerFontSize === 'large' ? 'text-lg' : 'text-sm'
              }`}>
                {activeReadingBook.sampleChapterText}
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-xs ${
              readerDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span>Total Halaman: {activeReadingBook.pages}</span>
              <button
                onClick={() => handleDownloadBook(activeReadingBook)}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh E-Book Lengkap</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
