import { LibraryBook } from '../types';

export const SAMPLE_BOOKS: LibraryBook[] = [
  {
    id: 'book-1',
    title: 'Fisika Kuantum & Kosmologi Eksperimental',
    author: 'Prof. Dr. Ir. Yohanes Surya & Tim Laboratorium',
    category: 'Sains',
    cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
    year: 2024,
    pages: 420,
    rating: 4.9,
    isbn: '978-602-8321-44-1',
    availableDigital: true,
    availablePhysical: true,
    description: 'Panduan komprehensif eksplorasi mekanika kuantum, relativitas khusus, dan fenomena kosmologi dengan pendekatan laboratorium fisika terapan bagi siswa berprestasi sains.',
    sampleChapterText: 'Bab 1: Dualisme Gelombang Partikel dalam Eksperimen Modern.\n\nEksperimen celah ganda Young membuktikan bahwa cahaya memiliki sifat gelombang. Namun ketika intensitas diperkecil hingga foton tunggal ditembakkan satu per satu, pola interferensi tetap terbentuk di layar detektor. Fenomena ini membuktikan sifat probabilitas gelombang materi de Broglie yang mendasari prinsip superposisi dalam komputasi kuantum abad ke-21...'
  },
  {
    id: 'book-2',
    title: 'Cambridge IGCSE & A-Level Advanced Mathematics',
    author: 'David Rayner & University Press Cambridge',
    category: 'Internasional',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    year: 2023,
    pages: 580,
    rating: 4.8,
    isbn: '978-1-108-43721-9',
    availableDigital: true,
    availablePhysical: true,
    description: 'Modul kurikulum internasional untuk kalkulus diferensial, aljabar linear, trigonometri tingkat lanjut, dan statistika probabilitas terapan.',
    sampleChapterText: 'Chapter 1: Differentiation and Applied Kinematics.\n\nRate of change represents the fundamental core of calculus. When analyzing continuous particle motion, the velocity function v(t) is defined as the first derivative of displacement s(t) with respect to time t. Through geometric interpretation, tangents to non-linear curves yield critical rates required in aerospace modeling...'
  },
  {
    id: 'book-3',
    title: 'Kompilasi Riset Ilmiah Juara Olimpiade Sains & Robotika',
    author: 'Tim Ekstrakurikuler Karya Ilmiah Remaja (KIR)',
    category: 'Riset',
    cover: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    year: 2024,
    pages: 310,
    rating: 5.0,
    isbn: '978-602-9912-78-0',
    availableDigital: true,
    availablePhysical: false,
    description: 'Dokumentasi metodologi penelitian 12 karya ilmiah pemenang medali emas ICYS, ISEF, dan OPSI Nasional, dari mikrokontroler sensor air hingga biosorben limbah.',
    sampleChapterText: 'Abstrak Penelitian Unggulan:\nPemurnian air limbah mikroplastik menggunakan koagulan biji kelor termodifikasi nanopartikel karbon aktif. Hasil uji spektrofotometri menunjukkan efisiensi adsorpsi hingga 94,8% dalam rentang waktu 30 menit pada pH netral...'
  },
  {
    id: 'book-4',
    title: 'Kearifan Nusantara & Filosofi Budi Pekerti Pemimpin',
    author: 'Dr. Raden Mas Suwardi & Lembaga Kajian Kebangsaan',
    category: 'Sastra',
    cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    year: 2022,
    pages: 260,
    rating: 4.9,
    isbn: '978-602-7721-12-8',
    availableDigital: true,
    availablePhysical: true,
    description: 'Eksplorasi nilai kepemimpinan luhur: Ing ngarso sung tulodo, ing madyo mangun karso, tut wuri handayani dalam konteks dinamika generasi digital dunia.',
    sampleChapterText: 'Prakata:\nKepemimpinan sejati tidak diukur dari seberapa banyak pengikut yang patuh, melainkan seberapa banyak pemimpin baru yang berhasil ditumbuhkembangkan. Keteladanan moral adalah kompas yang tidak pernah kehilangan arah di tengah derasnya arus modernitas...'
  },
  {
    id: 'book-5',
    title: 'Internet of Things (IoT) & Artificial Intelligence for Youth',
    author: 'Bambang Sudarmono, M.T. & AI Youth Lab',
    category: 'Sains',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    year: 2024,
    pages: 340,
    rating: 4.8,
    isbn: '978-623-01-2098-4',
    availableDigital: true,
    availablePhysical: true,
    description: 'Panduan merakit sistem Smart Home, monitoring lingkungan otomatis dengan ESP32, dan integrasi visi komputer AI sederhana untuk proyek sains sekolah.',
    sampleChapterText: 'Bab 2: Arsitektur Sensor dan Protokol MQTT.\n\nDalam ekosistem otomasi cerdas, node sensor mengirimkan telemetri suhu dan kelembaban udara melalui protokol ringan MQTT ke broker cloud. Mikrokontroler ESP32 menghemat konsumsi daya berkat mode deep-sleep...'
  },
  {
    id: 'book-6',
    title: 'Biologi Seluler Molekuler & Bioteknologi Lingkungan',
    author: 'Prof. Endang Purwaningsih & Tim Biologi Terapan',
    category: 'Kurikulum',
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    year: 2023,
    pages: 450,
    rating: 4.7,
    isbn: '978-602-444-991-0',
    availableDigital: true,
    availablePhysical: true,
    description: 'Buku teks standar Kurikulum Merdeka mendalami sintesis protein, transkripsi RNA, teknologi CRISPR-Cas9, dan bioremediasi limbah organik.',
    sampleChapterText: 'Bab 4: Ekspresi Gen dan Mekanisme Transkripsi.\n\nEnzim RNA polimerase berikatan dengan daerah promotor DNA untuk memulai pembacaan rantai cetakan. Kodon start AUG memberi sinyal pembentukan asam amino metionin pertama dalam translasi ribosom...'
  },
  {
    id: 'book-7',
    title: 'Retorika Debat Parlemen & Diplomasi MUN Internasional',
    author: 'Sekretariat Model United Nations (MUN) Club',
    category: 'Audio',
    cover: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    year: 2024,
    pages: 180,
    rating: 5.0,
    isbn: '978-602-5501-89-2',
    availableDigital: true,
    availablePhysical: false,
    description: 'Rekaman audio podcast dan buku saku teknik pidato persuasif bahasa Inggris, resolusi draf PBB, serta negosiasi diplomatik kancah global.',
    sampleChapterText: 'Audio Episode 1: The Art of Opening Speech.\n\n"Distinguished Chairs and Fellow Delegates, the question before us today is not whether we can afford climate resilience infrastructure, but whether humanity can afford our inaction..."'
  },
  {
    id: 'book-8',
    title: 'Ensiklopedia Peradaban Dunia & Warisan Budaya UNESCO',
    author: 'UNESCO Education Division & Tim Kurasi',
    category: 'Kurikulum',
    cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    year: 2023,
    pages: 620,
    rating: 4.9,
    isbn: '978-979-1100-33-7',
    availableDigital: true,
    availablePhysical: true,
    description: 'Koleksi visual megah situs cagar budaya dunia dari Candi Borobudur, Piramida Giza, hingga Machu Picchu dengan analisis antropologi mendalam.',
    sampleChapterText: 'Kajian Arsitektur Borobudur:\nStruktur mandala Borobudur merepresentasikan tingkatan kosmologis Kamadhatu, Rupadhatu, dan Arupadhatu. Sistem sambungan batu takik interlocking membuktikan kecerdasan teknik sipil leluhur abad ke-8...'
  }
];

export const MOCK_STUDENT_DATA = {
  name: 'Farhan Aditya Pratama',
  nisn: '0078192341',
  nis: '2324-1104',
  grade: 'Kelas XI - Peminatan Riset & Sains 1',
  semester: 'Semester Ganjil 2024/2025',
  attendance: {
    present: 98.2,
    sick: 1.8,
    excused: 0,
    unexcused: 0
  },
  scheduleToday: [
    { time: '07.30 - 09.00', subject: 'Fisika Lanjutan (Laboratorium)', teacher: 'Dr. Hendra Gunawan, M.Si', room: 'Lab Fisika Modern' },
    { time: '09.15 - 10.45', subject: 'Matematika Terapan & Kalkulus', teacher: 'Ibu Ratna Dewi, S.Pd., M.Mat', room: 'Smart Class 302' },
    { time: '11.00 - 12.30', subject: 'Bahasa Inggris / Cambridge English', teacher: 'Mr. Johnathan Smith, B.Ed', room: 'Language Hub B' },
    { time: '13.30 - 15.00', subject: 'Robotika & Sistem Kendali IoT', teacher: 'Ir. Agus Salim, M.Eng', room: 'Robotics Workshop' },
  ],
  grades: [
    { subject: 'Fisika Eksperimental', score: 95, predicate: 'A (Sangat Unggul)', credit: 4 },
    { subject: 'Matematika Peminatan', score: 92, predicate: 'A (Sangat Unggul)', credit: 4 },
    { subject: 'Biologi Seluler Molekuler', score: 90, predicate: 'A (Sangat Unggul)', credit: 3 },
    { subject: 'Kimia Analitik', score: 88, predicate: 'A- (Unggul)', credit: 3 },
    { subject: 'Bahasa Inggris Akademik', score: 96, predicate: 'A (Sangat Unggul)', credit: 3 },
    { subject: 'Pendidikan Karakter & Moral', score: 94, predicate: 'A (Sangat Unggul)', credit: 2 },
  ],
  tasks: [
    { id: 't-1', title: 'Laporan Praktikum: Polarisasi Cahaya Laser', subject: 'Fisika', deadline: 'Besok, 23.59 WIB', status: 'Sudah Dikumpulkan' },
    { id: 't-2', title: 'Mini Research Proposal KIR: Biosorben Jerami', subject: 'Metodologi Riset', deadline: '3 Hari Lagi', status: 'Draft Menunggu Unggah' },
    { id: 't-3', title: 'Essay: The Impact of AI on Global Diplomacy', subject: 'Bahasa Inggris', deadline: '18 September 2024', status: 'Belum Selesai' }
  ]
};

export const MOCK_TEACHER_DATA = {
  name: 'Dr. Hendra Gunawan, M.Si',
  nip: '19790514.200501.1.003',
  position: 'Ketua Laboratorium Sains & Guru Pengampu Fisika',
  classesTaught: ['XI Sains 1', 'XI Sains 2', 'XII Riset Unggulan'],
  todayClasses: [
    { time: '07.30 - 09.00', class: 'XI Sains 1', topic: 'Interferensi Gelombang & Optika Laser', completed: true },
    { time: '10.00 - 11.30', class: 'XII Riset', topic: 'Bimbingan Karya Tulis Ilmiah Olimpiade', completed: false },
    { time: '13.30 - 15.00', class: 'XI Sains 2', topic: 'Analisis Spektrometri Massa', completed: false },
  ],
  gradingQueue: [
    { title: 'Praktikum Optika Gelombang XI-1', submitted: 34, total: 34, status: 'Siap Dinilai' },
    { title: 'Tugas Kalkulus Kinematika XII', submitted: 28, total: 32, status: 'Menunggu Pengumpulan' },
  ]
};

export const MOCK_PARENT_DATA = {
  parentName: 'Ir. Bambang Wicaksono, M.M',
  studentName: 'Farhan Aditya Pratama',
  studentClass: 'Kelas XI - Peminatan Riset & Sains 1',
  monthlyFee: {
    status: 'Lunas',
    period: 'September 2024',
    invoiceNumber: 'INV/2024/09/EDU-7789',
    vaNumber: '8801 0078 1923 4100',
    amount: 'Rp 2.750.000',
    paidAt: '03 September 2024, 08.42 WIB'
  },
  counselingNotes: [
    { date: '28 Agustus 2024', note: 'Farhan terpilih mewakili sekolah dalam seleksi Olimpiade Sains Nasional tingkat Provinsi bidang Fisika.', teacher: 'Wali Kelas XI-1' },
    { date: '15 Juli 2024', note: 'Evaluasi awal semester: Sikap kemandirian dan keaktifan diskusi di kelas sangat memuaskan.', teacher: 'Guru BK' }
  ]
};

export const PPDB_DETAILS = {
  steps: [
    { step: 1, title: 'Registrasi Akun & Pengisian Formulir', desc: 'Membuat akun PPDB online dan melengkapi biodata calon siswa beserta sekolah asal.' },
    { step: 2, title: 'Unggah Berkas & Verifikasi Portofolio', desc: 'Mengunggah scan rapor 3 semester terakhir, akta lahir, kartu keluarga, dan sertifikat kejuaraan.' },
    { step: 3, title: 'Asesmen Bakat, TPA & Wawancara', desc: 'Mengikuti tes diagnostik potensi akademik, tes minat bakat nalar kritis, dan wawancara orang tua.' },
    { step: 4, title: 'Pengumuman Kelulusan & Daftar Ulang', desc: 'Pengecekan surat keputusan kelulusan dan penyelesaian administrasi daftar ulang secara digital.' }
  ],
  feeComponents: [
    { name: 'Uang Pangkal / Pembangunan (UP)', regular: 'Rp 28.500.000', prestasi: 'Rp 14.250.000 (Diskon 50%)', tahfidz: 'Rp 0 (Beasiswa Penuh 100%)', note: 'Dibayar 1 kali selama menempuh pendidikan' },
    { name: 'SPP / Iuran Komite Bulanan', regular: 'Rp 2.750.000 / bulan', prestasi: 'Rp 2.000.000 / bulan', tahfidz: 'Rp 0 / bulan', note: 'Termasuk akses laboratorium, e-library & bimbingan olimpiade' },
    { name: 'Seragam Lengkap & Atribut Sekolah (5 Stel)', regular: 'Rp 2.850.000', prestasi: 'Rp 2.850.000', tahfidz: 'Rp 0', note: 'Seragam harian, batik sekolah, jas almamater & olahraga' },
    { name: 'Bahan Ajar Digital & Lisensi Cambridge LMS', regular: 'Rp 1.950.000 / tahun', prestasi: 'Rp 1.950.000 / tahun', tahfidz: 'Rp 0 / tahun', note: 'Akses penuh portal buku digital & platform asesmen' },
    { name: 'Asuransi Kesehatan & Keanggotaan Ekskul', regular: 'Rp 950.000 / tahun', prestasi: 'Rp 950.000 / tahun', tahfidz: 'Rp 0 / tahun', note: 'Perlindungan siswa dan fasilitas kegiatan bakat 34+ ekskul' }
  ],
  documents: [
    { title: 'Brosur Resmi PPDB & Kurikulum (PDF)', size: '4.2 MB', desc: 'Informasi komprehensif profil sekolah, program unggulan, dan rincian biaya.' },
    { title: 'Formulir Pendaftaran Fisik Manual (PDF)', size: '850 KB', desc: 'Bagi pendaftar yang menghendaki penyerahan formulir langsung ke loket sekolah.' },
    { title: 'Silabus Panduan Asesmen Potensi Bakat (PDF)', size: '1.4 MB', desc: 'Kisi-kisi tes nalar numerik, logika verbal, dan panduan wawancara siswa.' },
    { title: 'Format Surat Rekomendasi Sekolah Asal (PDF)', size: '320 KB', desc: 'Template resmi surat keterangan kelakuan baik dan peringkat kelas.' },
    { title: 'Pakta Integritas & Pernyataan Tata Tertib (PDF)', size: '510 KB', desc: 'Kesediaan menaati kode etik dan norma kedisiplinan berkarakter.' }
  ]
};
