import React, { useState, useEffect, useMemo } from 'react';
import { 
  SchoolConfig, 
  PageView, 
  UserProfile, 
  UserRole,
  TeachingJournal, 
  AssignmentQueue, 
  StudentSubmission, 
  CounselingNote, 
  SppBill, 
  LibraryBook 
} from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../data/defaultSchoolData';
import { SchoolDbService, INITIAL_STAFF_USERS, DEFAULT_ROLE_PASSWORDS } from '../services/schoolDbService';
import { GuruPortalSection } from './portal/GuruPortalSection';
import { SiswaPortalSection } from './portal/SiswaPortalSection';
import { WaliPortalSection } from './portal/WaliPortalSection';
import { PerpustakaanPortalSection } from './portal/PerpustakaanPortalSection';
import { BendaharaPortalSection } from './portal/BendaharaPortalSection';
import { TimItPortalSection } from './portal/TimItPortalSection';
import { 
  ArrowLeft, 
  UserCheck, 
  GraduationCap, 
  Users, 
  BookOpen, 
  CreditCard, 
  ShieldCheck,
  Database,
  LogIn,
  LogOut,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  ArrowRight,
  X,
  Check
} from 'lucide-react';

interface PortalAkademikPageProps {
  config: SchoolConfig;
  onNavigate: (page: PageView) => void;
  onUpdateConfig?: (newConfig: SchoolConfig) => void;
  currentUser?: UserProfile | null;
  onUserChange?: (user: UserProfile | null) => void;
}

export const PortalAkademikPage: React.FC<PortalAkademikPageProps> = ({
  config,
  onNavigate,
  onUpdateConfig,
  currentUser: parentUser,
  onUserChange
}) => {
  // Authentication State synchronized with parent App state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (parentUser !== undefined) return parentUser;
    try {
      const saved = localStorage.getItem('school_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (parentUser !== undefined) {
      setCurrentUser(parentUser);
    }
  }, [parentUser]);

  // Login form state
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Database real-time state
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_STAFF_USERS);
  const [journals, setJournals] = useState<TeachingJournal[]>([]);
  const [assignments, setAssignments] = useState<AssignmentQueue[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [counselingNotes, setCounselingNotes] = useState<CounselingNote[]>([]);
  const [sppBills, setSppBills] = useState<SppBill[]>([]);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Real-time detection of user name and role based on NIP / NISN / NIK input
  const detectedUser = useMemo(() => {
    const query = identifierInput.trim().toLowerCase();
    if (!query || query.length < 3) return null;
    const normalizedQuery = query.replace(/[\s.]+/g, '');
    return users.find(u => {
      const normalizedIdentity = u.identityNumber.toLowerCase().replace(/[\s.]+/g, '');
      return (
        normalizedIdentity === normalizedQuery ||
        u.identityNumber.toLowerCase() === query ||
        u.email.toLowerCase() === query
      );
    }) || null;
  }, [identifierInput, users]);

  // Change Password Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const theme = THEME_CONFIGS[config.themePreset] || THEME_CONFIGS['indigo-royal'];
  const font = FONT_CONFIGS[config.fontPairing] || FONT_CONFIGS['modern'];

  // Helper to update active user across state, local storage and parent
  const updateActiveUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    onUserChange?.(user);
    if (user) {
      try {
        localStorage.setItem('school_auth_user', JSON.stringify(user));
      } catch (err) {
        console.warn(err);
      }
    } else {
      try {
        localStorage.removeItem('school_auth_user');
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    // Initialize database default documents if empty
    SchoolDbService.initializeDatabaseIfEmpty(config).catch(console.error);

    // Subscribe to all collections
    const unsubUsers = SchoolDbService.subscribeUsers((data) => {
      if (data && data.length > 0) {
        setUsers(data);
      }
      setIsLoading(false);
    });
    const unsubJournals = SchoolDbService.subscribeTeachingJournals((data) => setJournals(data));
    const unsubAssignments = SchoolDbService.subscribeAssignments((data) => setAssignments(data));
    const unsubSubmissions = SchoolDbService.subscribeSubmissions((data) => setSubmissions(data));
    const unsubNotes = SchoolDbService.subscribeCounselingNotes((data) => setCounselingNotes(data));
    const unsubBills = SchoolDbService.subscribeSppBills((data) => setSppBills(data));
    const unsubBooks = SchoolDbService.subscribeLibraryBooks((data) => setBooks(data));

    return () => {
      unsubUsers();
      unsubJournals();
      unsubAssignments();
      unsubSubmissions();
      unsubNotes();
      unsubBills();
      unsubBooks();
    };
  }, []);

  // Update current user if updated in Firestore database
  useEffect(() => {
    if (currentUser) {
      const refreshed = users.find(u => u.id === currentUser.id);
      if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(currentUser)) {
        setCurrentUser(refreshed);
        try {
          localStorage.setItem('school_auth_user', JSON.stringify(refreshed));
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }, [users, currentUser]);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const query = identifierInput.trim().toLowerCase();
    const enteredPassword = passwordInput.trim();

    if (!query) {
      setLoginError('Silakan masukkan NIP, NISN, atau NIK Anda.');
      setIsLoggingIn(false);
      return;
    }

    // Match in users list (robust matching: compare dots, spaces, or plain alphanumeric)
    const normalizedQuery = query.replace(/[\s.]+/g, '');

    const matched = users.find(u => {
      const normalizedIdentity = u.identityNumber.toLowerCase().replace(/[\s.]+/g, '');
      return (
        normalizedIdentity === normalizedQuery ||
        u.identityNumber.toLowerCase() === query ||
        u.email.toLowerCase() === query ||
        u.id.toLowerCase() === query
      );
    });

    if (matched) {
      const expectedPassword = matched.password || DEFAULT_ROLE_PASSWORDS[matched.role]?.password || 'sekolah123';
      if (!enteredPassword) {
        setIsLoggingIn(false);
        setLoginError('Silakan masukkan kata sandi akun Anda untuk melanjutkan.');
        return;
      }
      if (enteredPassword !== expectedPassword) {
        setIsLoggingIn(false);
        setLoginError('Kata sandi yang Anda masukkan salah. Silakan periksa kembali ketikan kata sandi Anda dan coba lagi. (Pastikan tombol Caps Lock tidak aktif).');
        return;
      }

      updateActiveUser(matched);
      setIsLoggingIn(false);
      setLoginError(null);
    } else {
      setIsLoggingIn(false);
      setLoginError('Nomor NIP / NISN / NIK belum terdaftar di sistem sekolah. Silakan periksa kembali nomor Anda atau hubungi Admin sekolah.');
    }
  };

  // Change Password Handler for authenticated user
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setChangePasswordError(null);
    setChangePasswordSuccess(null);

    const expectedCurrent = currentUser.password || DEFAULT_ROLE_PASSWORDS[currentUser.role]?.password || 'sekolah123';
    if (currentPasswordInput.trim() !== expectedCurrent) {
      setChangePasswordError(`Kata sandi saat ini tidak cocok. (Petunjuk sandi akun Anda: "${expectedCurrent}")`);
      return;
    }

    if (newPasswordInput.trim().length < 6) {
      setChangePasswordError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      setChangePasswordError('Konfirmasi kata sandi baru tidak sama.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const newPass = newPasswordInput.trim();
      await SchoolDbService.updateUserPassword(currentUser.id, newPass);
      const updatedUser: UserProfile = { ...currentUser, password: newPass };
      updateActiveUser(updatedUser);
      setChangePasswordSuccess('Kata sandi berhasil diperbarui! Anda dapat menggunakannya untuk login berikutnya.');
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setChangePasswordSuccess(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setChangePasswordError('Gagal memperbarui kata sandi di server. Silakan coba kembali.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    updateActiveUser(null);
    setIdentifierInput('');
    setPasswordInput('');
    setLoginError(null);
  };

  // Helper labels & styles per role
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'siswa':
        return {
          label: 'Portal Siswa',
          title: 'Siswa Aktif',
          bg: 'bg-indigo-600',
          text: 'text-indigo-600',
          lightBg: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          icon: GraduationCap
        };
      case 'guru':
        return {
          label: 'Portal Guru',
          title: 'Pendidik / Tenaga Pengajar',
          bg: 'bg-emerald-600',
          text: 'text-emerald-600',
          lightBg: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          icon: UserCheck
        };
      case 'wali':
        return {
          label: 'Portal Orang Tua / Wali',
          title: 'Wali Murid Siswa',
          bg: 'bg-amber-600',
          text: 'text-amber-600',
          lightBg: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: Users
        };
      case 'perpustakaan':
        return {
          label: 'Staff Perpustakaan',
          title: 'Kepala & Pustakawan E-Library',
          bg: 'bg-cyan-600',
          text: 'text-cyan-600',
          lightBg: 'bg-cyan-50',
          borderColor: 'border-cyan-200',
          icon: BookOpen
        };
      case 'bendahara':
        return {
          label: 'Bendahara (SPP)',
          title: 'Pengelola Administrasi Keuangan SPP',
          bg: 'bg-teal-600',
          text: 'text-teal-600',
          lightBg: 'bg-teal-50',
          borderColor: 'border-teal-200',
          icon: CreditCard
        };
      case 'it':
      default:
        return {
          label: 'Admin',
          title: 'Administrator Utama & IT',
          bg: 'bg-slate-900',
          text: 'text-slate-900',
          lightBg: 'bg-slate-100',
          borderColor: 'border-slate-300',
          icon: ShieldCheck
        };
    }
  };

  // =========================================================================
  // VIEW 1: UNLOGGED-IN STATE (LOGIN FORM ONLY - ALL PORTALS HIDDEN)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Top Header Banner */}
        <div 
          className="text-white relative pt-8 pb-20 border-b border-slate-800"
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, ${theme.primaryColor} 100%)`
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
              <span className="text-slate-300">Sistem Informasi Sekolah</span>
              <span className="text-slate-500">/</span>
              <span className="text-indigo-300 font-bold">Login Portal</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold mb-3 border border-indigo-400/30">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Sistem Akses Terproteksi Multi-Peran (RBAC)</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white ${font.headingClass}`}>
                Login Portal {config.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
                Silakan masuk dengan kredensial terdaftar untuk mengakses portal resmi sesuai hak akses Anda. Portal Guru, Siswa, Orang Tua, Perpustakaan, Bendahara, dan Admin terisolasi demi menjaga integritas data.
              </p>
            </div>
          </div>
        </div>

        {/* Main Login Card Area - Centered & Focused Single Card */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-indigo-600" />
                  <span>Masuk ke Akun Anda</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan nomor identitas dan kata sandi akun Anda
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
                SSO
              </div>
            </div>

            {loginError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{loginError}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Field 1: NIP / NISN / NIK */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  NIP / NISN / NIK:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifierInput}
                    onChange={(e) => {
                      setIdentifierInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Masukkan NIP, NISN, atau NIK Anda"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-mono font-medium bg-white text-slate-900"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Siswa: NISN • Guru & Tenaga Pendidik: NIP • Orang Tua: NIK
                </p>
              </div>

              {/* Real-time Detection Drop-down: Nama & Peran (Role) Muncul Otomatis */}
              {detectedUser && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-slate-50 to-indigo-50/40 border border-indigo-200 text-slate-800 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const detectedMeta = getRoleBadge(detectedUser.role);
                      const DetectedIcon = detectedMeta.icon;
                      return (
                        <>
                          <div className={`w-10 h-10 rounded-xl ${detectedMeta.bg} text-white flex items-center justify-center shrink-0 shadow-xs font-bold`}>
                            <DetectedIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {detectedUser.name}
                              </h4>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                                <Check className="w-3 h-3 text-emerald-600" /> Terdaftar
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                              <span className="font-bold text-indigo-700">
                                Peran: {detectedMeta.label.replace('Portal ', '')}
                              </span>
                              {detectedUser.titleOrClass && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-600 font-medium">{detectedUser.titleOrClass}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Field 2: Kata Sandi */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kata Sandi:
                  </label>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Masukkan kata sandi akun Anda"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-mono font-medium bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Tampilkan sandi"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button: Simply "Masuk" */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <span>Memverifikasi...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Koneksi Terenkripsi & Aman
              </span>
              <button
                onClick={() => onNavigate('elibrary')}
                className="text-indigo-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Katalog E-Library Publik</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED STATE (ONLY SHOW AUTHORIZED PORTAL - STRICT RBAC)
  // =========================================================================
  const roleMeta = getRoleBadge(currentUser.role);
  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Banner & Authenticated User Status */}
      <div 
        className="text-white relative pt-8 pb-16 border-b border-slate-800"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, ${theme.primaryColor} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">Portal Akademik</span>
              <span className="text-slate-500">/</span>
              <span className="text-indigo-300 font-bold">{roleMeta.label}</span>
            </div>

            {/* Logout Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-500/30 text-xs"
                title="Keluar dari sesi akun saat ini"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login Berhasil • Akses Terisolasi Peran: {roleMeta.label}</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white ${font.headingClass}`}>
                {roleMeta.label}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl leading-relaxed">
                Selamat datang kembali, <strong>{currentUser.name}</strong> ({roleMeta.title}). Sesuai izin keamanan sekolah, Anda hanya dapat mengakses dan mengelola fitur di portal ini.
              </p>
            </div>

            {/* Quick User Identity Capsule */}
            <div className="lg:col-span-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-10 h-10 rounded-xl ${roleMeta.bg} text-white flex items-center justify-center shrink-0 font-bold shadow-md`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      No. Induk: {currentUser.identityNumber}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 border-t border-white/10 pt-2 flex items-center justify-between">
                  <span>Status: <strong className="text-emerald-400 capitalize">{currentUser.status || 'aktif'}</strong></span>
                  <span>Email: <strong>{currentUser.email}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Strictly Render ONLY Authorized Portal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Security Alert Header: Notifying user about strict single-role view */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 rounded-xl text-xs font-extrabold ${roleMeta.bg} text-white flex items-center gap-1.5`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{roleMeta.label} Terverifikasi</span>
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              Peran Anda membatasi akses hanya untuk portal ini. Portal peran lain tidak ditampilkan.
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200"
              title="Perbarui kata sandi akun Anda"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Ubah Sandi</span>
            </button>
            <button
              onClick={() => onNavigate('elibrary')}
              className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-sky-100"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Katalog E-Library</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Akun</span>
            </button>
          </div>
        </div>

        {/* 1. GURU ONLY */}
        {currentUser.role === 'guru' && (
          <GuruPortalSection
            config={config}
            currentUser={currentUser}
            journals={journals}
            assignments={assignments}
            submissions={submissions}
          />
        )}

        {/* 2. SISWA ONLY */}
        {currentUser.role === 'siswa' && (
          <SiswaPortalSection
            config={config}
            currentUser={currentUser}
            assignments={assignments}
            submissions={submissions}
            books={books}
            onNavigateToElibrary={() => onNavigate('elibrary')}
          />
        )}

        {/* 3. WALI ONLY */}
        {currentUser.role === 'wali' && (
          <WaliPortalSection
            config={config}
            currentUser={currentUser}
            counselingNotes={counselingNotes}
            sppBills={sppBills}
          />
        )}

        {/* 4. PERPUSTAKAAN ONLY */}
        {currentUser.role === 'perpustakaan' && (
          <PerpustakaanPortalSection
            config={config}
            currentUser={currentUser}
            books={books}
          />
        )}

        {/* 5. BENDAHARA ONLY */}
        {currentUser.role === 'bendahara' && (
          <BendaharaPortalSection
            config={config}
            currentUser={currentUser}
            sppBills={sppBills}
          />
        )}

        {/* 6. ADMIN ONLY (formerly TIM IT) */}
        {currentUser.role === 'it' && (
          <TimItPortalSection
            config={config}
            onUpdateConfig={onUpdateConfig || (() => {})}
            currentUser={currentUser}
            users={users}
            onNavigate={onNavigate}
          />
        )}

      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Ubah Kata Sandi</h3>
                  <p className="text-xs text-slate-500">Akun: {currentUser.name} ({roleMeta.label})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setChangePasswordError(null);
                  setChangePasswordSuccess(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {changePasswordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{changePasswordError}</div>
              </div>
            )}

            {changePasswordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{changePasswordSuccess}</div>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Saat Ini:
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Masukkan sandi saat ini"
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Sandi default akun Anda: <code>{currentUser.password || DEFAULT_ROLE_PASSWORDS[currentUser.role]?.password || 'sekolah123'}</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Baru:
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi Baru:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono bg-white text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setChangePasswordError(null);
                    setChangePasswordSuccess(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingPassword ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Sandi Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
