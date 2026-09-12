import React, { useState, useMemo } from 'react';
import { SchoolConfig, PageView, LibraryBook } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { SAMPLE_BOOKS } from '../data/portalAndLibraryData';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Sparkles, 
  Star, 
  Download, 
  BookMarked, 
  Headphones, 
  SlidersHorizontal, 
  X, 
  CheckCircle, 
  Calendar, 
  Layers, 
  FileText,
  Clock,
  Eye,
  Bookmark
} from 'lucide-react';

interface ELibraryPageProps {
  config: SchoolConfig;
  onNavigate: (page: PageView) => void;
}

export const ELibraryPage: React.FC<ELibraryPageProps> = ({
  config,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedBookForReader, setSelectedBookForReader] = useState<LibraryBook | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<'normal' | 'large'>('normal');
  const [readerDark, setReaderDark] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  const categories = ['Semua', 'Sains', 'Riset', 'Internasional', 'Sastra', 'Kurikulum', 'Audio'];

  const filteredBooks = useMemo(() => {
    return SAMPLE_BOOKS.filter((book) => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'Semua' || book.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleDownloadOffline = (book: LibraryBook) => {
    setDownloadNotice(`E-Book "${book.title}" sedang diunduh untuk dibaca secara offline.`);
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
                Akses tanpa batas ke lebih dari 25.000 koleksi buku teks nasional, modul Cambridge, publikasi karya ilmiah siswa, dan ensiklopedia ilmiah digital di {config.name}.
              </p>
            </div>

            {/* Quick stats box */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-black text-cyan-300">25.000+</div>
                  <div className="text-[11px] text-slate-300">Koleksi Buku Fisik</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">1.450+</div>
                  <div className="text-[11px] text-slate-300">E-Book Digital</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-300">85+</div>
                  <div className="text-[11px] text-slate-300">Jurnal Internasional</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-purple-300">24/7</div>
                  <div className="text-[11px] text-slate-300">Akses Cloud Mandiri</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - elevated with relative z-20 */}
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
                className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 text-xs"
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
                      onClick={() => setSelectedBookForReader(book)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Baca E-Book</span>
                    </button>

                    <button
                      onClick={() => handleDownloadOffline(book)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Unduh E-Book Offline"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">Tidak ada buku yang sesuai</h4>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain atau pilih kategori 'Semua'.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        )}

      </div>

      {/* MODAL E-READER INTERAKTIF */}
      {selectedBookForReader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className={`rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 ${
            readerDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            
            {/* Reader Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              readerDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold line-clamp-1">{selectedBookForReader.title}</h3>
                  <p className="text-[11px] text-slate-400">{selectedBookForReader.author} • ISBN: {selectedBookForReader.isbn}</p>
                </div>
              </div>

              {/* Controls: Font Size, Dark Mode Toggle, Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReaderFontSize(readerFontSize === 'normal' ? 'large' : 'normal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    readerDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}
                  title="Ubah Ukuran Font"
                >
                  {readerFontSize === 'normal' ? 'A+' : 'A-'}
                </button>

                <button
                  onClick={() => setReaderDark(!readerDark)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    readerDark ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}
                  title="Ganti Mode Gelap/Terang"
                >
                  {readerDark ? '☀ Terang' : '🌙 Gelap'}
                </button>

                <button
                  onClick={() => setSelectedBookForReader(null)}
                  className="w-8 h-8 rounded-full bg-slate-700/30 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 leading-relaxed">
              <div className={`p-4 rounded-2xl border ${
                readerDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-cyan-50/50 border-cyan-100 text-slate-700'
              } text-xs`}>
                <div className="font-bold text-cyan-500 uppercase tracking-wider mb-1">Ringkasan Sinopsis:</div>
                {selectedBookForReader.description}
              </div>

              {/* Sample Chapter Reading Text */}
              <div className={`prose max-w-none ${readerFontSize === 'large' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
                <div className="whitespace-pre-line font-serif leading-relaxed">
                  {selectedBookForReader.sampleChapterText}
                </div>
              </div>
            </div>

            {/* Reader Footer Actions */}
            <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
              readerDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="text-xs text-slate-400">
                Koleksi Terverifikasi • Lisensi Institusi {config.name}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadOffline(selectedBookForReader)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh E-Book Lengkap</span>
                </button>
                <button
                  onClick={() => setSelectedBookForReader(null)}
                  className="px-4 py-2 rounded-xl bg-slate-700/20 hover:bg-slate-700/40 text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
