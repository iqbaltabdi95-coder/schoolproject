import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  UserProfile, 
  UserRole,
  TeachingJournal, 
  AssignmentQueue, 
  StudentSubmission, 
  CounselingNote, 
  LibraryBook, 
  SppBill,
  SchoolConfig,
  ProgramItem,
  AchievementItem,
  FacilityItem,
  NewsItem
} from '../types';
import { SAMPLE_BOOKS, MOCK_TEACHER_DATA, MOCK_STUDENT_DATA, MOCK_PARENT_DATA } from '../data/portalAndLibraryData';
import { 
  DEFAULT_SCHOOL_CONFIG, 
  DEFAULT_PROGRAMS, 
  DEFAULT_ACHIEVEMENTS, 
  DEFAULT_FACILITIES, 
  DEFAULT_NEWS 
} from '../data/defaultSchoolData';

// Initial pre-configured multi-role users with dot-separated numbers and ready-to-use passwords
export const INITIAL_STAFF_USERS: UserProfile[] = [
  {
    id: 'user_guru_hendra',
    name: 'Dr. Hendra Gunawan, M.Si',
    email: 'hendra.gunawan@sekolah.sch.id',
    role: 'guru',
    identityNumber: '19790514.200501.1.003',
    password: 'guru123',
    phone: '0812-3456-7890',
    titleOrClass: 'Ketua Lab Sains & Guru Fisika (Kelas XI-1, XI-2, XII)',
    status: 'aktif'
  },
  {
    id: 'user_siswa_farhan',
    name: 'Farhan Aditya Pratama',
    email: 'farhan.aditya@siswa.sch.id',
    role: 'siswa',
    identityNumber: '0078192341',
    password: 'siswa123',
    phone: '0857-1122-3344',
    titleOrClass: 'Kelas XI - Peminatan Riset & Sains 1',
    status: 'aktif'
  },
  {
    id: 'user_wali_bambang',
    name: 'Ir. Bambang Wicaksono, M.M',
    email: 'bambang.wicaksono@parent.sch.id',
    role: 'wali',
    identityNumber: '3273150809750001',
    password: 'wali123',
    phone: '0811-9876-5432',
    titleOrClass: 'Orang Tua / Wali dari Farhan Aditya Pratama (XI-1)',
    status: 'aktif'
  },
  {
    id: 'user_staff_perpustakaan',
    name: 'Siti Nurhaliza, S.Ptk',
    email: 'perpustakaan@sekolah.sch.id',
    role: 'perpustakaan',
    identityNumber: '19880312.201102.2.004',
    password: 'pustaka123',
    phone: '0813-7766-5544',
    titleOrClass: 'Kepala Bagian Khazanah Pustaka & Repositori Literasi',
    status: 'aktif'
  },
  {
    id: 'user_bendahara_sekolah',
    name: 'Ratna Dewanti, S.E., M.Ak',
    email: 'bendahara@sekolah.sch.id',
    role: 'bendahara',
    identityNumber: '19840922.200903.2.008',
    password: 'bendahara123',
    phone: '0812-8899-0011',
    titleOrClass: 'Bendahara Sekolah & Kepala Unit Administrasi Keuangan (SPP)',
    status: 'aktif'
  },
  {
    id: 'user_tim_it_admin',
    name: 'Arya Pratama, S.Kom., M.T',
    email: 'admin.it@sekolah.sch.id',
    role: 'it',
    identityNumber: '19920110.201801.1.002',
    password: 'admin123',
    phone: '0813-1122-9900',
    titleOrClass: 'Lead Administrator Sistem Informasi & Portal Web Sekolah',
    status: 'aktif'
  }
];

// Ready-to-use default credentials helper
export const DEFAULT_ROLE_PASSWORDS: Record<UserRole, { password: string; roleLabel: string; exampleUser: string; identityExample: string }> = {
  siswa: { password: 'siswa123', roleLabel: 'Portal Siswa', exampleUser: 'Farhan Aditya Pratama', identityExample: '0078192341' },
  guru: { password: 'guru123', roleLabel: 'Portal Guru', exampleUser: 'Dr. Hendra Gunawan, M.Si', identityExample: '19790514.200501.1.003' },
  wali: { password: 'wali123', roleLabel: 'Portal Orang Tua / Wali', exampleUser: 'Ir. Bambang Wicaksono, M.M', identityExample: '3273150809750001' },
  perpustakaan: { password: 'pustaka123', roleLabel: 'Staff Perpustakaan', exampleUser: 'Siti Nurhaliza, S.Ptk', identityExample: '19880312.201102.2.004' },
  bendahara: { password: 'bendahara123', roleLabel: 'Bendahara SPP', exampleUser: 'Ratna Dewanti, S.E.', identityExample: '19840922.200903.2.008' },
  it: { password: 'admin123', roleLabel: 'Admin', exampleUser: 'Arya Pratama, S.Kom', identityExample: '19920110.201801.1.002' }
};

// Initial SPP Bills according to standard Indonesian school fee systems
export const INITIAL_SPP_BILLS: SppBill[] = [
  {
    id: 'SPP-2024-07-001',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentNisn: '0078192341',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    academicYear: '2024/2025',
    month: 'Juli 2024',
    amount: 2750000,
    dueDate: '10 Juli 2024',
    status: 'Lunas',
    vaNumber: '8801 0078 1923 4107',
    paidAt: '05 Juli 2024, 09:15 WIB',
    paymentMethod: 'Bank Transfer Virtual Account BNI',
    receiptNumber: 'KW-SPP/2024/07/0041',
    recordedBy: 'Ratna Dewanti, S.E., M.Ak',
    notes: 'Pembayaran bulan pertama tahun ajaran baru 2024/2025'
  },
  {
    id: 'SPP-2024-08-002',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentNisn: '0078192341',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    academicYear: '2024/2025',
    month: 'Agustus 2024',
    amount: 2750000,
    dueDate: '10 Agustus 2024',
    status: 'Lunas',
    vaNumber: '8801 0078 1923 4108',
    paidAt: '08 Agustus 2024, 14:20 WIB',
    paymentMethod: 'Virtual Account Mandiri Livin',
    receiptNumber: 'KW-SPP/2024/08/0112',
    recordedBy: 'Ratna Dewanti, S.E., M.Ak',
    notes: 'Lunas tepat waktu sebelum tanggal 10'
  },
  {
    id: 'SPP-2024-09-003',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentNisn: '0078192341',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    academicYear: '2024/2025',
    month: 'September 2024',
    amount: 2750000,
    dueDate: '10 September 2024',
    status: 'Lunas',
    vaNumber: '8801 0078 1923 4109',
    paidAt: '03 September 2024, 08:42 WIB',
    paymentMethod: 'Virtual Account BSI Mobile',
    receiptNumber: 'KW-SPP/2024/09/0205',
    recordedBy: 'Ratna Dewanti, S.E., M.Ak',
    notes: 'Lunas awal bulan'
  },
  {
    id: 'SPP-2024-10-004',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentNisn: '0078192341',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    academicYear: '2024/2025',
    month: 'Oktober 2024',
    amount: 2750000,
    dueDate: '10 Oktober 2024',
    status: 'Belum Lunas',
    vaNumber: '8801 0078 1923 4110',
    notes: 'Tagihan bulan berjalan, jatuh tempo 10 Oktober 2024'
  },
  {
    id: 'SPP-2024-10-005',
    studentId: 'siswa_nadia_002',
    studentName: 'Nadia Salsabila Putri',
    studentNisn: '0079345210',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    academicYear: '2024/2025',
    month: 'Oktober 2024',
    amount: 2000000,
    dueDate: '10 Oktober 2024',
    status: 'Menunggu Konfirmasi',
    vaNumber: '8801 0079 3452 1010',
    paymentMethod: 'Bukti Transfer Bank BCA',
    notes: 'Jalur Prestasi Akademik (Diskon SPP). Bukti transfer diunggah orang tua'
  }
];

// Initial Counseling Notes (Buku Penghubung & Catatan BK / Wali Kelas)
export const INITIAL_COUNSELING_NOTES: CounselingNote[] = [
  {
    id: 'cn-001',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentClass: 'Kelas XI - Peminatan Riset & Sains 1',
    parentName: 'Ir. Bambang Wicaksono, M.M',
    authorName: 'Dr. Hendra Gunawan, M.Si',
    authorRole: 'Wali Kelas XI-1 & Guru Fisika',
    category: 'Prestasi & Teladan',
    sentiment: 'positif',
    title: 'Apresiasi Seleksi Olimpiade Sains Nasional (OSN) Provinsi',
    note: 'Ananda Farhan menunjukkan dedikasi luar biasa dan ketelitian pemecahan masalah fisika kuantum dalam bimbingan intensif olimpiade. Lolos mewakili sekolah ke seleksi tingkat provinsi.',
    actionNeeded: 'Mohon dukungan motivasi dan menjaga pola istirahat ananda di rumah menjelang kompetisi.',
    date: '28 Agustus 2024',
    isRead: true,
    createdAt: new Date('2024-08-28').toISOString()
  },
  {
    id: 'cn-002',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentClass: 'Kelas XI - Peminatan Riset & Sains 1',
    parentName: 'Ir. Bambang Wicaksono, M.M',
    authorName: 'Ibu Dra. Wahyu Lestari, M.Psi',
    authorRole: 'Guru Bimbingan & Konseling (BK)',
    category: 'Afektif & Pembinaan',
    sentiment: 'evaluasi',
    title: 'Catatan Observasi Konsentrasi & Manajemen Waktu Proyek Riset',
    note: 'Berdasarkan observasi di perpustakaan dan laboratorium, ananda sangat antusias pada eksperimen riset hingga terkadang terlambat makan siang dan istirahat. Perlu pendampingan agar ritme belajar dan kesehatan fisik tetap seimbang.',
    actionNeeded: 'Diharapkan orang tua turut mengingatkan waktu istirahat malam maksimal pukul 22.00 WIB.',
    date: '12 September 2024',
    isRead: false,
    createdAt: new Date('2024-09-12').toISOString()
  },
  {
    id: 'cn-003',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentClass: 'Kelas XI - Peminatan Riset & Sains 1',
    parentName: 'Ir. Bambang Wicaksono, M.M',
    authorName: 'Mr. Johnathan Smith, B.Ed',
    authorRole: 'Koordinator Cambridge English',
    category: 'Akademik',
    sentiment: 'positif',
    title: 'Capaian Excellent dalam Diskusi Bahasa Inggris Akademik',
    note: 'Presentasi riset biosorben ananda disampaikan dalam Bahasa Inggris secara fasih dan berani menyampaikan sanggahan argumentatif ilmiah di forum kelas.',
    date: '15 September 2024',
    isRead: true,
    createdAt: new Date('2024-09-15').toISOString()
  }
];

// Initial Teaching Journals for Teachers
export const INITIAL_TEACHING_JOURNALS: TeachingJournal[] = [
  {
    id: 'tj-001',
    teacherId: 'user_guru_hendra',
    teacherName: 'Dr. Hendra Gunawan, M.Si',
    classGrade: 'XI Sains 1',
    subject: 'Fisika Eksperimental',
    topic: 'Interferensi Gelombang & Spektrometri Laser Modern',
    timeRange: '07.30 - 09.00 WIB',
    date: new Date().toISOString().split('T')[0],
    completed: true,
    attendanceSummary: 'Hadir 34/34 siswa lengkap. Partisipasi laboratorium aktif.',
    reflectionNotes: 'Siswa antusias melakukan pengukuran panjang gelombang laser merah dan hijau. Hasil uji celah ganda sesuai teori.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tj-002',
    teacherId: 'user_guru_hendra',
    teacherName: 'Dr. Hendra Gunawan, M.Si',
    classGrade: 'XII Riset Unggulan',
    subject: 'Metodologi Riset & Bimbingan KTI',
    topic: 'Struktur Penulisan Bab 4: Analisis Data dan Pembahasan',
    timeRange: '10.00 - 11.30 WIB',
    date: new Date().toISOString().split('T')[0],
    completed: false,
    attendanceSummary: 'Rencana sesi konsultasi 8 kelompok karya ilmiah.',
    reflectionNotes: 'Fokus asistensi pada pengolahan statistik regresi linear data laboratorium.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tj-003',
    teacherId: 'user_guru_hendra',
    teacherName: 'Dr. Hendra Gunawan, M.Si',
    classGrade: 'XI Sains 2',
    subject: 'Fisika Teoritik',
    topic: 'Hukum Termodinamika II & Efisiensi Mesin Carnot',
    timeRange: '13.30 - 15.00 WIB',
    date: new Date().toISOString().split('T')[0],
    completed: false,
    attendanceSummary: 'Jadwal tatap muka siang hari.',
    reflectionNotes: 'Akan menggunakan simulasi interaktif PhET Colorado di layar smart class.',
    createdAt: new Date().toISOString()
  }
];

// Initial Assignment Queues
export const INITIAL_ASSIGNMENTS: AssignmentQueue[] = [
  {
    id: 'asg-001',
    teacherId: 'user_guru_hendra',
    teacherName: 'Dr. Hendra Gunawan, M.Si',
    classGrade: 'XI Sains 1',
    subject: 'Fisika Eksperimental',
    title: 'Laporan Praktikum: Polarisasi Cahaya & Difraksi Kisi Laser',
    description: 'Susun laporan resmi mencakup tujuan, dasar teori, tabel pengamatan celah, grafik hubungan jarak layar, dan analisis ketidakpastian pengukuran.',
    deadline: 'Besok, 23.59 WIB',
    type: 'Formatif',
    totalStudents: 34,
    submittedCount: 31,
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-002',
    teacherId: 'user_guru_hendra',
    teacherName: 'Dr. Hendra Gunawan, M.Si',
    classGrade: 'XII Riset Unggulan',
    subject: 'Metodologi Riset',
    title: 'Proposal Mini Research OPSI: Pemanfaatan Biomassa Lokal',
    description: 'Unggah draf proposal ilmiah format PDF lengkap dengan latar belakang masalah, perumusan hipotesis, dan desain rancangan pengujian alat.',
    deadline: '3 Hari Lagi',
    type: 'Proyek',
    totalStudents: 32,
    submittedCount: 28,
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-003',
    teacherId: 'user_guru_hendra',
    teacherName: 'Dr. Hendra Gunawan, M.Si',
    classGrade: 'XI Sains 2',
    subject: 'Fisika Teoritik',
    title: 'Kuis Diagnostik Mandiri: Siklus Termodinamika & Entropi',
    description: 'Latihan 10 soal pemecahan masalah termodinamika tertutup dan siklus Otto.',
    deadline: 'Pekan Depan, 18.00 WIB',
    type: 'Formatif',
    totalStudents: 34,
    submittedCount: 12,
    createdAt: new Date().toISOString()
  }
];

// Initial Student Submissions
export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-001',
    assignmentId: 'asg-001',
    assignmentTitle: 'Laporan Praktikum: Polarisasi Cahaya & Difraksi Kisi Laser',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentNisn: '0078192341',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    submissionType: 'Dokumen PDF',
    fileName: 'Laporan_Fisika_Optika_FarhanAditya_XI1.pdf',
    notes: 'Praktikum telah dilengkapi grafik fitting regresi origin dan lampiran foto percobaan laboratorium.',
    status: 'Dinilai',
    score: 96,
    feedback: 'Analisis ketidakpastian sangat tajam dan referensi jurnal ilmiah sangat relevan. Pertahankan!',
    submittedAt: 'Kemarin, 19.30 WIB'
  },
  {
    id: 'sub-002',
    assignmentId: 'asg-002',
    assignmentTitle: 'Proposal Mini Research OPSI: Pemanfaatan Biomassa Lokal',
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentNisn: '0078192341',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    submissionType: 'Draf Proposal PDF',
    fileName: 'Proposal_Biosorben_Jerami_Farhan_Nadia.pdf',
    notes: 'Draf bab 1 hingga bab 3 bersama rekan tim KIR.',
    status: 'Terkumpul',
    submittedAt: 'Hari ini, 08.15 WIB'
  }
];

// ==========================================
// DB SERVICE METHODS
// ==========================================

export class SchoolDbService {
  private static isInitialized = false;

  // 1. Initial Seeding Check
  static async initializeDatabaseIfEmpty(customConfig?: SchoolConfig) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // Check users
      const usersSnap = await getDocs(collection(db, 'users'));
      if (usersSnap.empty) {
        for (const user of INITIAL_STAFF_USERS) {
          await setDoc(doc(db, 'users', user.id), {
            ...user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        // Auto-migration: Ensure all NIP/NISN/NIK with spaces are updated to dots, and default passwords are set
        for (const uDoc of usersSnap.docs) {
          const uData = uDoc.data() as UserProfile;
          let hasChange = false;
          const patch: Partial<UserProfile> = {};
          if (uData.identityNumber && uData.identityNumber.includes(' ')) {
            patch.identityNumber = uData.identityNumber.replace(/\s+/g, '.');
            hasChange = true;
          }
          if (!uData.password) {
            const seedMatch = INITIAL_STAFF_USERS.find(s => s.id === uDoc.id || s.role === uData.role);
            patch.password = seedMatch?.password || 'sekolah123';
            hasChange = true;
          }
          if (hasChange) {
            try {
              await updateDoc(doc(db, 'users', uDoc.id), {
                ...patch,
                updatedAt: new Date().toISOString()
              });
            } catch (migErr) {
              console.warn('Migration note for user:', uDoc.id, migErr);
            }
          }
        }
      }

      // Check library books
      const booksSnap = await getDocs(collection(db, 'library_books'));
      if (booksSnap.empty) {
        for (const book of SAMPLE_BOOKS) {
          await setDoc(doc(db, 'library_books', book.id), {
            ...book,
            reads: Math.floor(Math.random() * 500) + 120,
            addedBy: 'Siti Nurhaliza, S.Ptk',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      // Check teaching journals
      const journalsSnap = await getDocs(collection(db, 'teaching_journals'));
      if (journalsSnap.empty) {
        for (const j of INITIAL_TEACHING_JOURNALS) {
          await setDoc(doc(db, 'teaching_journals', j.id), j);
        }
      }

      // Check assignments
      const asgSnap = await getDocs(collection(db, 'assignment_queue'));
      if (asgSnap.empty) {
        for (const a of INITIAL_ASSIGNMENTS) {
          await setDoc(doc(db, 'assignment_queue', a.id), a);
        }
      }

      // Check submissions
      const subSnap = await getDocs(collection(db, 'student_submissions'));
      if (subSnap.empty) {
        for (const s of INITIAL_SUBMISSIONS) {
          await setDoc(doc(db, 'student_submissions', s.id), s);
        }
      }

      // Check counseling notes
      const cnSnap = await getDocs(collection(db, 'counseling_notes'));
      if (cnSnap.empty) {
        for (const n of INITIAL_COUNSELING_NOTES) {
          await setDoc(doc(db, 'counseling_notes', n.id), n);
        }
      }

      // Check SPP bills
      const sppSnap = await getDocs(collection(db, 'spp_bills'));
      if (sppSnap.empty) {
        for (const b of INITIAL_SPP_BILLS) {
          await setDoc(doc(db, 'spp_bills', b.id), b);
        }
      }

      // Check school content (for TIM IT)
      const contentDoc = await getDoc(doc(db, 'school_content', 'main_config'));
      if (!contentDoc.exists()) {
        await setDoc(doc(db, 'school_content', 'main_config'), {
          id: 'main_config',
          schoolConfig: DEFAULT_SCHOOL_CONFIG,
          programs: DEFAULT_PROGRAMS,
          achievements: DEFAULT_ACHIEVEMENTS,
          facilities: DEFAULT_FACILITIES,
          news: DEFAULT_NEWS,
          updatedBy: 'Arya Pratama, S.Kom (Lead IT)',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn('Initial seeding note:', error);
    }
  }

  // ==========================================
  // PORTAL GURU: JURNAL MENGAJAR (CRUD)
  // ==========================================
  static subscribeTeachingJournals(callback: (journals: TeachingJournal[]) => void) {
    const colRef = collection(db, 'teaching_journals');
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TeachingJournal));
      callback(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'teaching_journals'));
  }

  static async addTeachingJournal(journal: Omit<TeachingJournal, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const id = 'tj-' + Date.now();
      const payload: TeachingJournal = {
        ...journal,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'teaching_journals', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'teaching_journals');
      throw err;
    }
  }

  static async updateTeachingJournal(id: string, updates: Partial<TeachingJournal>) {
    try {
      await updateDoc(doc(db, 'teaching_journals', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `teaching_journals/${id}`);
      throw err;
    }
  }

  static async deleteTeachingJournal(id: string) {
    try {
      await deleteDoc(doc(db, 'teaching_journals', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `teaching_journals/${id}`);
      throw err;
    }
  }

  // ==========================================
  // PORTAL GURU: ANTREAN PENILAIAN & TUGAS (CRUD)
  // ==========================================
  static subscribeAssignments(callback: (items: AssignmentQueue[]) => void) {
    const colRef = collection(db, 'assignment_queue');
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AssignmentQueue));
      callback(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'assignment_queue'));
  }

  static async addAssignment(assignment: Omit<AssignmentQueue, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const id = 'asg-' + Date.now();
      const payload: AssignmentQueue = {
        ...assignment,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'assignment_queue', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'assignment_queue');
      throw err;
    }
  }

  static async updateAssignment(id: string, updates: Partial<AssignmentQueue>) {
    try {
      await updateDoc(doc(db, 'assignment_queue', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `assignment_queue/${id}`);
      throw err;
    }
  }

  static async deleteAssignment(id: string) {
    try {
      await deleteDoc(doc(db, 'assignment_queue', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `assignment_queue/${id}`);
      throw err;
    }
  }

  // ==========================================
  // PORTAL SISWA: SUBMISI TUGAS & ASESMEN DIGITAL
  // ==========================================
  static subscribeSubmissions(
    studentIdOrCallback: string | null | ((items: StudentSubmission[]) => void), 
    maybeCallback?: (items: StudentSubmission[]) => void
  ) {
    const callback = typeof studentIdOrCallback === 'function' ? studentIdOrCallback : maybeCallback!;
    const studentId = typeof studentIdOrCallback === 'string' ? studentIdOrCallback : null;
    const colRef = collection(db, 'student_submissions');
    return onSnapshot(colRef, (snapshot) => {
      let items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StudentSubmission));
      if (studentId) {
        items = items.filter(s => s.studentId === studentId);
      }
      callback(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'student_submissions'));
  }

  static async submitStudentTask(data: Omit<StudentSubmission, 'id' | 'submittedAt'>) {
    try {
      const id = 'sub-' + Date.now();
      const payload: StudentSubmission = {
        ...data,
        id,
        submittedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB'
      };
      await setDoc(doc(db, 'student_submissions', id), payload);

      // increment assignment submitted count if applicable
      try {
        const asgDoc = await getDoc(doc(db, 'assignment_queue', data.assignmentId));
        if (asgDoc.exists()) {
          const cur = asgDoc.data() as AssignmentQueue;
          await updateDoc(doc(db, 'assignment_queue', data.assignmentId), {
            submittedCount: (cur.submittedCount || 0) + 1
          });
        }
      } catch (e) {
        console.warn('Could not auto-increment assignment counter', e);
      }

      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'student_submissions');
      throw err;
    }
  }

  static async gradeStudentSubmission(id: string, score: number, feedback: string) {
    try {
      await updateDoc(doc(db, 'student_submissions', id), {
        score,
        feedback,
        status: 'Dinilai'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `student_submissions/${id}`);
      throw err;
    }
  }

  // ==========================================
  // PORTAL ORANG TUA/WALI: CATATAN BK / WALI KELAS
  // ==========================================
  static subscribeCounselingNotes(callback: (items: CounselingNote[]) => void) {
    const colRef = collection(db, 'counseling_notes');
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CounselingNote));
      callback(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'counseling_notes'));
  }

  static async addCounselingNote(note: Omit<CounselingNote, 'id' | 'createdAt'>) {
    try {
      const id = 'cn-' + Date.now();
      const payload: CounselingNote = {
        ...note,
        id,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'counseling_notes', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'counseling_notes');
      throw err;
    }
  }

  static async updateCounselingNote(id: string, updates: Partial<CounselingNote>) {
    try {
      await updateDoc(doc(db, 'counseling_notes', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `counseling_notes/${id}`);
      throw err;
    }
  }

  static async deleteCounselingNote(id: string) {
    try {
      await deleteDoc(doc(db, 'counseling_notes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `counseling_notes/${id}`);
      throw err;
    }
  }

  // ==========================================
  // PORTAL PERPUSTAKAAN: KHANZANAH BUKU (CRUD)
  // ==========================================
  static subscribeLibraryBooks(callback: (items: LibraryBook[]) => void) {
    const colRef = collection(db, 'library_books');
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LibraryBook));
      callback(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'library_books'));
  }

  static async addLibraryBook(book: Omit<LibraryBook, 'id' | 'createdAt'>) {
    try {
      const id = 'book-' + Date.now();
      const payload: LibraryBook = {
        ...book,
        id,
        reads: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'library_books', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'library_books');
      throw err;
    }
  }

  static async updateLibraryBook(id: string, updates: Partial<LibraryBook>) {
    try {
      await updateDoc(doc(db, 'library_books', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `library_books/${id}`);
      throw err;
    }
  }

  static async deleteLibraryBook(id: string) {
    try {
      await deleteDoc(doc(db, 'library_books', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `library_books/${id}`);
      throw err;
    }
  }

  static async incrementBookRead(id: string) {
    try {
      const bookDoc = await getDoc(doc(db, 'library_books', id));
      if (bookDoc.exists()) {
        const cur = bookDoc.data() as LibraryBook;
        await updateDoc(doc(db, 'library_books', id), {
          reads: (cur.reads || 0) + 1
        });
      }
    } catch (e) {
      console.warn('Failed to increment read count', e);
    }
  }

  // ==========================================
  // PORTAL BENDAHARA: TAGIHAN SPP (CRUD)
  // ==========================================
  static subscribeSppBills(callback: (items: SppBill[]) => void) {
    const colRef = collection(db, 'spp_bills');
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SppBill));
      callback(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'spp_bills'));
  }

  static async addSppBill(bill: Omit<SppBill, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const id = 'SPP-' + Date.now();
      const payload: SppBill = {
        ...bill,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'spp_bills', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'spp_bills');
      throw err;
    }
  }

  static async updateSppBill(id: string, updates: Partial<SppBill>) {
    try {
      await updateDoc(doc(db, 'spp_bills', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `spp_bills/${id}`);
      throw err;
    }
  }

  static async deleteSppBill(id: string) {
    try {
      await deleteDoc(doc(db, 'spp_bills', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `spp_bills/${id}`);
      throw err;
    }
  }

  // ==========================================
  // PORTAL TIM IT: USER & STAFF MANAGEMENT (CRUD)
  // ==========================================
  static subscribeUsers(callback: (users: UserProfile[]) => void) {
    const colRef = collection(db, 'users');
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
      callback(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));
  }

  static async addUserProfile(user: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const id = 'user_' + Date.now();
      const sanitizedIdentity = user.identityNumber ? user.identityNumber.trim().replace(/\s+/g, '.') : '';
      const payload: UserProfile = {
        ...user,
        identityNumber: sanitizedIdentity,
        password: user.password || 'sekolah123',
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'users');
      throw err;
    }
  }

  static async updateUserProfile(id: string, updates: Partial<UserProfile>) {
    try {
      const patch = { ...updates };
      if (patch.identityNumber) {
        patch.identityNumber = patch.identityNumber.trim().replace(/\s+/g, '.');
      }
      await updateDoc(doc(db, 'users', id), {
        ...patch,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${id}`);
      throw err;
    }
  }

  static async updateUserPassword(id: string, newPassword: string) {
    try {
      await updateDoc(doc(db, 'users', id), {
        password: newPassword,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${id}`);
      throw err;
    }
  }

  static async deleteUserProfile(id: string) {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${id}`);
      throw err;
    }
  }

  // ==========================================
  // PORTAL TIM IT: WEBSITE CONTENT (CRUD)
  // ==========================================
  static subscribeWebsiteContent(callback: (content: {
    schoolConfig: SchoolConfig;
    programs: ProgramItem[];
    achievements: AchievementItem[];
    facilities: FacilityItem[];
    news: NewsItem[];
    updatedBy?: string;
    updatedAt?: string;
  }) => void) {
    return onSnapshot(doc(db, 'school_content', 'main_config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          schoolConfig: data.schoolConfig || DEFAULT_SCHOOL_CONFIG,
          programs: data.programs || DEFAULT_PROGRAMS,
          achievements: data.achievements || DEFAULT_ACHIEVEMENTS,
          facilities: data.facilities || DEFAULT_FACILITIES,
          news: data.news || DEFAULT_NEWS,
          updatedBy: data.updatedBy,
          updatedAt: data.updatedAt
        });
      } else {
        callback({
          schoolConfig: DEFAULT_SCHOOL_CONFIG,
          programs: DEFAULT_PROGRAMS,
          achievements: DEFAULT_ACHIEVEMENTS,
          facilities: DEFAULT_FACILITIES,
          news: DEFAULT_NEWS
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'school_content/main_config'));
  }

  static async updateWebsiteContent(content: {
    schoolConfig?: SchoolConfig;
    programs?: ProgramItem[];
    achievements?: AchievementItem[];
    facilities?: FacilityItem[];
    news?: NewsItem[];
    updatedBy?: string;
  }) {
    try {
      await setDoc(doc(db, 'school_content', 'main_config'), {
        ...content,
        id: 'main_config',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'school_content/main_config');
      throw err;
    }
  }

  static async saveSchoolConfig(config: SchoolConfig) {
    return this.updateWebsiteContent({ schoolConfig: config });
  }

  static listenToWebsiteContent(callback: (content: {
    schoolConfig: SchoolConfig;
    programs: ProgramItem[];
    achievements: AchievementItem[];
    facilities: FacilityItem[];
    news: NewsItem[];
    updatedBy?: string;
    updatedAt?: string;
  }) => void) {
    return this.subscribeWebsiteContent(callback);
  }
}
