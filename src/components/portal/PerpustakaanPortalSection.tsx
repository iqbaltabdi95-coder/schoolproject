import React, { useState } from 'react';
import { 
  UserProfile, 
  SchoolConfig, 
  LibraryBook 
} from '../../types';
import { SchoolDbService } from '../../services/schoolDbService';
import { generateEbookPdf } from '../../utils/pdfGenerator';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Eye, 
  Download, 
  X, 
  Star, 
  CheckCircle2, 
  Layers,
  Sparkles,
  BookMarked
} from 'lucide-react';

interface PerpustakaanPortalSectionProps {
  config: SchoolConfig;
  currentUser: UserProfile;
  books: LibraryBook[];
}

export const PerpustakaanPortalSection: React.FC<PerpustakaanPortalSectionProps> = ({
  config,
  currentUser,
  books
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Modal states for Create / Edit book
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: 'Sains' as any,
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
    year: 2024,
    pages: 350,
    rating: 4.9,
    isbn: '978-602-8899-01-2',
    availableDigital: true,
    availablePhysical: true,
    description: '',
    sampleChapterText: ''
  });

  // Reader state
  const [activeReaderBook, setActiveReaderBook] = useState<LibraryBook | null>(null);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const categories = ['Semua', 'Sains', 'Riset', 'Internasional', 'Sastra', 'Kurikulum', 'Audio'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setBookForm({
      title: '',
      author: '',
      category: 'Sains',
      cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
      year: 2024,
      pages: 320,
      rating: 4.8,
      isbn: `978-602-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-1`,
      availableDigital: true,
      availablePhysical: true,
      description: '',
      sampleChapterText: 'Bab 1: Pengantar dan Landasan Teori Ilmiah.\n\nEksplorasi keilmuan dimulai dari rasa ingin tahu yang terstruktur. Modul ini menyajikan panduan komprehensif bagi pembelajar untuk menguasai konsep dasar dan implementasinya di laboratorium modern...'
    });
    setIsBookModalOpen(true);
  };

  const handleOpenEditModal = (book: LibraryBook) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      cover: book.cover,
      year: book.year,
      pages: book.pages,
      rating: book.rating,
      isbn: book.isbn,
      availableDigital: book.availableDigital,
      availablePhysical: book.availablePhysical,
      description: book.description,
      sampleChapterText: book.sampleChapterText || ''
    });
    setIsBookModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim() || !bookForm.author.trim()) return;

    try {
      if (editingBook) {
        await SchoolDbService.updateLibraryBook(editingBook.id, {
          ...bookForm
        });
        showNotice(`Buku "${bookForm.title}" berhasil diperbarui.`);
      } else {
        await SchoolDbService.addLibraryBook({
          ...bookForm,
          addedBy: currentUser.name
        });
        showNotice(`Buku baru "${bookForm.title}" berhasil ditambahkan ke katalog khazanah.`);
      }
      setIsBookModalOpen(false);
      setEditingBook(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBook = async (id: string, title: string) => {
    if (window.confirm(`Hapus buku "${title}" dari katalog perpustakaan?`)) {
      try {
        await SchoolDbService.deleteLibraryBook(id);
        showNotice(`Buku "${title}" berhasil dihapus dari katalog.`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownloadBook = (book: LibraryBook) => {
    generateEbookPdf(config, book);
    showNotice(`E-Book "${book.title}" berhasil diunduh.`);
  };

  return (
    <div className="space-y-6">
      {/* Staff Profile Capsule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{currentUser.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-extrabold uppercase tracking-wide">
                Staff Perpustakaan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              NIP: <code className="font-mono text-slate-700 font-bold">{currentUser.identityNumber}</code> • Email: {currentUser.email}
            </p>
            <p className="text-xs font-semibold text-cyan-700 mt-1">
              {currentUser.titleOrClass}
            </p>
          </div>
        </div>

        {/* Quick Inventory Capsule */}
        <div className="md:col-span-4 bg-cyan-50/70 rounded-2xl p-4 border border-cyan-200 text-xs grid grid-cols-2 gap-3">
          <div>
            <div className="text-lg font-black text-cyan-900">{books.length}</div>
            <div className="text-[11px] text-slate-500">Judul Terkatalog</div>
          </div>
          <div>
            <div className="text-lg font-black text-emerald-700">
              {books.reduce((acc, b) => acc + (b.reads || 0), 0)}
            </div>
            <div className="text-[11px] text-slate-500">Total Akses Baca</div>
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

      {/* Catalog Management Panel (CRUD) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Katalog Gerbang Literasi & Khazanah Pengetahuan
              </h4>
              <p className="text-xs text-slate-500">
                Pengelolaan koleksi buku fisik, modul Cambridge, jurnal ilmiah, dan e-book digital
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Koleksi Buku</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku, nama penulis, atau nomor ISBN..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
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

        {/* Table of Books with CRUD buttons */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-extrabold tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Buku & Cover</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">ISBN / Tahun</th>
                <th className="py-3 px-4">Dibaca</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-10 h-14 object-cover rounded-lg shadow-xs shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{book.title}</h5>
                        <p className="text-[11px] text-slate-500">Penulis: {book.author}</p>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{book.rating}</span>
                          <span className="text-slate-400 font-normal">({book.pages} hlm)</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                      {book.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    <div>{book.isbn}</div>
                    <div className="text-slate-400 text-[10px]">Thn {book.year}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-semibold">
                    {book.reads || 0} kali
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setActiveReaderBook(book)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="Buka Reader"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDownloadBook(book)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="Unduh E-Book"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(book)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer"
                        title="Edit Buku"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteBook(book.id, book.title)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="Hapus Buku"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          MODAL TAMBAH / EDIT BUKU (CRUD)
          ========================================== */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                <span>{editingBook ? 'Edit Informasi Buku' : 'Tambah Buku ke Gerbang Literasi'}</span>
              </h3>
              <button 
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Buku / Modul</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
                  placeholder="Contoh: Fisika Kuantum & Spektroskopi Modern"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Penulis / Tim Penyusun</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    placeholder="Prof. Dr. Yohanes Surya"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Khazanah</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-semibold"
                  >
                    <option value="Sains">Sains & Terapan</option>
                    <option value="Riset">Riset & Karya Ilmiah</option>
                    <option value="Internasional">Kurikulum Internasional</option>
                    <option value="Sastra">Sastra & Kearifan Lokal</option>
                    <option value="Kurikulum">Kurikulum Nasional</option>
                    <option value="Audio">Audio Book / Podcast</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor ISBN</label>
                  <input
                    type="text"
                    required
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                    placeholder="978-602-XXX"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun Terbit</label>
                  <input
                    type="number"
                    required
                    value={bookForm.year}
                    onChange={(e) => setBookForm({ ...bookForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Halaman</label>
                  <input
                    type="number"
                    required
                    value={bookForm.pages}
                    onChange={(e) => setBookForm({ ...bookForm, pages: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL Gambar Sampul (Cover)</label>
                <input
                  type="text"
                  required
                  value={bookForm.cover}
                  onChange={(e) => setBookForm({ ...bookForm, cover: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono text-[11px]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sinopsis & Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  required
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Ringkasan isi dan target pembaca..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teks Ekstrak Bab (Digital Reader Preview)</label>
                <textarea
                  rows={4}
                  required
                  value={bookForm.sampleChapterText}
                  onChange={(e) => setBookForm({ ...bookForm, sampleChapterText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-serif leading-relaxed"
                  placeholder="Tuliskan isi bab pembuka yang dapat dibaca di reader aplikasi..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer"
                >
                  {editingBook ? 'Simpan Perubahan' : 'Terbitkan Buku'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reader Modal */}
      {activeReaderBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col p-6 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-base line-clamp-1">{activeReaderBook.title}</h3>
              </div>
              <button 
                onClick={() => setActiveReaderBook(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-serif leading-relaxed text-sm whitespace-pre-line text-slate-700">
              {activeReaderBook.sampleChapterText}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleDownloadBook(activeReaderBook)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh E-Book (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
