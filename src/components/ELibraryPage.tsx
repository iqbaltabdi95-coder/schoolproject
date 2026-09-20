import React, { useState, useEffect, useMemo } from 'react';
import { SchoolConfig, PageView, LibraryBook } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { SAMPLE_BOOKS } from '../data/portalAndLibraryData';
import { SchoolDbService } from '../services/schoolDbService';
import { generateEbookPdf } from '../utils/pdfGenerator';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Star, 
  Download, 
  BookMarked, 
  X, 
  CheckCircle, 
  Eye,
  Database
} from 'lucide-react';

interface ELibraryPageProps {
  config: SchoolConfig;
  onNavigate: (page: PageView) => void;
}

export const ELibraryPage: React.FC<ELibraryPageProps> = ({
  config,
  onNavigate
}) => {
  const [books, setBooks] = useState<LibraryBook[]>(SAMPLE_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedBookForReader, setSelectedBookForReader] = useState<LibraryBook | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<'normal' | 'large'>('normal');
  const [readerDark, setReaderDark] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const categories = ['Semua', 'Sains', 'Riset', 'Internasional', 'Sastra', 'Kurikulum', 'Audio'];

  // Subscribe to real-time books from Firestore
  useEffect(() => {
    const unsub = SchoolDbService.subscribeLibraryBooks((firestoreBooks) => {
      if (firestoreBooks && firestoreBooks.length > 0) {
        setBooks(firestoreBooks);
      }
    });
    return () => unsub();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'Semua' || book.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [books, searchQuery, selectedCategory]);

  const handleOpenBookReader = (book: LibraryBook) => {
    setSelectedBookForReader(book);
    SchoolDbService.incrementBookRead(book.id);
  };

  const handleDownloadOffline = (book: LibraryBook) => {
    generateEbookPdf(config, book);
    setDownloadNotice(`E-Book "${book.title}" berhasil diunduh dalam format PDF resmi.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Page Header Banner */}
      <div 
        className="text-white relative pt-8 pb-16 border-b border-slate-800"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #0369a1 50%, ${theme.primaryColor} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">Pusat Literasi</span>
            <span className="text-slate-500">/</span>
            <span className="text-cyan-300 font-bold">E-Library & Riset Siswa</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold mb-3 border border-cyan-400/30">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Katalog Terpadu Perpustakaan Digital & Repository Riset</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white ${font.headingClass}`}>
                Gerbang Literasi & Khazanah Pengetahuan
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-3 max-w-2xl leading-relaxed">
                Akses tanpa batas ke koleksi buku teks nasional, modul Cambridge, publikasi karya ilmiah siswa, dan ensiklopedia ilmiah digital di {config.name}. Terkelola realtime oleh staff perpustakaan sekolah.
              </p>
            </div>

            {/* Quick stats box */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-black text-cyan-300">{books.length}</div>
                  <div className="text-[11px] text-slate-300">Judul di Database</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">1.450+</div>
                  <div className="text-[11px] text-slate-300">Koleksi E-Book</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-300">85+</div>
                  <div className="text-[11px] text-slate-300">Jurnal Internasional</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-purple-300">Cloud</div>
                  <div className="text-[11px] text-slate-300">Firestore Sync</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-4 sm:p-6 mb-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku, topik riset, nama penulis, atau nomor ISBN..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold text-slate-600">
            <span className="text-slate-400 shrink-0 text-[11px] uppercase tracking-wider pr-1">Kategori:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Download Notice */}
        {downloadNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-cyan-600 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-400 transition-all duration-300 flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {book.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-extrabold text-amber-500 shadow-xs">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{book.rating}</span>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2 mb-1">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    Oleh: {book.author}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {book.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{book.pages} Halaman</span>
                    <span>Tahun {book.year}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenBookReader(book)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Baca E-Book</span>
                    </button>

                    <button
                      onClick={() => handleDownloadOffline(book)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Unduh E-Book Offline (PDF)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedBookForReader && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-3xl w-full shadow-2xl border transition-all duration-300 max-h-[90vh] flex flex-col ${
              readerDark 
                ? 'bg-slate-950 border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-4 sm:p-6 border-b flex items-center justify-between ${
              readerDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-500 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base line-clamp-1">{selectedBookForReader.title}</h3>
                  <p className="text-xs text-slate-400">Oleh: {selectedBookForReader.author} • ISBN: {selectedBookForReader.isbn}</p>
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
                  onClick={() => handleDownloadOffline(selectedBookForReader)}
                  className="p-1.5 rounded-lg border hover:bg-slate-200/50 cursor-pointer"
                  title="Unduh E-Book"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedBookForReader(null)}
                  className="p-1.5 rounded-lg border hover:bg-rose-100 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                <strong>Sinopsis Buku:</strong> {selectedBookForReader.description}
              </div>

              <div className={`prose max-w-none leading-relaxed whitespace-pre-line font-serif ${
                readerFontSize === 'large' ? 'text-lg' : 'text-sm'
              }`}>
                {selectedBookForReader.sampleChapterText}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-xs ${
              readerDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span>Total: {selectedBookForReader.pages} Halaman • Terkatalog di Gerbang Literasi</span>
              <button
                onClick={() => handleDownloadOffline(selectedBookForReader)}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Dokumen PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
