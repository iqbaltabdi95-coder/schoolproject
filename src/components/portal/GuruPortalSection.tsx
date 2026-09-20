import React, { useState } from 'react';
import { 
  TeachingJournal, 
  AssignmentQueue, 
  StudentSubmission, 
  UserProfile, 
  SchoolConfig 
} from '../../types';
import { SchoolDbService } from '../../services/schoolDbService';
import { 
  Calendar, 
  Clock, 
  FileSpreadsheet, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  Users, 
  BookOpen, 
  Check, 
  X, 
  Award,
  AlertCircle
} from 'lucide-react';

interface GuruPortalSectionProps {
  config: SchoolConfig;
  currentUser: UserProfile;
  journals: TeachingJournal[];
  assignments: AssignmentQueue[];
  submissions: StudentSubmission[];
}

export const GuruPortalSection: React.FC<GuruPortalSectionProps> = ({
  config,
  currentUser,
  journals,
  assignments,
  submissions
}) => {
  // Modal states for Jurnal Mengajar
  const [isAddJournalOpen, setIsAddJournalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<TeachingJournal | null>(null);
  const [journalForm, setJournalForm] = useState({
    classGrade: 'XI Sains 1',
    subject: 'Fisika Eksperimental',
    topic: '',
    timeRange: '07.30 - 09.00 WIB',
    date: new Date().toISOString().split('T')[0],
    completed: true,
    attendanceSummary: 'Hadir 34/34 siswa lengkap',
    reflectionNotes: ''
  });

  // Modal states for Assignment Queue
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentQueue | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({
    classGrade: 'XI Sains 1',
    subject: 'Fisika Eksperimental',
    title: '',
    description: '',
    deadline: '3 Hari Lagi, 23.59 WIB',
    type: 'Formatif' as 'Formatif' | 'Sumatif' | 'Portofolio' | 'Proyek',
    totalStudents: 34
  });

  // Modal states for Grading & Submissions
  const [activeGradingAssignment, setActiveGradingAssignment] = useState<AssignmentQueue | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<StudentSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  // ==========================================
  // JURNAL MENGAJAR HANDLERS
  // ==========================================
  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalForm.topic.trim()) return;

    try {
      if (editingJournal) {
        await SchoolDbService.updateTeachingJournal(editingJournal.id, {
          ...journalForm
        });
        showNotice('Jurnal mengajar berhasil diperbarui.');
      } else {
        await SchoolDbService.addTeachingJournal({
          teacherId: currentUser.id,
          teacherName: currentUser.name,
          ...journalForm
        });
        showNotice('Jurnal mengajar hari ini berhasil disimpan ke database.');
      }
      setIsAddJournalOpen(false);
      setEditingJournal(null);
      setJournalForm({
        classGrade: 'XI Sains 1',
        subject: 'Fisika Eksperimental',
        topic: '',
        timeRange: '07.30 - 09.00 WIB',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        attendanceSummary: 'Hadir 34/34 siswa lengkap',
        reflectionNotes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleJournalStatus = async (journal: TeachingJournal) => {
    try {
      await SchoolDbService.updateTeachingJournal(journal.id, {
        completed: !journal.completed
      });
      showNotice(`Status jurnal kelas ${journal.classGrade} diperbarui.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    if (window.confirm('Hapus jurnal mengajar ini dari database?')) {
      try {
        await SchoolDbService.deleteTeachingJournal(id);
        showNotice('Jurnal mengajar berhasil dihapus.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ==========================================
  // ASSIGNMENT HANDLERS
  // ==========================================
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.title.trim()) return;

    try {
      if (editingAssignment) {
        await SchoolDbService.updateAssignment(editingAssignment.id, {
          ...assignmentForm
        });
        showNotice('Antrean penilaian/tugas berhasil diperbarui.');
      } else {
        await SchoolDbService.addAssignment({
          teacherId: currentUser.id,
          teacherName: currentUser.name,
          ...assignmentForm,
          submittedCount: 0
        });
        showNotice('Tugas baru berhasil diterbitkan untuk siswa.');
      }
      setIsAddAssignmentOpen(false);
      setEditingAssignment(null);
      setAssignmentForm({
        classGrade: 'XI Sains 1',
        subject: 'Fisika Eksperimental',
        title: '',
        description: '',
        deadline: '3 Hari Lagi, 23.59 WIB',
        type: 'Formatif',
        totalStudents: 34
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (window.confirm('Hapus antrean penugasan ini dari database?')) {
      try {
        await SchoolDbService.deleteAssignment(id);
        showNotice('Penugasan berhasil dihapus.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Grading submission
  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      await SchoolDbService.gradeStudentSubmission(
        gradingSubmission.id,
        Number(scoreInput),
        feedbackInput
      );
      showNotice(`Nilai ${scoreInput} untuk ${gradingSubmission.studentName} berhasil disimpan.`);
      setGradingSubmission(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Capsule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{currentUser.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                Guru Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              NIP: <code className="font-mono text-slate-700 font-bold">{currentUser.identityNumber}</code> • Email: {currentUser.email}
            </p>
            <p className="text-xs font-semibold text-emerald-700 mt-1">
              {currentUser.titleOrClass}
            </p>
          </div>
        </div>

        <div className="md:col-span-4 bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Database Status:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
              Cloud Sync Aktif
            </span>
          </div>
          <div className="text-slate-600 text-[11px] leading-tight">
            Semua perubahan jurnal mengajar dan penilaian tugas tersinkronisasi realtime di Firestore.
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

      {/* Grid: 2 Columns (Jurnal Mengajar & Antrean Penilaian) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==========================================
            COL 1: JURNAL MENGAJAR HARI INI (CRUD)
            ========================================== */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Jurnal Mengajar Hari Ini</h4>
                  <p className="text-[11px] text-slate-400">Pencatatan materi ajar, kelas, & presensi tatap muka</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingJournal(null);
                  setJournalForm({
                    classGrade: 'XI Sains 1',
                    subject: 'Fisika Eksperimental',
                    topic: '',
                    timeRange: '07.30 - 09.00 WIB',
                    date: new Date().toISOString().split('T')[0],
                    completed: true,
                    attendanceSummary: 'Hadir 34/34 siswa lengkap',
                    reflectionNotes: ''
                  });
                  setIsAddJournalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jurnal</span>
              </button>
            </div>

            {/* List of Journals */}
            <div className="space-y-3">
              {journals.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada jurnal mengajar. Klik tombol di atas untuk menambah.
                </div>
              ) : (
                journals.map((j) => (
                  <div 
                    key={j.id} 
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 hover:bg-white space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                          {j.timeRange}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800">{j.classGrade}</span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs font-semibold text-indigo-600">{j.subject}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingJournal(j);
                            setJournalForm({
                              classGrade: j.classGrade,
                              subject: j.subject,
                              topic: j.topic,
                              timeRange: j.timeRange,
                              date: j.date,
                              completed: j.completed,
                              attendanceSummary: j.attendanceSummary || '',
                              reflectionNotes: j.reflectionNotes || ''
                            });
                            setIsAddJournalOpen(true);
                          }}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 cursor-pointer"
                          title="Edit Jurnal"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteJournal(j.id)}
                          className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Hapus Jurnal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-900">
                      Topik: {j.topic}
                    </div>

                    {j.attendanceSummary && (
                      <div className="text-[11px] text-slate-600">
                        Presensi: <span className="font-medium text-slate-700">{j.attendanceSummary}</span>
                      </div>
                    )}

                    {j.reflectionNotes && (
                      <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-100">
                        "{j.reflectionNotes}"
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">Tgl: {j.date}</span>
                      <button
                        onClick={() => handleToggleJournalStatus(j)}
                        className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                          j.completed ? 'text-emerald-700 hover:text-emerald-800' : 'text-amber-600 hover:text-amber-700'
                        }`}
                      >
                        {j.completed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Terlaksana</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Terjadwal / Belum</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
            <span>Total Jurnal: {journals.length} sesi</span>
            <span>Terlaksana: {journals.filter(j => j.completed).length} sesi</span>
          </div>
        </div>

        {/* ==========================================
            COL 2: ANTREAN PENILAIAN & TUGAS (CRUD)
            ========================================== */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Antrean Penilaian Formatif & Tugas</h4>
                  <p className="text-[11px] text-slate-400">Pemberian instruksi asesmen, periksa berkas, dan beri nilai</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingAssignment(null);
                  setAssignmentForm({
                    classGrade: 'XI Sains 1',
                    subject: 'Fisika Eksperimental',
                    title: '',
                    description: '',
                    deadline: '3 Hari Lagi, 23.59 WIB',
                    type: 'Formatif',
                    totalStudents: 34
                  });
                  setIsAddAssignmentOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Tugas</span>
              </button>
            </div>

            {/* List of Assignments */}
            <div className="space-y-3">
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada penugasan aktif. Klik Buat Tugas di atas.
                </div>
              ) : (
                assignments.map((asg) => {
                  const taskSubmissions = submissions.filter(s => s.assignmentId === asg.id);
                  const gradedCount = taskSubmissions.filter(s => s.status === 'Dinilai').length;

                  return (
                    <div 
                      key={asg.id} 
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 hover:bg-white space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                              {asg.type}
                            </span>
                            <span className="text-xs font-bold text-slate-700">{asg.classGrade}</span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs text-slate-500">{asg.subject}</span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{asg.title}</h5>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingAssignment(asg);
                              setAssignmentForm({
                                classGrade: asg.classGrade,
                                subject: asg.subject,
                                title: asg.title,
                                description: asg.description,
                                deadline: asg.deadline,
                                type: asg.type,
                                totalStudents: asg.totalStudents
                              });
                              setIsAddAssignmentOpen(true);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 cursor-pointer"
                            title="Edit Tugas"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(asg.id)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Hapus Tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {asg.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[11px] text-slate-500">
                          Terkumpul: <strong className="text-indigo-600">{taskSubmissions.length || asg.submittedCount}</strong>/{asg.totalStudents} siswa ({gradedCount} telah dinilai)
                        </div>

                        <button
                          onClick={() => setActiveGradingAssignment(asg)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Periksa & Nilai ({taskSubmissions.length})</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
            <span>Total Tugas: {assignments.length} penugasan</span>
            <span>Total Berkas Terkumpul: {submissions.length} berkas</span>
          </div>
        </div>

      </div>

      {/* ==========================================
          MODAL 1: TAMBAH / EDIT JURNAL MENGAJAR
          ========================================== */}
      {isAddJournalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>{editingJournal ? 'Edit Jurnal Mengajar' : 'Tambah Jurnal Mengajar Hari Ini'}</span>
              </h3>
              <button 
                onClick={() => setIsAddJournalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas Diampu</label>
                  <input
                    type="text"
                    required
                    value={journalForm.classGrade}
                    onChange={(e) => setJournalForm({ ...journalForm, classGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Contoh: XI Sains 1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={journalForm.subject}
                    onChange={(e) => setJournalForm({ ...journalForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Fisika Eksperimental"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Topik & Kompetensi Pembelajaran</label>
                <input
                  type="text"
                  required
                  value={journalForm.topic}
                  onChange={(e) => setJournalForm({ ...journalForm, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  placeholder="Contoh: Difraksi Laser dan Ketidakpastian Pengukuran"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rentang Jam Pertemuan</label>
                  <input
                    type="text"
                    required
                    value={journalForm.timeRange}
                    onChange={(e) => setJournalForm({ ...journalForm, timeRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    placeholder="07.30 - 09.00 WIB"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={journalForm.date}
                    onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ringkasan Presensi Siswa</label>
                <input
                  type="text"
                  value={journalForm.attendanceSummary}
                  onChange={(e) => setJournalForm({ ...journalForm, attendanceSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Hadir 34/34 siswa lengkap"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Refleksi / Kendala Kelas</label>
                <textarea
                  rows={2}
                  value={journalForm.reflectionNotes}
                  onChange={(e) => setJournalForm({ ...journalForm, reflectionNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Catatan keaktifan siswa atau tindak lanjut laboratorium..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="completedCheck"
                  checked={journalForm.completed}
                  onChange={(e) => setJournalForm({ ...journalForm, completed: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="completedCheck" className="text-slate-700 font-semibold cursor-pointer">
                  Tandai sesi ini telah terlaksana
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddJournalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  {editingJournal ? 'Simpan Perubahan' : 'Simpan Jurnal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: BUAT / EDIT TUGAS & PENILAIAN
          ========================================== */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <span>{editingAssignment ? 'Edit Tugas & Penilaian' : 'Buat Penugasan Siswa Baru'}</span>
              </h3>
              <button 
                onClick={() => setIsAddAssignmentOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Kelas</label>
                  <input
                    type="text"
                    required
                    value={assignmentForm.classGrade}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, classGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="XI Sains 1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Penilaian</label>
                  <select
                    value={assignmentForm.type}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
                  >
                    <option value="Formatif">Formatif</option>
                    <option value="Sumatif">Sumatif</option>
                    <option value="Proyek">Proyek</option>
                    <option value="Portofolio">Portofolio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Tugas / Penilaian</label>
                <input
                  type="text"
                  required
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  placeholder="Contoh: Laporan Praktikum Spektrometri Laser"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Instruksi & Kriteria Penilaian</label>
                <textarea
                  rows={3}
                  required
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Tuliskan petunjuk pengerjaan, format berkas (PDF), dan rubrik evaluasi..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batas Waktu (Deadline)</label>
                  <input
                    type="text"
                    required
                    value={assignmentForm.deadline}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                    placeholder="Besok, 23.59 WIB"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Siswa Kelas</label>
                  <input
                    type="number"
                    required
                    value={assignmentForm.totalStudents}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, totalStudents: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    placeholder="34"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  {editingAssignment ? 'Perbarui Tugas' : 'Terbitkan Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: PERIKSA & INPUT NILAI SUBMISI SISWA
          ========================================== */}
      {activeGradingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span>Daftar Pengumpulan & Penilaian Tugas</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeGradingAssignment.title} ({activeGradingAssignment.classGrade})</p>
              </div>
              <button 
                onClick={() => {
                  setActiveGradingAssignment(null);
                  setGradingSubmission(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of submissions for this assignment */}
            <div className="space-y-4 my-4">
              {submissions.filter(s => s.assignmentId === activeGradingAssignment.id).length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Belum ada siswa yang mengunggah tugas untuk topik ini.
                </div>
              ) : (
                submissions
                  .filter(s => s.assignmentId === activeGradingAssignment.id)
                  .map((sub) => (
                    <div 
                      key={sub.id} 
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm">{sub.studentName}</span>
                          <span className="text-slate-400 text-[11px] ml-2">NISN: {sub.studentNisn}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          sub.status === 'Dinilai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.status === 'Dinilai' ? `Nilai: ${sub.score}` : 'Menunggu Dinilai'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
                        <span className="font-bold text-indigo-700">Berkas: {sub.fileName}</span>
                        <span>•</span>
                        <span className="text-slate-400">Waktu: {sub.submittedAt}</span>
                      </div>

                      {sub.notes && (
                        <p className="text-slate-600 text-[11px] bg-white p-2 rounded-xl border border-slate-100 italic">
                          "{sub.notes}"
                        </p>
                      )}

                      {sub.feedback && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                          <strong>Umpan Balik Guru:</strong> {sub.feedback}
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setScoreInput(sub.score || 90);
                            setFeedbackInput(sub.feedback || 'Analisis sangat baik dan sistematis. Pertahankan!');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors"
                        >
                          {sub.status === 'Dinilai' ? 'Ubah Nilai & Feedback' : 'Beri Nilai & Feedback'}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Sub-form to input score & feedback */}
            {gradingSubmission && (
              <form onSubmit={handleGradeSubmission} className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-3 mt-4 text-xs">
                <div className="font-bold text-indigo-950 flex items-center justify-between">
                  <span>Input Nilai untuk: {gradingSubmission.studentName}</span>
                  <button 
                    type="button" 
                    onClick={() => setGradingSubmission(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Skor Nilai (0 - 100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={scoreInput}
                      onChange={(e) => setScoreInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-indigo-700 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Umpan Balik / Catatan Evaluasi</label>
                    <input
                      type="text"
                      required
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Apresiasi atau bagian yang perlu penyempurnaan..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Simpan Nilai ke Rapor Siswa
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
