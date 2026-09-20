import jsPDF from 'jspdf';
import { SchoolConfig } from '../types';
import { THEME_CONFIGS } from '../data/defaultSchoolData';
import { PPDB_DETAILS } from '../data/portalAndLibraryData';

// Helper to convert hex colors to RGB array
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  const r = parseInt(clean.substring(0, 2), 16) || 30;
  const g = parseInt(clean.substring(2, 4), 16) || 41;
  const b = parseInt(clean.substring(4, 6), 16) || 59;
  return [r, g, b];
}

// Draw formal School Letterhead / Kop Surat
function drawHeader(
  doc: jsPDF, 
  config: SchoolConfig, 
  primaryRgb: [number, number, number], 
  secondaryRgb: [number, number, number]
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Top colorful accent line
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Decorative logo badge placeholder
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.roundedRect(15, 10, 16, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const initials = config.shortName.substring(0, 2).toUpperCase();
  doc.text(initials, 23, 20.5, { align: 'center' });

  // School Name & Accreditation
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(config.name.toUpperCase(), 36, 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
  doc.text(`${config.accreditation.toUpperCase()} • Berdiri Tahun ${config.establishedYear}`, 36, 19.5);

  // Motto / Tagline & Address
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`"${config.tagline}"`, 36, 23.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`${config.address}, ${config.city} • Telp: ${config.phone} • WA: ${config.whatsapp} • Email: ${config.email}`, 36, 27.5);

  // Horizontal separator lines
  doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.setLineWidth(0.8);
  doc.line(15, 30.5, pageWidth - 15, 30.5);

  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.line(15, 31.8, pageWidth - 15, 31.8);

  return 36; // Next Y position
}

// Draw formal Footer
function drawFooter(doc: jsPDF, config: SchoolConfig, pageNumber: number, totalPages: number, docCode: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.line(15, pageHeight - 14, pageWidth - 15, pageHeight - 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Dokumen Resmi PPDB ${config.ppdbStatus.tahunAjaran} • ${config.name} • Kode: ${docCode}`, 15, pageHeight - 9.5);
  doc.text(`Halaman ${pageNumber} dari ${totalPages}`, pageWidth - 15, pageHeight - 9.5, { align: 'right' });
  doc.text(`Sistem Informasi PPDB Digital - ${config.website}`, 15, pageHeight - 6);
}

// -------------------------------------------------------------
// 1. GENERATOR: BROSUR RESMI PPDB & KURIKULUM
// -------------------------------------------------------------
export function generateBrosurPPDB(config: SchoolConfig) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const primaryRgb = hexToRgb(theme.primaryColor);
  const secondaryRgb = hexToRgb(theme.secondaryColor);
  const pageWidth = doc.internal.pageSize.getWidth();

  // === PAGE 1: PROFIL, PROGRAM, & STATUS PPDB ===
  let y = drawHeader(doc, config, primaryRgb, secondaryRgb);

  // Document Title Banner
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.roundedRect(15, y, pageWidth - 30, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('BROSUR INFORMASI RESMI PPDB & PROGRAM UNGGULAN SEKOLAH', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`TAHUN AJARAN ${config.ppdbStatus.tahunAjaran} • STATUS: ${config.ppdbStatus.gelombang.toUpperCase()}`, pageWidth / 2, y + 10.5, { align: 'center' });

  y += 18;

  // Highlights Box (Kuota, Deadline, Promo)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('BATAS PENDAFTARAN:', 20, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 38, 38);
  doc.text(config.ppdbStatus.deadline, 55, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('KUOTA TERSEDIA:', 20, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text(`${config.ppdbStatus.kuotaTersisa} Kursi Peserta Didik`, 55, y + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('PROGRAM KHUSUS:', 110, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text(config.ppdbStatus.diskonEarlyBird, 142, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('HOTLINE PPDB:', 110, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${config.whatsapp} / ${config.phone}`, 142, y + 11.5);

  y += 21;

  // Sambutan Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('1. PROFIL & KOMITMEN PENDIDIKAN', 15, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const welcomeText = `${config.name} berkomitmen mencetak generasi unggul yang berakhlak mulia, berwawasan global, dan berprestasi dalam sains, teknologi, maupun seni budaya. Dengan akreditasi ${config.accreditation}, kami menyediakan ekosistem belajar modern, tenaga pendidik kualifikasi S2/S3 (${config.stats.pengajarS2S3}), serta tingkat kelulusan PTN/Dunia Kerja mencapai ${config.stats.kelulusan}.`;
  const splitWelcome = doc.splitTextToSize(welcomeText, pageWidth - 30);
  doc.text(splitWelcome, 15, y);
  y += (splitWelcome.length * 3.8) + 3;

  // Sambutan Singkat
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 2.5, 10, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`"${config.principal.quote}"`, 21, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`— ${config.principal.name} (${config.principal.title})`, 21, y + 8.5);
  y += 14;

  // Program Unggulan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('2. EMPAT PILAR PROGRAM UNGGULAN', 15, y);
  y += 5;

  const programs = [
    { title: 'A. Sains Terapan & Metodologi Riset (KIR)', desc: 'Pembinaan karya ilmiah remaja, laboratorium modern terstandarisasi, dan bimbingan Olimpiade Sains Nasional (OSN).' },
    { title: 'B. Penguatan Bahasa Internasional (Bilingual)', desc: 'Kurikulum integrasi Cambridge English, native speaker session, dan sertifikasi kemahiran berbahasa asing.' },
    { title: 'C. Pembentukan Karakter & Kepemimpinan Beradab', desc: 'Program mentoring adab, tahfidz Al-Qur\'an, outbound bela negara, dan pengembangan integritas sosial.' },
    { title: 'D. Ekosistem Digital & Laboratorium Smart School', desc: 'Smart classroom interaktif, pembelajaran IoT & robotika terapan, serta akses perpustakaan digital 24/7.' }
  ];

  programs.forEach(prog => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(prog.title, 18, y);
    y += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(prog.desc, pageWidth - 36);
    doc.text(splitDesc, 18, y);
    y += (splitDesc.length * 3.3) + 2.5;
  });

  y += 2;

  // 3 Jalur Penerimaan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('3. JALUR PENERIMAAN SISWA BARU', 15, y);
  y += 5;

  const jalurList = [
    { name: 'Jalur Reguler (Tes Potensi Akademik)', desc: 'Terbuka untuk lulusan jenjang sebelumnya dengan seleksi TPA nalar numerik, verbal, dan wawancara.' },
    { name: 'Jalur Prestasi (Akademik & Non-Akademik)', desc: 'Bebas biaya uang pangkal hingga 50% bagi pemenang kejuaraan OSN, O2SN, FLS2N tingkat Kota/Provinsi/Nasional.' },
    { name: 'Jalur Tahfidz & Beasiswa Bakat Khusus', desc: 'Beasiswa SPP penuh bagi penghafal Al-Qur\'an minimal 3 Juz atau peraih medali kejuaraan internasional.' }
  ];

  jalurList.forEach(j => {
    doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.circle(18, y - 1, 1.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(j.name, 22, y);
    y += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitJalur = doc.splitTextToSize(j.desc, pageWidth - 40);
    doc.text(splitJalur, 22, y);
    y += (splitJalur.length * 3.3) + 2;
  });

  drawFooter(doc, config, 1, 2, 'BRO-PPDB-01');

  // === PAGE 2: RINCIAN BIAYA & ALUR PENDAFTARAN ===
  doc.addPage();
  y = drawHeader(doc, config, primaryRgb, secondaryRgb);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('4. TABEL TRANSPARANSI INVESTASI PENDIDIKAN', 15, y);
  y += 5;

  // Fee Table Header
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(15, y, pageWidth - 30, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Komponen Investasi', 18, y + 4.5);
  doc.text('Jalur Reguler', 92, y + 4.5);
  doc.text('Jalur Prestasi', 130, y + 4.5);
  doc.text('Jalur Tahfidz', 168, y + 4.5);
  y += 6.5;

  // Fee Table Rows
  PPDB_DETAILS.feeComponents.forEach((item, index) => {
    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.rect(15, y, pageWidth - 30, 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(15, y + 6, pageWidth - 15, y + 6);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(item.name.substring(0, 42), 18, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(item.regular.split('(')[0].trim(), 92, y + 4);
    doc.text(item.prestasi.split('(')[0].trim(), 130, y + 4);
    doc.text(item.tahfidz.split('(')[0].trim(), 168, y + 4);

    y += 6;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('* Catatan: Biaya SPP sudah mencakup fasilitas bimbingan intensif olimpiade, klinik studi, dan 34+ pilihan ekskul.', 15, y + 4);
  y += 9;

  // Alur 4 Tahap Pendaftaran
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('5. ALUR PENDAFTARAN & JADWAL SELEKSI', 15, y);
  y += 5;

  PPDB_DETAILS.steps.forEach((step) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, y, 7, 7, 1.5, 1.5, 'F');
    doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(step.step.toString(), 18.5, y + 5, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(step.title, 26, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(step.desc, 26, y + 6.5);

    y += 9;
  });

  y += 4;

  // Berkas Persyaratan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('6. DOKUMEN PERSYARATAN BERKAS', 15, y);
  y += 5;

  const syarat = [
    'Scan / Fotokopi Rapor 3 semester terakhir yang telah dilegalisir kepala sekolah asal.',
    'Fotokopi Akta Kelahiran dan Kartu Keluarga (KK) terbaru calon siswa.',
    'Pas foto terbaru berseragam sekolah asal ukuran 3x4 (3 lembar).',
    'Sertifikat kejuaraan atau piagam penghargaan asli & fotokopi (khusus pendaftar jalur prestasi).',
    'Surat keterangan kelakuan baik dari sekolah asal dan pakta integritas bermaterai.'
  ];

  syarat.forEach(s => {
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`• ${s}`, 18, y);
    y += 4;
  });

  y += 6;

  // Kotak Kontak Loket
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SEKRETARIAT PANITIA PPDB RESMI', 20, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Lokasi Loket: Kampus ${config.name}, ${config.address}`, 20, y + 10.5);
  doc.text(`WhatsApp PPDB: ${config.whatsapp} • Jam Operasional: Senin - Sabtu (08.00 - 15.00 WIB)`, 20, y + 14);

  drawFooter(doc, config, 2, 2, 'BRO-PPDB-01');

  // Trigger download
  const cleanName = config.shortName.replace(/[^a-zA-Z0-9]/g, '-');
  const cleanYear = config.ppdbStatus.tahunAjaran.replace(/[^a-zA-Z0-9]/g, '-');
  doc.save(`Brosur-Resmi-PPDB-${cleanName}-${cleanYear}.pdf`);
}

// -------------------------------------------------------------
// 2. GENERATOR: FORMULIR PENDAFTARAN FISIK MANUAL
// -------------------------------------------------------------
export function generateFormulirPendaftaran(config: SchoolConfig) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const primaryRgb = hexToRgb(theme.primaryColor);
  const secondaryRgb = hexToRgb(theme.secondaryColor);
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = drawHeader(doc, config, primaryRgb, secondaryRgb);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB) MANUAL', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`TAHUN AJARAN ${config.ppdbStatus.tahunAjaran} • TAHAP ${config.ppdbStatus.gelombang.toUpperCase()}`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Reg Number Box
  doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, y, pageWidth - 30, 8, 1.5, 1.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('No. Registrasi / Pendaftaran (Diisi Petugas): _______________________', 18, y + 5);
  doc.text('Tgl Masuk Berkas: _____ / _____ / 2024', 125, y + 5);
  y += 11;

  // Jalur Checkboxes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Pilihan Jalur Pendaftaran:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text('[   ] Jalur Reguler        [   ] Jalur Prestasi Akademik / Non-Akademik        [   ] Jalur Tahfidz / Afirmasi', 60, y);
  y += 6;

  // Function to draw form line
  const drawField = (label: string, valueLine = '____________________________________________________________________') => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(label, 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(valueLine, 72, y);
    y += 5.2;
  };

  // BAGIAN A: DATA SISWA
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(15, y, pageWidth - 30, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BAGIAN I: IDENTITAS LENGKAP CALON SISWA', 18, y + 3.5);
  y += 7.5;

  drawField('1. Nama Lengkap (Huruf Kapital) :');
  drawField('2. NISN / NIK Siswa :');
  drawField('3. Tempat, Tanggal Lahir :');
  drawField('4. Jenis Kelamin :');
  drawField('5. Agama & Kewarganegaraan :');
  drawField('6. Asal Sekolah (SMP/MTs/SD) :');
  drawField('7. Nomor Ijazah / SKL Sementara :');
  drawField('8. Alamat Lengkap Domisili :');
  drawField('9. No. WhatsApp / HP Siswa :');

  y += 2;

  // BAGIAN B: DATA ORANG TUA
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(15, y, pageWidth - 30, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BAGIAN II: IDENTITAS ORANG TUA / WALI PESERTA DIDIK', 18, y + 3.5);
  y += 7.5;

  drawField('1. Nama Ayah Kandung :');
  drawField('2. Pekerjaan & Instansi Ayah :');
  drawField('3. No. HP / WhatsApp Ayah :');
  drawField('4. Nama Ibu Kandung :');
  drawField('5. Pekerjaan & Instansi Ibu :');
  drawField('6. No. HP / WhatsApp Ibu :');
  drawField('7. Alamat Tempat Tinggal Orang Tua :');
  drawField('8. Rata-rata Penghasilan Keluarga :');

  y += 2;

  // BAGIAN C: CHECKLIST BERKAS
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(15, y, pageWidth - 30, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BAGIAN III: CHECKLIST KELENGKAPAN BERKAS FISIK (DIISI PETUGAS LOKET)', 18, y + 3.5);
  y += 6.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('[  ] 2 Lembar Fotokopi Akta Kelahiran Legalisir          [  ] 2 Lembar Fotokopi Kartu Keluarga (KK)', 18, y);
  y += 4;
  doc.text('[  ] 3 Lembar Pas Foto 3x4 Berseragam Sekolah Asal      [  ] Scan / Fotokopi Rapor 3 Semester Legalisir', 18, y);
  y += 4;
  doc.text('[  ] Piagam / Sertifikat Kejuaraan Asli & Foto (Jika Ada) [  ] Surat Keterangan Baik & Bebas Narkoba', 18, y);
  y += 6;

  // Signature Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Petugas Verifikator Loket PPDB,', 25, y);
  doc.text(`${config.city}, ____________________ 2024`, 120, y);
  doc.text('Orang Tua / Wali Pemohon,', 120, y + 4);

  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.text('( ___________________________ )', 20, y);
  doc.text('( ___________________________ )', 120, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Tanda tangan & stempel loket', 26, y + 3.5);
  doc.text('Tanda tangan & nama terang pemohon', 121, y + 3.5);

  y += 7;

  // Cut-off receipt for applicant
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(15, y, pageWidth - 15, y);
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('GUNting DI SINI — TANDA TERIMA BUKTI PENDAFTARAN (DIBERIKAN KEPADA CALON SISWA)', pageWidth / 2, y + 3.5, { align: 'center' });

  y += 7;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, pageWidth - 30, 15, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text(`Telah diterima berkas PPDB ${config.name} atas nama: ____________________________________`, 18, y + 4.5);
  doc.text(`No. Registrasi: _______________ | Petugas Penerima: _______________ | Tanggal: ___/___/2024`, 18, y + 8.5);
  doc.text(`Jadwal Asesmen Pemetaan: Mengikuti Gelombang (${config.ppdbStatus.deadline}) • Sekretariat: ${config.phone}`, 18, y + 12.5);

  drawFooter(doc, config, 1, 1, 'FRM-MANUAL-PPDB');

  const cleanName = config.shortName.replace(/[^a-zA-Z0-9]/g, '-');
  doc.save(`Formulir-Pendaftaran-Manual-${cleanName}.pdf`);
}

// -------------------------------------------------------------
// 3. GENERATOR: SILABUS PANDUAN ASESMEN POTENSI BAKAT
// -------------------------------------------------------------
export function generateSilabusAsesmen(config: SchoolConfig) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const primaryRgb = hexToRgb(theme.primaryColor);
  const secondaryRgb = hexToRgb(theme.secondaryColor);
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = drawHeader(doc, config, primaryRgb, secondaryRgb);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PANDUAN TEKNIS & SILABUS ASESMEN PEMETAAN POTENSI SISWA', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`PENERIMAAN PESERTA DIDIK BARU TAHUN AJARAN ${config.ppdbStatus.tahunAjaran}`, pageWidth / 2, y, { align: 'center' });
  y += 7;

  // Penjelasan Filosofis
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('FILOSOFI & TUJUAN ASESMEN:', 18, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const tujuanText = `Asesmen di ${config.name} bukan ujian saringan yang bersifat menggugurkan secara diskriminatif, melainkan instrumen diagnostik komprehensif untuk memetakan gaya belajar (modalitas visual/auditori/kinestetik), daya nalar kritis, kesiapan emosional, dan bakat minat siswa agar kurikulum dapat disesuaikan secara berdiferensiasi.`;
  const splitTujuan = doc.splitTextToSize(tujuanText, pageWidth - 36);
  doc.text(splitTujuan, 18, y + 8);

  y += 19;

  // Komponen Asesmen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('KOMPONEN MATERI, KISI-KISI & ALOKASI WAKTU ASESMEN', 15, y);
  y += 5;

  const modules = [
    {
      name: '1. Tes Potensi Skolastik & Nalar Logika (Durasi: 60 Menit)',
      kisi: [
        'Penalaran Deduktif & Induktif: Penarikan kesimpulan berdasarkan premis logis formal.',
        'Spasial & Pola Geometri: Identifikasi rotasi bidang gambar, analogi visual, dan proyeksi bangun.',
        'Analisis Deret & Logika Numerik: Barisan aritmatika bertingkat dan pola relasi angka aplikatif.'
      ]
    },
    {
      name: '2. Literasi Membaca Kritis & Penalaran Verbal (Durasi: 45 Menit)',
      kisi: [
        'Pemahaman Teks Wacana Ilmiah: Menemukan ide pokok, simpulan tersirat, dan argumen penulis.',
        'Analogi Kata & Kosa Kata Kontekstual: Padanan makna istilah sains, sastra, dan sosial.',
        'Evaluasi Fakta vs Opini: Kemampuan memilah informasi obyektif dari narasi subjektif.'
      ]
    },
    {
      name: '3. Numerasi & Pemecahan Masalah Sains Terapan (Durasi: 45 Menit)',
      kisi: [
        'Interpretasi Data Diagram: Membaca tabel statistika sederhana, grafik tren sains, dan proporsi data.',
        'Logika Pemodelan Matematika: Penerapan aljabar kontekstual pada masalah kehidupan sehari-hari.',
        'Metode Sains Dasar: Perumusan hipotesis sederhana dan identifikasi variabel eksperimen.'
      ]
    },
    {
      name: '4. Wawancara Pemetaan Minat, Bakat & Kepribadian Siswa (Durasi: 20 Menit)',
      kisi: [
        'Eksplorasi Minat Karir & Cita-Cita Masa Depan: Peminatan rumpun sains/teknologi/sosial humaniora.',
        'Kematangan Sosial & Daya Juang (Adversity Quotient): Refleksi penyelesaian tantangan studi.',
        'Verifikasi Portofolio & Kejuaraan: Presentasi karya inovasi atau piagam prestasi sebelumnya.'
      ]
    },
    {
      name: '5. Sesi Diskusi Kemitraan Orang Tua / Wali (Durasi: 25 Menit)',
      kisi: [
        'Penyelarasan Nilai Karakter Keluarga dengan Budaya Mutu Sekolah.',
        'Komitmen Pendampingan Belajar di Rumah dan Keterbukaan Komunikasi Evaluasi Siswa.'
      ]
    }
  ];

  modules.forEach((mod) => {
    doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.rect(15, y, 2.5, 4.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(mod.name, 20, y + 3.5);
    y += 5.5;

    mod.kisi.forEach((item) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(`• ${item}`, 20, y);
      y += 3.8;
    });
    y += 2;
  });

  // Perlengkapan yang Harus Dibawa
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, y, pageWidth - 30, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('TATA TERTIB & PERLENGKAPAN YANG WAJIB DIBAWA PESERTA:', 18, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Membawa Kartu Bukti Pendaftaran / Nomor Registrasi PPDB dan kartu identitas pelajar asal.', 18, y + 8.5);
  doc.text('2. Alat tulis pribadi: Pensil 2B, penghapus khusus ujian, dan bolpoin tinta hitam (tidak diperkenankan meminjam).', 18, y + 12);
  doc.text('3. Mengenakan seragam rapi sekolah asal serta hadir di ruang asesmen paling lambat 15 menit sebelum waktu dimulai.', 18, y + 15.5);

  drawFooter(doc, config, 1, 1, 'SIL-ASESMEN-01');

  const cleanName = config.shortName.replace(/[^a-zA-Z0-9]/g, '-');
  doc.save(`Silabus-Panduan-Asesmen-${cleanName}.pdf`);
}

// -------------------------------------------------------------
// 4. GENERATOR: FORMAT SURAT REKOMENDASI SEKOLAH ASAL
// -------------------------------------------------------------
export function generateSuratRekomendasi(config: SchoolConfig) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const primaryRgb = hexToRgb(theme.primaryColor);
  const secondaryRgb = hexToRgb(theme.secondaryColor);
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = drawHeader(doc, config, primaryRgb, secondaryRgb);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('FORMAT SURAT REKOMENDASI & KETERANGAN PRESTASI SISWA', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`SURAT RESMI DARI KEPALA SEKOLAH / WALI KELAS ASAL KEPADA PANITIA PPDB ${config.name.toUpperCase()}`, pageWidth / 2, y, { align: 'center' });
  y += 7;

  // Nomor Surat Template
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Nomor Surat Sekolah Asal : _______________________________________________', 15, y);
  y += 6;

  doc.text('Yang bertanda tangan di bawah ini:', 15, y);
  y += 5;

  const drawFieldLine = (label: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('____________________________________________________________________', 72, y);
    y += 5.5;
  };

  drawFieldLine('Nama Kepala Sekolah / Wali :');
  drawFieldLine('NIP / NUPTK :');
  drawFieldLine('Jabatan :');
  drawFieldLine('Nama Satuan Pendidikan Asal :');
  drawFieldLine('Alamat Satuan Pendidikan Asal :');
  drawFieldLine('No. Telepon / Email Sekolah :');

  y += 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Dengan ini memberikan keterangan dan rekomendasi sesungguhnya kepada peserta didik:`, 15, y);
  y += 5;

  drawFieldLine('Nama Peserta Didik :');
  drawFieldLine('NISN / NIS Sekolah Asal :');
  drawFieldLine('Tempat, Tanggal Lahir :');
  drawFieldLine('Peringkat Kelas Rata-rata :');

  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('Menerangkan dengan sebenar-benarnya bahwa peserta didik tersebut di atas:', 15, y);
  y += 5;

  const points = [
    '1. Menunjukkan budi pekerti yang luhur, berkarakter santun, taat beribadah, dan disiplin tinggi selama masa studi.',
    '2. Memiliki komitmen belajar yang tangguh serta tidak pernah melakukan pelanggaran berat, perundungan, maupun asusila.',
    '3. Memiliki keaktifan dalam kegiatan intrakurikuler dan ekstrakurikuler serta kemampuan berorganisasi yang baik.',
    `4. Sangat direkomendasikan dan layak untuk diterima melanjutkan jenjang pendidikan di ${config.name}.`
  ];

  points.forEach((p) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const splitPoint = doc.splitTextToSize(p, pageWidth - 30);
    doc.text(splitPoint, 15, y);
    y += (splitPoint.length * 3.8) + 1.5;
  });

  y += 4;

  // Rekam Prestasi Tambahan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Catatan Prestasi / Kejuaraan / Potensi Bakat Khusus yang Menonjol:', 15, y);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 16, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('(Tuliskan prestasi sains/olahraga/seni/tahfidz yang pernah diraih siswa beserta tingkat kejuaraan)', 18, y + 5);

  y += 22;

  // Closing
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Demikian surat rekomendasi ini dibuat dengan sadar dan obyektif untuk dipergunakan sebagaimana mestinya.', 15, y);

  y += 9;
  // Signature of Origin School Principal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Dikeluarkan di : _____________________', 120, y);
  doc.text('Pada tanggal    : _____ / _____ / 2024', 120, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.text('Kepala Sekolah Asal,', 120, y + 8);

  y += 24;
  doc.text('( ____________________________________ )', 115, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('NIP. _________________________________', 120, y + 4);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Cap stempel basah sekolah asal', 122, y + 7.5);

  drawFooter(doc, config, 1, 1, 'SURAT-REKOMENDASI-01');

  const cleanName = config.shortName.replace(/[^a-zA-Z0-9]/g, '-');
  doc.save(`Format-Surat-Rekomendasi-${cleanName}.pdf`);
}

// -------------------------------------------------------------
// 5. GENERATOR: PAKTA INTEGRITAS & TATA TERTIB
// -------------------------------------------------------------
export function generatePaktaIntegritas(config: SchoolConfig) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const primaryRgb = hexToRgb(theme.primaryColor);
  const secondaryRgb = hexToRgb(theme.secondaryColor);
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = drawHeader(doc, config, primaryRgb, secondaryRgb);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PAKTA INTEGRITAS & PERNYATAAN TATA TERTIB SEKOLAH', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`KOMITMEN KELUARGA BESAR PESERTA DIDIK BARU TAHUN AJARAN ${config.ppdbStatus.tahunAjaran}`, pageWidth / 2, y, { align: 'center' });
  y += 7;

  // Intro text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Kami yang bertanda tangan di bawah ini:', 15, y);
  y += 4.5;

  const drawField = (label: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('___________________________________________________________________', 68, y);
    y += 5;
  };

  drawField('1. Nama Lengkap Siswa :');
  drawField('2. No. Registrasi PPDB :');
  drawField('3. Nama Orang Tua / Wali :');
  drawField('4. Alamat Tempat Tinggal :');
  drawField('5. No. Telepon / WhatsApp :');

  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text(`Dengan ini berjanji dan menyatakan ikrar komitmen dengan penuh kesadaran dan tanggung jawab:`, 15, y);
  y += 5;

  const commitments = [
    'PASAL 1 — INTEGRITAS MORAL & AKHLAKUL KARIMAH: Senantiasa menjunjung tinggi nilai ketuhanan, kejujuran akademik, tidak berbuat curang dalam ujian/tugas, dan menghormati pendidik serta sesama warga sekolah.',
    'PASAL 2 — ZERO TOLERANCE TERHADAP PERUNDUNGAN (ANTI-BULLYING): Menolak keras segala bentuk intimidasi, kekerasan fisik, pemalakan, pelecehan verbal, maupun perundungan digital di media sosial.',
    'PASAL 3 — BEBAS NARKOBA, MIRAS & ROKOK/VAPE: Tidak akan pernah membawa, mengonsumsi, mengedarkan rokok tembakau, rokok elektrik (vape), minuman beralkohol, dan zat terlarang di dalam maupun luar kampus.',
    'PASAL 4 — KEDISIPLINAN KEHADIRAN & BUSANA: Mematuhi jadwal kehadiran tepat waktu (minimal kehadiran 90%), mengenakan seragam resmi lengkap sesuai aturan hari, dan menjaga kerapian tata rambut/penampilan.',
    'PASAL 5 — PENGGUNAAN GAWAI & TEKNOLOGI BIJAK: Mematuhi aturan pemanfaatan smartphone/laptop di lingkungan kelas sesuai instruksi guru mata pelajaran untuk tujuan riset dan pembelajaran terarah.',
    'PASAL 6 — SINERGI ORANG TUA: Orang tua berkomitmen mendampingi proses belajar di rumah, proaktif menghadiri rapat evaluasi perkembangan anak, dan mengedepankan musyawarah kekeluargaan.'
  ];

  commitments.forEach((com) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    const splitCom = doc.splitTextToSize(com, pageWidth - 30);
    doc.text(splitCom, 15, y);
    y += (splitCom.length * 3.4) + 1.8;
  });

  y += 2;
  // Sanksi
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(15, y, pageWidth - 30, 13, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(185, 28, 28);
  doc.text('KONSEKUENSI PELANGGARAN KESEPAKATAN TATA TERTIB:', 18, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(127, 29, 29);
  doc.text('Apabila saya melanggar komitmen di atas, saya bersedia menerima sanksi bertingkat: Pembinaan BK, Surat Peringatan (SP),', 18, y + 7.5);
  doc.text('Skorsing Kegiatan Akademik, hingga pengembalian hak pendidikan sepenuhnya kepada orang tua/wali.', 18, y + 10.5);

  y += 19;

  // Signature columns
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Menyetujui,', 25, y);
  doc.text(`${config.city}, ____________________ 2024`, 120, y);
  doc.text('Calon Peserta Didik Baru,', 25, y + 4);
  doc.text('Orang Tua / Wali Murid,', 120, y + 4);

  // Meterai box
  doc.setDrawColor(203, 213, 225);
  doc.rect(130, y + 7, 20, 11);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('Meterai', 137, y + 12);
  doc.text('Rp 10.000', 135, y + 15);

  y += 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('( ___________________________ )', 20, y);
  doc.text('( ___________________________ )', 120, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Tanda tangan siswa', 32, y + 3.5);
  doc.text('Tanda tangan di atas meterai', 127, y + 3.5);

  drawFooter(doc, config, 1, 1, 'PAKTA-INTEGRITAS-01');

  const cleanName = config.shortName.replace(/[^a-zA-Z0-9]/g, '-');
  doc.save(`Pakta-Integritas-${cleanName}.pdf`);
}

// Master Dispatcher
export function downloadSchoolDocument(docTitle: string, config: SchoolConfig) {
  const lower = docTitle.toLowerCase();
  if (lower.includes('brosur')) {
    generateBrosurPPDB(config);
  } else if (lower.includes('formulir')) {
    generateFormulirPendaftaran(config);
  } else if (lower.includes('silabus') || lower.includes('asesmen')) {
    generateSilabusAsesmen(config);
  } else if (lower.includes('rekomendasi')) {
    generateSuratRekomendasi(config);
  } else if (lower.includes('pakta') || lower.includes('integritas') || lower.includes('tertib')) {
    generatePaktaIntegritas(config);
  } else {
    // Default fallback to Brosur
    generateBrosurPPDB(config);
  }
}

// Generate official Indonesian School SPP Receipt PDF
export function generateKwitansiSPPPdf(config: SchoolConfig, bill: any) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5' // A5 is standard for Indonesian school receipt/kwitansi
  });

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const primaryRgb = hexToRgb(theme.primaryColor);
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(0, 0, pageWidth, 3.5, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(config.name.toUpperCase(), pageWidth / 2, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${config.address} • Telp/WA: ${config.whatsapp}`, pageWidth / 2, 16, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(10, 19, pageWidth - 10, 19);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('KUITANSI PEMBAYARAN SPP & KOMITE SEKOLAH', pageWidth / 2, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Nomor: ${bill.receiptNumber || bill.id}`, pageWidth / 2, 30, { align: 'center' });

  // Receipt Content Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(10, 34, pageWidth - 20, 72, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(10, 34, pageWidth - 20, 72, 3, 3, 'S');

  let y = 41;
  const rows = [
    ['Telah Terima Dari', `: ${bill.studentName} (${bill.studentClass})`],
    ['Nomor Induk / NISN', `: ${bill.studentNisn}`],
    ['Tahun Ajaran / Periode', `: ${bill.academicYear} — Bulan ${bill.month}`],
    ['Untuk Pembayaran', `: Iuran Sumbangan Pembinaan Pendidikan (SPP)`],
    ['Jumlah Pembayaran', `: Rp ${(bill.amount || 0).toLocaleString('id-ID')},00`],
    ['Metode Transaksi', `: ${bill.paymentMethod || 'Virtual Account Bank'}`],
    ['Tanggal Pelunasan', `: ${bill.paidAt || 'Tanggal Transaksi Resmi'}`],
    ['Status Pembayaran', `: LUNAS / VERIFIED`],
  ];

  rows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 14, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    if (label.includes('Status')) {
      doc.setTextColor(16, 185, 129); // emerald green
      doc.setFont('helvetica', 'bold');
    } else if (label.includes('Jumlah')) {
      doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.setFont('helvetica', 'bold');
    }
    doc.text(val, 55, y);
    y += 8;
  });

  // LUNAS Stamp
  doc.setDrawColor(16, 185, 129);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(pageWidth - 48, 86, 36, 14, 2, 2, 'FD');
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('LUNAS', pageWidth - 30, 93, { align: 'center' });
  doc.setFontSize(6);
  doc.text('TERVERIFIKASI SISTEM', pageWidth - 30, 97, { align: 'center' });

  // Signatures
  y = 114;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Diterbitkan di ${config.city}, ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`, pageWidth - 55, y);

  y += 5;
  doc.text('Pembayar / Wali Siswa,', 18, y);
  doc.text('Bendahara Sekolah,', pageWidth - 55, y);

  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`( ${bill.studentName} )`, 16, y);
  doc.text(`( ${bill.recordedBy || 'Ratna Dewanti, S.E.'} )`, pageWidth - 58, y);

  doc.save(`Kwitansi-SPP-${bill.month.replace(/\s+/g, '-')}-${bill.studentName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
}

// Generate printable E-Book sample PDF for digital library
export function generateEbookPdf(config: SchoolConfig, book: any) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const primaryRgb = hexToRgb(theme.primaryColor);
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cover header
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`REPOSITORI E-LIBRARY & KHAZANAH PUSTAKA ${config.name.toUpperCase()}`, 15, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Kategori: ${book.category} • ISBN: ${book.isbn || '978-602-XXX'} • Terbit: ${book.year || 2024}`, 15, 22);

  // Book Title
  let y = 50;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(book.title, pageWidth - 30);
  doc.text(titleLines, 15, y);
  y += titleLines.length * 8 + 4;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Penulis / Penyusun: ${book.author}`, 15, y);
  y += 10;

  // Synopsis Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, y, pageWidth - 30, 36, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text('INTISARI & SINOPSIS BUKU:', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(book.description, pageWidth - 42);
  doc.text(descLines, 20, y + 15);
  y += 46;

  // Sample Chapter Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Ekstrak Bab Pilihan (Digital Reader)', 15, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const sampleText = book.sampleChapterText || 'Bab 1: Pengantar dan Metodologi Pembelajaran Aktif.\n\nDalam era transformasi digital, literasi mendalam dan pemikiran kritis adalah pilar fundamental bagi generasi pembelajar. Modul ini dirancang khusus untuk memandu siswa memahami esensi konsep teoritis dan menerapkannya dalam eksperimen terukur...';
  const sampleLines = doc.splitTextToSize(sampleText, pageWidth - 30);
  doc.text(sampleLines, 15, y);

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Hak Cipta Digital Terlindungi — ${config.name} Perpustakaan Digital`, 15, 285);

  doc.save(`E-Book-${book.title.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}.pdf`);
}

