import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  SchoolConfig,
  ThemePreset,
  FontPairing 
} from '../../types';
import { SchoolDbService } from '../../services/schoolDbService';
import { 
  DEFAULT_SCHOOL_CONFIG, 
  THEME_CONFIGS, 
  FONT_CONFIGS 
} from '../../data/defaultSchoolData';
import { 
  Server, 
  Users, 
  Globe, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Save, 
  X, 
  ShieldAlert, 
  Trophy, 
  Building2, 
  Newspaper,
  BookOpen,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Award,
  Calendar,
  BarChart3,
  Palette,
  ExternalLink,
  RotateCcw,
  Check,
  GraduationCap,
  School,
  FileText,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TimItPortalSectionProps {
  config: SchoolConfig;
  onUpdateConfig: (newConfig: SchoolConfig) => void;
  currentUser: UserProfile;
  users: UserProfile[];
  onNavigate?: (page: any, anchor?: any) => void;
}

// Helper to guarantee 100% resilient data structure without any missing nested properties
const getSafeConfig = (cfg?: Partial<SchoolConfig>): SchoolConfig => {
  const base = DEFAULT_SCHOOL_CONFIG;
  return {
    ...base,
    ...(cfg || {}),
    name: cfg?.name || base.name,
    shortName: cfg?.shortName || base.shortName,
    tagline: cfg?.tagline || base.tagline,
    subTagline: cfg?.subTagline || base.subTagline,
    accreditation: cfg?.accreditation || base.accreditation,
    establishedYear: cfg?.establishedYear || base.establishedYear,
    city: cfg?.city || base.city,
    address: cfg?.address || base.address,
    phone: cfg?.phone || base.phone,
    whatsapp: cfg?.whatsapp || base.whatsapp,
    email: cfg?.email || base.email,
    website: cfg?.website || base.website,
    themePreset: cfg?.themePreset || base.themePreset,
    fontPairing: cfg?.fontPairing || base.fontPairing,
    ppdbStatus: {
      ...base.ppdbStatus,
      ...(cfg?.ppdbStatus || {})
    },
    stats: {
      ...base.stats,
      ...(cfg?.stats || {})
    },
    principal: {
      ...base.principal,
      ...(cfg?.principal || {}),
      message: Array.isArray(cfg?.principal?.message)
        ? cfg.principal.message
        : base.principal.message
    }
  };
};

export const TimItPortalSection: React.FC<TimItPortalSectionProps> = ({
  config,
  onUpdateConfig,
  currentUser,
  users,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');
  const [searchUser, setSearchUser] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // User modal state (CRUD)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userForm, setUserForm] = useState<UserProfile>({
    id: '',
    role: 'guru',
    name: '',
    email: '',
    identityNumber: '',
    password: 'guru123',
    titleOrClass: '',
    phone: '0812-3456-7890'
  });

  // Website Content CMS State (Safe Defaults)
  const [editableConfig, setEditableConfig] = useState<SchoolConfig>(() => getSafeConfig(config));
  const [cmsSubTab, setCmsSubTab] = useState<'profil' | 'kontak' | 'sambutan' | 'ppdb' | 'statistik' | 'tampilan'>('profil');
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Sync state if external config changes
  useEffect(() => {
    if (config) {
      setEditableConfig(getSafeConfig(config));
    }
  }, [config]);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesQuery = 
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.identityNumber.includes(searchUser) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesQuery && matchesRole;
  });

  // ==========================================
  // USER MANAGEMENT HANDLERS (CRUD)
  // ==========================================
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({
      id: `user_${Date.now()}`,
      role: 'guru',
      name: '',
      email: '',
      identityNumber: '',
      password: 'guru123',
      titleOrClass: '',
      phone: '0812-3456-7890'
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setUserForm({ ...user, password: user.password || '' });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.identityNumber.trim()) return;

    // Convert spaces to dots in identityNumber
    const sanitizedIdentity = userForm.identityNumber.trim().replace(/\s+/g, '.');
    const sanitizedUser: UserProfile = {
      ...userForm,
      identityNumber: sanitizedIdentity,
      password: userForm.password?.trim() || (editingUser?.password || 'sekolah123')
    };

    try {
      if (editingUser) {
        await SchoolDbService.updateUserProfile(editingUser.id, sanitizedUser);
        showNotice(`Data akun ${sanitizedUser.name} berhasil diperbarui.`);
      } else {
        await SchoolDbService.addUserProfile(sanitizedUser);
        showNotice(`Pengguna baru ${sanitizedUser.name} (${sanitizedUser.role}) berhasil ditambahkan.`);
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun admin yang sedang aktif.');
      return;
    }

    if (window.confirm(`Hapus data akun ${name} dari sistem database sekolah?`)) {
      try {
        await SchoolDbService.deleteUserProfile(id);
        showNotice(`Akun ${name} berhasil dihapus dari database.`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ==========================================
  // WEBSITE CONTENT CMS HANDLERS
  // ==========================================
  const handleSaveWebsiteContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingContent(true);
    try {
      const cleanConfig = getSafeConfig(editableConfig);
      await SchoolDbService.saveSchoolConfig(cleanConfig);
      onUpdateConfig(cleanConfig);
      showNotice('Konten dan konfigurasi website sekolah berhasil disimpan ke Cloud Firestore!');
    } catch (err) {
      console.error(err);
      showNotice('Gagal menyimpan ke Firestore. Silakan coba lagi.');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh isi CMS ke standar awal (default)? Perubahan yang belum disimpan akan digantikan.')) {
      setEditableConfig(DEFAULT_SCHOOL_CONFIG);
      showNotice('Konten dikembalikan ke standar awal. Klik "Simpan Konten ke Cloud" untuk menerapkannya.');
    }
  };

  // Message paragraphs string for multi-line textarea
  const principalMessageString = (editableConfig.principal.message || []).join('\n\n');

  return (
    <div className="space-y-6">
      {/* Admin Profile Capsule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            ADM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{currentUser.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-wide">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              NIP: <code className="font-mono text-slate-700 font-bold">{currentUser.identityNumber}</code> • Email: {currentUser.email}
            </p>
            <p className="text-xs font-semibold text-indigo-700 mt-1">
              {currentUser.titleOrClass}
            </p>
          </div>
        </div>

        {/* Database & Infrastructure Capsule */}
        <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Firestore Cloud Database:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Connected (Online)
            </span>
          </div>
          <div className="text-slate-500 text-[11px] leading-tight">
            Pusat kendali akun pengguna multi-peran dan manajemen konten informasi website (CMS) terintegrasi Cloud Firestore.
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen Pengguna & Identitas ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'content'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Pengaturan Konten & Informasi Website (CMS)</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-extrabold ml-1">
            Utama
          </span>
        </button>
      </div>

      {/* Action Notification */}
      {statusNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* ==========================================
          TAB 1: USER DIRECTORY MANAGEMENT (CRUD)
          ========================================== */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Database Identitas Pengguna Sekolah
              </h4>
              <p className="text-xs text-slate-500">
                Pencatatan akun Guru, Siswa, Orang Tua / Wali, Staff Perpustakaan, dan Bendahara
              </p>
            </div>

            <button
              onClick={handleOpenAddUser}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Cari nama pengguna, NIP / NISN / NIK, atau email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white font-semibold"
              >
                <option value="all">Semua Peran (Roles)</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
                <option value="wali">Orang Tua / Wali</option>
                <option value="perpustakaan">Staff Perpustakaan</option>
                <option value="bendahara">Bendahara Sekolah</option>
                <option value="it">Admin</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-700 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Nama & Email</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">NIP / NISN / NIK</th>
                  <th className="py-3 px-4">Sandi Akun</th>
                  <th className="py-3 px-4">Jabatan / Kelas</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Aksi Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">{u.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === 'guru' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : u.role === 'siswa'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'wali'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'perpustakaan'
                          ? 'bg-cyan-100 text-cyan-800'
                          : u.role === 'bendahara'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {u.role === 'it' ? 'Admin' : u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {u.identityNumber}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-indigo-700 font-bold text-[11px]">
                        {u.password || 'default'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {u.titleOrClass}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer"
                          title="Edit Pengguna"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={u.id === currentUser.id}
                          className={`p-1.5 rounded-lg ${
                            u.id === currentUser.id 
                              ? 'opacity-30 cursor-not-allowed text-slate-300' 
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer'
                          }`}
                          title="Hapus Pengguna"
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
      )}

      {/* ==========================================
          TAB 2: WEBSITE CONTENT CMS (CRUD CLOUD)
          ========================================== */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* CMS Control Bar & Live Preview Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-400/30">
                    Content Management System
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Cloud Sync Ready
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Pusat Pengaturan Konten & Informasi Website
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  Kelola identitas resmi sekolah, kontak & alamat kampus, profil kepala sekolah, manajemen PPDB online, statistik keunggulan, serta tema visual website sekolah.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-700 shadow-sm"
                    title="Buka Halaman Depan Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat Website</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                  title="Kembalikan ke Nilai Default"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveWebsiteContent()}
                  disabled={isSavingContent}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingContent ? 'Menyimpan ke Cloud...' : 'Simpan Konten ke Cloud'}</span>
                </button>
              </div>
            </div>

            {/* Live Quick Preview Capsule */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Nama Sekolah:</span>
                <span className="font-bold text-white truncate block">{editableConfig.name}</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Status PPDB:</span>
                <span className={`inline-flex items-center gap-1 font-bold ${editableConfig.ppdbStatus.isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${editableConfig.ppdbStatus.isOpen ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  {editableConfig.ppdbStatus.isOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Hotline & WhatsApp:</span>
                <span className="font-mono text-slate-200 truncate block">{editableConfig.phone || editableConfig.whatsapp}</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Tema Visual:</span>
                <span className="font-bold text-indigo-300 capitalize">{editableConfig.themePreset.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setCmsSubTab('profil')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                cmsSubTab === 'profil'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>1. Profil & Identitas</span>
            </button>

            <button
              type="button"
              onClick={() => setCmsSubTab('kontak')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                cmsSubTab === 'kontak'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>2. Kontak & Alamat</span>
            </button>

            <button
              type="button"
              onClick={() => setCmsSubTab('sambutan')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                cmsSubTab === 'sambutan'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>3. Kepala Sekolah</span>
            </button>

            <button
              type="button"
              onClick={() => setCmsSubTab('ppdb')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                cmsSubTab === 'ppdb'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>4. PPDB Online</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-extrabold ${editableConfig.ppdbStatus.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                {editableConfig.ppdbStatus.isOpen ? 'BUKA' : 'TUTUP'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCmsSubTab('statistik')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                cmsSubTab === 'statistik'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>5. Statistik & Prestasi</span>
            </button>

            <button
              type="button"
              onClick={() => setCmsSubTab('tampilan')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                cmsSubTab === 'tampilan'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>6. Tema & Font</span>
            </button>
          </div>

          {/* CMS SUB-TAB PANELS */}
          <form onSubmit={handleSaveWebsiteContent} className="space-y-6">

            {/* ==========================================
                PANEL 1: PROFIL & IDENTITAS
                ========================================== */}
            {cmsSubTab === 'profil' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>Identitas Resmi & Profil Sekolah</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Informasi dasar sekolah yang muncul pada navigasi atas, hero section, dan profil footer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nama Lengkap Resmi Sekolah <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editableConfig.name}
                      onChange={(e) => setEditableConfig({ ...editableConfig, name: e.target.value })}
                      placeholder="Contoh: Sekolah Labschool Kebangsaan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nama Singkat / Brand Populer <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editableConfig.shortName}
                      onChange={(e) => setEditableConfig({ ...editableConfig, shortName: e.target.value })}
                      placeholder="Contoh: Labschool Kebangsaan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status Akreditasi</label>
                    <input
                      type="text"
                      value={editableConfig.accreditation}
                      onChange={(e) => setEditableConfig({ ...editableConfig, accreditation: e.target.value })}
                      placeholder="Terakreditasi A (Unggul) BAN-S/M"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tahun Berdiri</label>
                    <input
                      type="text"
                      value={editableConfig.establishedYear}
                      onChange={(e) => setEditableConfig({ ...editableConfig, establishedYear: e.target.value })}
                      placeholder="1968"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kota / Domisili</label>
                    <input
                      type="text"
                      value={editableConfig.city}
                      onChange={(e) => setEditableConfig({ ...editableConfig, city: e.target.value })}
                      placeholder="Jakarta Timur, DKI Jakarta"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Slogan / Motto Utama Sekolah</label>
                  <input
                    type="text"
                    value={editableConfig.tagline}
                    onChange={(e) => setEditableConfig({ ...editableConfig, tagline: e.target.value })}
                    placeholder="Iman, Ilmu, Amal — Unggul, Mandiri, Berkarakter"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-900"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat / Sub-Tagline Visi</label>
                  <textarea
                    rows={3}
                    value={editableConfig.subTagline}
                    onChange={(e) => setEditableConfig({ ...editableConfig, subTagline: e.target.value })}
                    placeholder="Membimbing generasi pemimpin masa depan dengan kurikulum holistik..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* ==========================================
                PANEL 2: KONTAK & ALAMAT
                ========================================== */}
            {cmsSubTab === 'kontak' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <span>Kontak Resmi & Lokasi Kampus</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data hotline, WhatsApp center, alamat surel resmi, dan alamat fisik kampus sekolah.
                  </p>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap Kampus</label>
                  <input
                    type="text"
                    value={editableConfig.address}
                    onChange={(e) => setEditableConfig({ ...editableConfig, address: e.target.value })}
                    placeholder="Jl. Pemuda Kompleks Rawamangun No. 1, Jakarta Timur 13220"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Telepon Hotline / Kantor</label>
                    <input
                      type="text"
                      value={editableConfig.phone}
                      onChange={(e) => setEditableConfig({ ...editableConfig, phone: e.target.value })}
                      placeholder="(021) 4786-0038 / (021) 4786-0039"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp Resmi Sekolah</label>
                    <input
                      type="text"
                      value={editableConfig.whatsapp}
                      onChange={(e) => setEditableConfig({ ...editableConfig, whatsapp: e.target.value })}
                      placeholder="0812-8889-1968"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alamat Email Resmi</label>
                    <input
                      type="email"
                      value={editableConfig.email}
                      onChange={(e) => setEditableConfig({ ...editableConfig, email: e.target.value })}
                      placeholder="sekretariat@labschool-kebangsaan.sch.id"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">URL Domain Website Sekolah</label>
                    <input
                      type="url"
                      value={editableConfig.website}
                      onChange={(e) => setEditableConfig({ ...editableConfig, website: e.target.value })}
                      placeholder="https://sekolah-labschool.sch.id"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PANEL 3: KEPALA SEKOLAH & SAMBUTAN
                ========================================== */}
            {cmsSubTab === 'sambutan' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>Profil Kepala Sekolah & Sambutan Resmi</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data kepala sekolah dan teks sambutan yang dipublikasikan pada seksi sambutan di beranda.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Kepala Sekolah Beserta Gelar</label>
                    <input
                      type="text"
                      value={editableConfig.principal.name}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        principal: { ...editableConfig.principal, name: e.target.value }
                      })}
                      placeholder="Dr. Hendra Gunawan, M.Pd."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Titel / Jabatan</label>
                    <input
                      type="text"
                      value={editableConfig.principal.title}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        principal: { ...editableConfig.principal, title: e.target.value }
                      })}
                      placeholder="Kepala Sekolah Labschool Kebangsaan"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">URL Foto Profil Kepala Sekolah</label>
                    <input
                      type="url"
                      value={editableConfig.principal.photo}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        principal: { ...editableConfig.principal, photo: e.target.value }
                      })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                    />
                    {editableConfig.principal.photo && (
                      <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <img 
                          src={editableConfig.principal.photo} 
                          alt="Preview Kepala Sekolah" 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[10px] text-slate-500">Pratinjau Foto Kepala Sekolah</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">URL Video Sambutan (Opsional)</label>
                    <input
                      type="url"
                      value={editableConfig.principal.speechVideoUrl || ''}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        principal: { ...editableConfig.principal, speechVideoUrl: e.target.value }
                      })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Kutipan / Moto Utama Sambutan</label>
                  <input
                    type="text"
                    value={editableConfig.principal.quote}
                    onChange={(e) => setEditableConfig({
                      ...editableConfig,
                      principal: { ...editableConfig.principal, quote: e.target.value }
                    })}
                    placeholder="Pendidikan bukan sekadar mencetak lulusan berijazah..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium italic text-indigo-900"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">
                    Teks Paragraf Sambutan Lengkap
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Tips: Berikan jeda dua kali enter (baris kosong) untuk membuat paragraf baru.
                  </p>
                  <textarea
                    rows={6}
                    value={principalMessageString}
                    onChange={(e) => {
                      const paras = e.target.value.split('\n\n').map(p => p.trim()).filter(Boolean);
                      setEditableConfig({
                        ...editableConfig,
                        principal: {
                          ...editableConfig.principal,
                          message: paras.length > 0 ? paras : [e.target.value]
                        }
                      });
                    }}
                    placeholder="Tuliskan isi sambutan resmi kepala sekolah di sini..."
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 leading-relaxed font-normal"
                  />
                </div>
              </div>
            )}

            {/* ==========================================
                PANEL 4: STATUS & PENGATURAN PPDB ONLINE
                ========================================== */}
            {cmsSubTab === 'ppdb' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span>Pusat Kendali PPDB Online & Kuota Pendaftaran</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Atur status pembukaan pendaftaran siswa baru, sisa kuota kursi, dan informasi gelombang.
                    </p>
                  </div>

                  {/* Toggle Switch Open / Closed */}
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-700">Status Pendaftaran:</span>
                    <button
                      type="button"
                      onClick={() => setEditableConfig({
                        ...editableConfig,
                        ppdbStatus: { ...editableConfig.ppdbStatus, isOpen: !editableConfig.ppdbStatus.isOpen }
                      })}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        editableConfig.ppdbStatus.isOpen
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                      }`}
                    >
                      {editableConfig.ppdbStatus.isOpen ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Pendaftaran DIBUKA</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Pendaftaran DITUTUP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gelombang Pendaftaran Aktif</label>
                    <input
                      type="text"
                      value={editableConfig.ppdbStatus.gelombang}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        ppdbStatus: { ...editableConfig.ppdbStatus, gelombang: e.target.value }
                      })}
                      placeholder="Gelombang 1 - Jalur Prestasi & Reguler"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran Penerimaan</label>
                    <input
                      type="text"
                      value={editableConfig.ppdbStatus.tahunAjaran}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        ppdbStatus: { ...editableConfig.ppdbStatus, tahunAjaran: e.target.value }
                      })}
                      placeholder="2025/2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Batas Waktu / Deadline Pendaftaran</label>
                    <input
                      type="text"
                      value={editableConfig.ppdbStatus.deadline}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        ppdbStatus: { ...editableConfig.ppdbStatus, deadline: e.target.value }
                      })}
                      placeholder="31 Juli 2025"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sisa Kuota Kursi Tersedia</label>
                    <input
                      type="number"
                      min={0}
                      value={editableConfig.ppdbStatus.kuotaTersisa}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        ppdbStatus: { ...editableConfig.ppdbStatus, kuotaTersisa: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="45"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-indigo-700"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Diskon / Benefit Early Bird</label>
                    <input
                      type="text"
                      value={editableConfig.ppdbStatus.diskonEarlyBird}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        ppdbStatus: { ...editableConfig.ppdbStatus, diskonEarlyBird: e.target.value }
                      })}
                      placeholder="Cashback Biaya Formulir 25%"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium text-emerald-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PANEL 5: STATISTIK & INDIKATOR PRESTASI
                ========================================== */}
            {cmsSubTab === 'statistik' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>Statistik Keunggulan & Counter Prestasi Sekolah</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Angka-angka pencapaian yang dipamerkan pada seksi Stats Counter di halaman beranda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block mb-1">Tingkat Kelulusan Ujian</label>
                    <input
                      type="text"
                      value={editableConfig.stats.kelulusan}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        stats: { ...editableConfig.stats, kelulusan: e.target.value }
                      })}
                      placeholder="100%"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-black text-indigo-700 text-base"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block mb-1">Diterima di PTN / Kedinasan</label>
                    <input
                      type="text"
                      value={editableConfig.stats.ptnFavorit}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        stats: { ...editableConfig.stats, ptnFavorit: e.target.value }
                      })}
                      placeholder="94.8%"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-black text-emerald-700 text-base"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block mb-1">Medali Prestasi Kejuaraan</label>
                    <input
                      type="text"
                      value={editableConfig.stats.medaliPrestasi}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        stats: { ...editableConfig.stats, medaliPrestasi: e.target.value }
                      })}
                      placeholder="280+"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-black text-amber-700 text-base"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block mb-1">Ragam Ekstrakurikuler Unggulan</label>
                    <input
                      type="text"
                      value={editableConfig.stats.ekskulCount}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        stats: { ...editableConfig.stats, ekskulCount: e.target.value }
                      })}
                      placeholder="32+"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-black text-blue-700 text-base"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block mb-1">Tenaga Pendidik Berijazah S2 / S3</label>
                    <input
                      type="text"
                      value={editableConfig.stats.pengajarS2S3}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        stats: { ...editableConfig.stats, pengajarS2S3: e.target.value }
                      })}
                      placeholder="86%"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-black text-purple-700 text-base"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block mb-1">Alumni Sukses Tersebar</label>
                    <input
                      type="text"
                      value={editableConfig.stats.alumniTersebar}
                      onChange={(e) => setEditableConfig({
                        ...editableConfig,
                        stats: { ...editableConfig.stats, alumniTersebar: e.target.value }
                      })}
                      placeholder="15.000+"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-black text-teal-700 text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PANEL 6: TEMA VISUAL & TIPOGRAFI
                ========================================== */}
            {cmsSubTab === 'tampilan' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-indigo-600" />
                    <span>Preset Warna & Tipografi Website</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sesuaikan identitas estetika dan atmosfer visual seluruh halaman website sekolah secara langsung.
                  </p>
                </div>

                {/* Theme Palette Presets */}
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-3">
                    Pilihan Palet Warna Identitas (Theme Preset):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {(Object.keys(THEME_CONFIGS) as ThemePreset[]).map((themeKey) => {
                      const t = THEME_CONFIGS[themeKey];
                      const isSelected = editableConfig.themePreset === themeKey;
                      return (
                        <div
                          key={themeKey}
                          onClick={() => setEditableConfig({ ...editableConfig, themePreset: themeKey })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-slate-900">{t.name}</span>
                              {isSelected && (
                                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 my-2">
                              <div className="w-6 h-6 rounded-full border border-white shadow-xs" style={{ backgroundColor: t.primaryColor }} title="Primary" />
                              <div className="w-6 h-6 rounded-full border border-white shadow-xs" style={{ backgroundColor: t.secondaryColor }} title="Secondary" />
                              <div className="w-6 h-6 rounded-full border border-white shadow-xs" style={{ backgroundColor: t.accentColor }} title="Accent" />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 font-mono">{themeKey}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Font Pairing Presets */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="font-bold text-slate-800 text-xs block mb-3">
                    Pilihan Tipografi Font (Font Pairing):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {(Object.keys(FONT_CONFIGS) as FontPairing[]).map((fontKey) => {
                      const f = FONT_CONFIGS[fontKey];
                      const isSelected = editableConfig.fontPairing === fontKey;
                      return (
                        <div
                          key={fontKey}
                          onClick={() => setEditableConfig({ ...editableConfig, fontPairing: fontKey })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">{f.name}</span>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">
                              Heading + Body Typography
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Perubahan akan disinkronkan secara permanen ke Cloud Firestore dan langsung diterapkan ke seluruh halaman website.
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 text-xs cursor-pointer transition-colors"
                >
                  Reset Standar
                </button>

                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingContent ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          MODAL TAMBAH / EDIT IDENTITAS USER (CRUD)
          ========================================== */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>{editingUser ? 'Edit Identitas Pengguna' : 'Tambah Pengguna Sistem Baru'}</span>
              </h3>
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Peran Akses Portal (Role)</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="guru">Guru (Akses Jurnal & Penilaian Formatif)</option>
                  <option value="siswa">Siswa (Akses Unggah Tugas & E-Book)</option>
                  <option value="wali">Orang Tua / Wali (Buku Penghubung & Catatan BK)</option>
                  <option value="perpustakaan">Staff Perpustakaan (CRUD Gerbang Literasi)</option>
                  <option value="bendahara">Bendahara (CRUD Tagihan SPP Indonesia)</option>
                  <option value="it">Admin (Kelola User & CMS)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                  placeholder="Drs. H. Mulyadi, M.Pd."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP / NISN / NIK</label>
                  <input
                    type="text"
                    required
                    value={userForm.identityNumber}
                    onChange={(e) => setUserForm({ ...userForm, identityNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                    placeholder="19820315.200801.1.005"
                  />
                  <span className="text-[10px] text-slate-400">Format titik (.) otomatis</span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kata Sandi Akun</label>
                  <input
                    type="text"
                    required
                    value={userForm.password || ''}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="Contoh: guru123, siswa123"
                  />
                  <span className="text-[10px] text-slate-400">Sandi siap digunakan</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="nama@sekolah.sch.id"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="0812-3456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jabatan / Kelas</label>
                <input
                  type="text"
                  required
                  value={userForm.titleOrClass}
                  onChange={(e) => setUserForm({ ...userForm, titleOrClass: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Guru Fisika & Riset"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Daftarkan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
