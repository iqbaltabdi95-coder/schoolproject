export type ThemePreset = 
  | 'indigo-royal'
  | 'emerald-modern'
  | 'ocean-cyan'
  | 'crimson-prestige'
  | 'amber-sunset'
  | 'purple-galaxy';

export type FontPairing = 'modern' | 'clean' | 'editorial' | 'tech';

export interface SchoolConfig {
  name: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  accreditation: string;
  establishedYear: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  themePreset: ThemePreset;
  fontPairing: FontPairing;
  ppdbStatus: {
    isOpen: boolean;
    gelombang: string;
    tahunAjaran: string;
    deadline: string;
    kuotaTersisa: number;
    diskonEarlyBird: string;
  };
  stats: {
    kelulusan: string;
    ptnFavorit: string;
    medaliPrestasi: string;
    ekskulCount: string;
    pengajarS2S3: string;
    alumniTersebar: string;
  };
  principal: {
    name: string;
    title: string;
    photo: string;
    quote: string;
    message: string[];
    speechVideoUrl?: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Prestasi' | 'Kegiatan' | 'Pengumuman';
  date: string;
  excerpt: string;
  image: string;
  readTime: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  studentName: string;
  competition: string;
  category: 'Internasional' | 'Nasional' | 'Sains' | 'Seni & Olahraga';
  year: string;
  badge: string;
  image: string;
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'Sains & Riset' | 'Seni & Budaya' | 'Olahraga' | 'Kepemimpinan';
  description: string;
  coach: string;
  schedule: string;
  image: string;
  highlight: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  category: 'Laboratorium' | 'Akademik' | 'Olahraga' | 'Seni & Rekreasi';
  description: string;
  image: string;
  features: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  cohortYear: string;
  currentAffiliation: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'PPDB' | 'Kurikulum' | 'Biaya' | 'Fasilitas';
}

export type PageView = 'home' | 'layanan' | 'portal' | 'elibrary';

export type UserRole = 'guru' | 'siswa' | 'wali' | 'perpustakaan' | 'bendahara' | 'it';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identityNumber: string; // NIP, NISN, NIK (angka menggunakan pemisah titik)
  password?: string; // Kata sandi akun
  phone: string;
  titleOrClass: string;
  status: 'aktif' | 'nonaktif';
  createdAt?: string;
  updatedAt?: string;
}

export interface TeachingJournal {
  id: string;
  teacherId: string;
  teacherName: string;
  classGrade: string;
  subject: string;
  topic: string;
  timeRange: string;
  date: string;
  completed: boolean;
  attendanceSummary?: string;
  reflectionNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentQueue {
  id: string;
  teacherId: string;
  teacherName: string;
  classGrade: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
  type: 'Formatif' | 'Sumatif' | 'Portofolio' | 'Proyek';
  totalStudents: number;
  submittedCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  studentClass: string;
  submissionType: string;
  fileName: string;
  notes?: string;
  status: 'Terkumpul' | 'Dinilai' | 'Revisi';
  score?: number;
  feedback?: string;
  submittedAt: string;
}

export interface CounselingNote {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  parentName: string;
  authorName: string;
  authorRole: string; // Wali Kelas / Guru BK
  category: 'Prestasi & Teladan' | 'Kedisiplinan & Presensi' | 'Akademik' | 'Afektif & Pembinaan';
  sentiment: 'positif' | 'evaluasi'; // positif = catatan baik / prestasi, evaluasi = catatan bimbingan / afektif
  title: string;
  note: string;
  actionNeeded?: string;
  date: string;
  isRead: boolean;
  createdAt?: string;
}

export interface SppBill {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  studentClass: string;
  academicYear: string; // e.g. 2024/2025
  month: string; // e.g. Juli, Agustus, dll
  amount: number;
  dueDate: string; // e.g. 10 Juli 2024
  status: 'Lunas' | 'Belum Lunas' | 'Menunggu Konfirmasi';
  vaNumber: string;
  paidAt?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  recordedBy?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: 'Kurikulum' | 'Internasional' | 'Riset' | 'Sastra' | 'Sains' | 'Audio' | string;
  cover: string;
  year: number;
  pages: number;
  rating: number;
  isbn: string;
  availableDigital: boolean;
  availablePhysical: boolean;
  description: string;
  sampleChapterText: string;
  downloadUrl?: string;
  reads?: number;
  addedBy?: string;
  createdAt?: string;
}


