import React, { useState } from 'react';
import { 
  UserProfile, 
  SchoolConfig, 
  SppBill 
} from '../../types';
import { SchoolDbService } from '../../services/schoolDbService';
import { generateKwitansiSPPPdf } from '../../utils/pdfGenerator';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  FileText, 
  DollarSign,
  Receipt,
  Wallet,
  Building
} from 'lucide-react';

interface BendaharaPortalSectionProps {
  config: SchoolConfig;
  currentUser: UserProfile;
  sppBills: SppBill[];
}

export const BendaharaPortalSection: React.FC<BendaharaPortalSectionProps> = ({
  config,
  currentUser,
  sppBills
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterMonth, setFilterMonth] = useState<string>('Semua');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Modal states for Create / Edit
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<SppBill | null>(null);
  const [billForm, setBillForm] = useState({
    studentId: 'user_siswa_farhan',
    studentName: 'Farhan Aditya Pratama',
    studentNisn: '0078192341',
    studentClass: 'XI - Peminatan Riset & Sains 1',
    academicYear: '2024/2025',
    month: 'Oktober 2024',
    amount: 2750000,
    dueDate: '10 Oktober 2024',
    status: 'Belum Lunas' as 'Lunas' | 'Belum Lunas' | 'Menunggu Konfirmasi',
    vaNumber: '8801 0078 1923 4110',
    notes: 'Iuran bulanan SPP reguler'
  });

  // Modal states for Payment Verification (Update)
  const [verifyingBill, setVerifyingBill] = useState<SppBill | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    status: 'Lunas' as 'Lunas' | 'Belum Lunas' | 'Menunggu Konfirmasi',
    paymentMethod: 'Bank Transfer Virtual Account BNI',
    receiptNumber: `KW-SPP/2024/${Math.floor(1000 + Math.random() * 9000)}`,
    notes: 'Pelunasan diverifikasi bendahara sekolah'
  });

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const indonesianMonths = [
    'Semua',
    'Juli 2024',
    'Agustus 2024',
    'September 2024',
    'Oktober 2024',
    'November 2024',
    'Desember 2024',
    'Januari 2025',
    'Februari 2025',
    'Maret 2025',
    'April 2025',
    'Mei 2025',
    'Juni 2025'
  ];

  // Filter bills
  const filteredBills = sppBills.filter((b) => {
    const matchesSearch = 
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.studentNisn.includes(searchQuery) ||
      b.studentClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vaNumber.includes(searchQuery);
    const matchesStatus = filterStatus === 'Semua' || b.status === filterStatus;
    const matchesMonth = filterMonth === 'Semua' || b.month === filterMonth;
    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Financial statistics according to Indonesian School Treasury
  const totalReceived = sppBills
    .filter(b => b.status === 'Lunas')
    .reduce((acc, b) => acc + (b.amount || 0), 0);

  const totalOutstanding = sppBills
    .filter(b => b.status === 'Belum Lunas')
    .reduce((acc, b) => acc + (b.amount || 0), 0);

  const pendingConfirmationCount = sppBills.filter(b => b.status === 'Menunggu Konfirmasi').length;

  // Handlers
  const handleOpenAddBill = () => {
    setEditingBill(null);
    setBillForm({
      studentId: 'user_siswa_farhan',
      studentName: 'Farhan Aditya Pratama',
      studentNisn: '0078192341',
      studentClass: 'XI - Peminatan Riset & Sains 1',
      academicYear: '2024/2025',
      month: 'November 2024',
      amount: 2750000,
      dueDate: '10 November 2024',
      status: 'Belum Lunas',
      vaNumber: `8801 0078 1923 ${Math.floor(1000 + Math.random() * 9000)}`,
      notes: 'Tagihan SPP bulanan sekolah'
    });
    setIsBillModalOpen(true);
  };

  const handleOpenEditBill = (bill: SppBill) => {
    setEditingBill(bill);
    setBillForm({
      studentId: bill.studentId,
      studentName: bill.studentName,
      studentNisn: bill.studentNisn,
      studentClass: bill.studentClass,
      academicYear: bill.academicYear,
      month: bill.month,
      amount: bill.amount,
      dueDate: bill.dueDate,
      status: bill.status,
      vaNumber: bill.vaNumber,
      notes: bill.notes || ''
    });
    setIsBillModalOpen(true);
  };

  const handleSaveBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billForm.studentName.trim() || !billForm.amount) return;

    try {
      if (editingBill) {
        await SchoolDbService.updateSppBill(editingBill.id, {
          ...billForm,
          recordedBy: currentUser.name
        });
        showNotice(`Tagihan SPP ${billForm.month} untuk ${billForm.studentName} diperbarui.`);
      } else {
        await SchoolDbService.addSppBill({
          ...billForm,
          recordedBy: currentUser.name
        });
        showNotice(`Tagihan SPP baru ${billForm.month} berhasil diterbitkan.`);
      }
      setIsBillModalOpen(false);
      setEditingBill(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBill = async (id: string, name: string, month: string) => {
    if (window.confirm(`Hapus tagihan SPP ${month} untuk siswa ${name}?`)) {
      try {
        await SchoolDbService.deleteSppBill(id);
        showNotice(`Tagihan SPP ${month} berhasil dihapus.`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenVerifyModal = (bill: SppBill) => {
    setVerifyingBill(bill);
    setPaymentForm({
      status: 'Lunas',
      paymentMethod: bill.paymentMethod || 'Bank Transfer Virtual Account BNI',
      receiptNumber: bill.receiptNumber || `KW-SPP/2024/${Math.floor(1000 + Math.random() * 9000)}`,
      notes: bill.notes || 'Pelunasan diverifikasi bendahara sekolah'
    });
  };

  const handleSavePaymentVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingBill) return;

    try {
      await SchoolDbService.updateSppBill(verifyingBill.id, {
        status: paymentForm.status,
        paymentMethod: paymentForm.paymentMethod,
        receiptNumber: paymentForm.receiptNumber,
        paidAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
        recordedBy: currentUser.name,
        notes: paymentForm.notes
      });
      showNotice(`Status SPP siswa ${verifyingBill.studentName} berhasil diverifikasi LUNAS.`);
      setVerifyingBill(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintKwitansi = (bill: SppBill) => {
    generateKwitansiSPPPdf(config, bill);
    showNotice(`Kwitansi resmi SPP untuk ${bill.studentName} berhasil dicetak.`);
  };

  return (
    <div className="space-y-6">
      {/* Bendahara Profile Capsule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{currentUser.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                Bendahara Sekolah
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

        {/* Indonesian School Fee Standards Capsule */}
        <div className="md:col-span-5 bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-xs space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>Standar Iuran SPP Sekolah Indonesia</span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">Thn Ajaran 2024/2025</span>
          </div>
          <div className="text-slate-600 text-[11px] leading-tight">
            Siklus 12 bulan (Juli s.d. Juni). Batas jatuh tempo tanggal 10 tiap bulan berjalan via Virtual Account perbankan nasional.
          </div>
        </div>
      </div>

      {/* Cash Flow Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Total Penerimaan SPP (Lunas)</div>
            <div className="text-lg sm:text-xl font-black text-emerald-700">
              Rp {totalReceived.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Tagihan Berjalan (Belum Lunas)</div>
            <div className="text-lg sm:text-xl font-black text-amber-700">
              Rp {totalOutstanding.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Menunggu Verifikasi Bukti</div>
            <div className="text-lg sm:text-xl font-black text-blue-700">
              {pendingConfirmationCount} Siswa
            </div>
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

      {/* SPP Ledger Management Panel (CRUD) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Buku Induk Tagihan & Rekapitulasi SPP Siswa
              </h4>
              <p className="text-xs text-slate-500">
                Manajemen penerbitan tagihan, verifikasi virtual account, dan pencetakan kuitansi resmi
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddBill}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Tagihan SPP</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, nomor NISN, atau virtual account..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white font-semibold"
            >
              {indonesianMonths.map(m => (
                <option key={m} value={m}>Bulan: {m}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white font-semibold"
            >
              <option value="Semua">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
            </select>
          </div>
        </div>

        {/* Table of Bills */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-extrabold tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Siswa & NISN</th>
                <th className="py-3 px-4">Bulan / Periode</th>
                <th className="py-3 px-4">Nominal SPP</th>
                <th className="py-3 px-4">Jatuh Tempo & VA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Aksi Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-xs">{bill.studentName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">NISN: {bill.studentNisn}</div>
                    <div className="text-[10px] text-indigo-600 font-medium">{bill.studentClass}</div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>{bill.month}</div>
                    <div className="text-[10px] text-slate-400 font-mono">TA: {bill.academicYear}</div>
                  </td>

                  <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                    Rp {bill.amount.toLocaleString('id-ID')}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    <div className="text-slate-800 font-bold">VA: {bill.vaNumber}</div>
                    <div className="text-slate-400 text-[10px]">Jatuh Tempo: {bill.dueDate}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      bill.status === 'Lunas' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : bill.status === 'Menunggu Konfirmasi'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bill.status}
                    </span>
                    {bill.paidAt && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{bill.paidAt}</div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {bill.status === 'Lunas' ? (
                        <button
                          onClick={() => handlePrintKwitansi(bill)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                          title="Cetak Kuitansi SPP"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Kuitansi</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenVerifyModal(bill)}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verifikasi</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditBill(bill)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="Edit Tagihan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteBill(bill.id, bill.studentName, bill.month)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="Hapus Tagihan"
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
          MODAL TERBITKAN / EDIT TAGIHAN SPP
          ========================================== */}
      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>{editingBill ? 'Edit Data Tagihan SPP' : 'Terbitkan Tagihan SPP Baru'}</span>
              </h3>
              <button 
                onClick={() => setIsBillModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    required
                    value={billForm.studentName}
                    onChange={(e) => setBillForm({ ...billForm, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    placeholder="Farhan Aditya Pratama"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Induk / NISN</label>
                  <input
                    type="text"
                    required
                    value={billForm.studentNisn}
                    onChange={(e) => setBillForm({ ...billForm, studentNisn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    placeholder="0078192341"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas</label>
                  <input
                    type="text"
                    required
                    value={billForm.studentClass}
                    onChange={(e) => setBillForm({ ...billForm, studentClass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="XI - Peminatan Riset & Sains 1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    required
                    value={billForm.academicYear}
                    onChange={(e) => setBillForm({ ...billForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="2024/2025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bulan Tagihan</label>
                  <select
                    value={billForm.month}
                    onChange={(e) => setBillForm({ ...billForm, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    {indonesianMonths.filter(m => m !== 'Semua').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nominal Iuran (Rupiah)</label>
                  <input
                    type="number"
                    required
                    value={billForm.amount}
                    onChange={(e) => setBillForm({ ...billForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-700"
                    placeholder="2750000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Jatuh Tempo</label>
                  <input
                    type="text"
                    required
                    value={billForm.dueDate}
                    onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="10 Oktober 2024"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Virtual Account</label>
                  <input
                    type="text"
                    required
                    value={billForm.vaNumber}
                    onChange={(e) => setBillForm({ ...billForm, vaNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    placeholder="8801 0078 1923 4110"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tagihan</label>
                <input
                  type="text"
                  value={billForm.notes}
                  onChange={(e) => setBillForm({ ...billForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Iuran bulanan reguler atau catatan beasiswa"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBillModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  {editingBill ? 'Simpan Perubahan' : 'Terbitkan Tagihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL VERIFIKASI PEMBAYARAN SPP
          ========================================== */}
      {verifyingBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Verifikasi Pelunasan SPP</span>
              </h3>
              <button 
                onClick={() => setVerifyingBill(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePaymentVerification} className="space-y-4 mt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="font-bold text-sm">{verifyingBill.studentName}</div>
                <div className="text-[11px] text-slate-600">
                  Tagihan: <strong>{verifyingBill.month}</strong> • Nominal: <strong>Rp {verifyingBill.amount.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status Pembayaran</label>
                <select
                  value={paymentForm.status}
                  onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="Lunas">Lunas (Terverifikasi)</option>
                  <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                  <option value="Belum Lunas">Belum Lunas (Tolak)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kanal / Metode Pembayaran</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Bank Transfer Virtual Account BNI">Bank Transfer Virtual Account BNI</option>
                  <option value="Virtual Account Mandiri Livin">Virtual Account Mandiri Livin</option>
                  <option value="Virtual Account BSI Mobile">Virtual Account BSI Mobile (Syariah)</option>
                  <option value="Virtual Account BCA / KlikBCA">Virtual Account BCA / KlikBCA</option>
                  <option value="Kasir Loket Pembayaran Sekolah (Tunai)">Kasir Loket Pembayaran Sekolah (Tunai)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Kuitansi Resmi</label>
                <input
                  type="text"
                  required
                  value={paymentForm.receiptNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, receiptNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan / Catatan Verifikasi</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVerifyingBill(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Simpan Status Pelunasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
