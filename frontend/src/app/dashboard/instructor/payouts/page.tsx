'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  TrendingUp, 
  Wallet, 
  History, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowUpRight,
  Plus,
  Loader2,
  Building,
  Save
} from 'lucide-react';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

interface RevenueStats {
  weekly: number;
  monthly: number;
  yearly: number;
}

interface Transaction {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  type: string;
  createdAt: string;
  completedAt?: string;
}

export default function InstructorPayoutsPage() {
  const [user, setUser] = React.useState<any>(null);
  const [stats, setStats] = React.useState<RevenueStats>({ weekly: 0, monthly: 0, yearly: 0 });
  const [balance, setBalance] = React.useState(0);
  const [history, setHistory] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSavingBank, setIsSavingBank] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState('');
  const [revenueList, setRevenueList] = React.useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');
  
  const [bankInfo, setBankInfo] = React.useState({
    bankName: '',
    bankAccount: '',
    bankOwner: ''
  });

  React.useEffect(() => {
    if (revenueList.length > 0 && !selectedMonth) {
      const months = Array.from(new Set(revenueList.map(r => new Date(r.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }))));
      setSelectedMonth(months[0] as string);
    }
  }, [revenueList]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [userRes, statsRes, balanceRes, historyRes, revenueRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/financial/instructor/stats'),
        api.get('/financial/balance'),
        api.get('/financial/my-transactions'),
        api.get('/financial/instructor/revenue-details')
      ]);
      setUser(userRes.data);
      setBankInfo({
        bankName: userRes.data.bankName || '',
        bankAccount: userRes.data.bankAccount || '',
        bankOwner: userRes.data.bankOwner || ''
      });
      setStats(statsRes.data);
      setBalance(balanceRes.data.balance);
      setHistory(historyRes.data.filter((t: any) => t.type === 'WITHDRAWAL'));
      setRevenueList(revenueRes.data);
    } catch (error) {
      console.error('Failed to fetch payout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setIsSavingBank(true);
      await api.patch(`/users/${user.id}`, bankInfo);
      alert('Đã cập nhật thông tin ngân hàng thành công!');
      fetchData(); // refresh user data
    } catch (error) {
      console.error('Failed to save bank info', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin ngân hàng.');
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.bankName || !user?.bankAccount || !user?.bankOwner) {
      return alert('Vui lòng cập nhật đầy đủ thông tin ngân hàng trước khi tạo lệnh rút tiền.');
    }
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return alert('Vui lòng nhập số tiền hợp lệ');
    if (amount > balance) return alert('Số dư không đủ');

    try {
      setIsSubmitting(true);
      await api.post('/financial/withdraw', { amount });
      alert('Yêu cầu rút tiền đã được gửi. Vui lòng chờ Admin phê duyệt.');
      setWithdrawAmount('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <DashboardLayout role="instructor" title="Quản lý Rút tiền">
      <div className="space-y-10">
        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Doanh thu tuần" 
            value={formatCurrency(stats.weekly)} 
            icon={<TrendingUp className="text-[#baff02]" size={24} />} 
          />
          <StatCard 
            title="Doanh thu tháng" 
            value={formatCurrency(stats.monthly)} 
            icon={<TrendingUp className="text-[#baff02]" size={24} />} 
          />
          <StatCard 
            title="Doanh thu năm" 
            value={formatCurrency(stats.yearly)} 
            icon={<TrendingUp className="text-[#baff02]" size={24} />} 
          />
          <StatCard 
            title="Số dư hiện tại" 
            value={formatCurrency(balance)} 
            icon={<Wallet className="text-[#baff02]" size={24} />} 
            highlight
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Bank Info Form */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                  <Building size={24} />
                </div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">Tài khoản Ngân hàng</h2>
              </div>

              <form onSubmit={handleSaveBank} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-2 block">Tên Ngân hàng</label>
                  <input 
                    type="text"
                    value={bankInfo.bankName}
                    onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                    placeholder="VD: Vietcombank"
                    className="w-full px-6 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-black font-bold focus:ring-2 focus:ring-[#baff02]/50 transition-all outline-none text-sm placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-2 block">Số Tài khoản</label>
                  <input 
                    type="text"
                    value={bankInfo.bankAccount}
                    onChange={(e) => setBankInfo({...bankInfo, bankAccount: e.target.value})}
                    placeholder="VD: 0123456789"
                    className="w-full px-6 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-black font-bold focus:ring-2 focus:ring-[#baff02]/50 transition-all outline-none text-sm placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-2 block">Tên Chủ Tài khoản</label>
                  <input 
                    type="text"
                    value={bankInfo.bankOwner}
                    onChange={(e) => setBankInfo({...bankInfo, bankOwner: e.target.value})}
                    placeholder="VD: NGUYEN VAN A"
                    className="w-full px-6 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-black font-bold focus:ring-2 focus:ring-[#baff02]/50 transition-all outline-none text-sm uppercase placeholder:text-gray-400 placeholder:normal-case"
                    required
                  />
                </div>

                <button 
                  disabled={isSavingBank || isLoading}
                  className="w-full py-4 mt-2 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSavingBank ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  <span>Lưu Thông Tin</span>
                </button>
              </form>
            </div>

            {/* Withdrawal Form */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-[#baff02]/20 rounded-2xl text-[#8ec401]">
                  <ArrowUpRight size={24} />
                </div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">Yêu cầu Rút tiền</h2>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-2 block">Số tiền muốn rút (VNĐ)</label>
                  <input 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="VD: 500000"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-black font-bold focus:ring-2 focus:ring-[#baff02]/50 transition-all outline-none placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Số dư khả dụng:</span>
                    <span className="text-black">{formatCurrency(balance)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Phí giao dịch:</span>
                    <span className="text-black">0đ</span>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting || isLoading || !user?.bankName}
                  className="w-full py-4 bg-[#baff02] text-[#0a0a0a] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 shadow-lg shadow-[#baff02]/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  <span>Gửi yêu cầu rút tiền</span>
                </button>

                <p className="text-[10px] text-gray-400 font-medium text-center italic">
                  * Yêu cầu sẽ được Admin phê duyệt trong vòng 24h làm việc.
                </p>
              </form>
            </div>
          </div>

          {/* History Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm h-full">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <History className="text-[#8ec401]" size={24} />
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">Lịch sử giao dịch</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ngày yêu cầu</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Số tiền</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <Loader2 className="animate-spin text-[#baff02] mx-auto mb-3" size={32} />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang tải lịch sử...</p>
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <AlertCircle className="text-gray-300 mx-auto mb-3" size={40} />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chưa có giao dịch rút tiền nào</p>
                        </td>
                      </tr>
                    ) : history.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 text-center font-mono text-[10px] text-gray-400">
                          {tx.id.split('-')[0].toUpperCase()}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-black">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</p>
                          <p className="text-[10px] font-medium text-gray-500">{new Date(tx.createdAt).toLocaleTimeString('vi-VN')}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-black">
                          {formatCurrency(Number(tx.amount))}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <StatusBadge status={tx.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Details Table */}
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-[#8ec401]" size={24} />
              <h2 className="text-xl font-black text-black uppercase tracking-tight">Chi tiết doanh thu</h2>
            </div>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-black font-bold text-sm rounded-xl focus:ring-[#baff02] focus:border-[#baff02] block p-3 outline-none"
            >
              {Array.from(new Set(revenueList.map(r => new Date(r.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })))).map(m => (
                <option key={m as string} value={m as string}>Tháng {m as string}</option>
              ))}
              {revenueList.length === 0 && <option value="">Chưa có dữ liệu</option>}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Thời gian</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Học viên</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Giá khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Thực nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="animate-spin text-[#baff02] mx-auto mb-3" size={32} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang tải...</p>
                    </td>
                  </tr>
                ) : revenueList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <AlertCircle className="text-gray-300 mx-auto mb-3" size={40} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chưa có giao dịch nào</p>
                    </td>
                  </tr>
                ) : revenueList.filter(r => new Date(r.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) === selectedMonth).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-black">{new Date(r.date).toLocaleDateString('vi-VN')}</p>
                      <p className="text-[10px] font-medium text-gray-500">{new Date(r.date).toLocaleTimeString('vi-VN')}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-black">{r.studentName}</p>
                      <p className="text-[10px] font-medium text-gray-500">{r.studentEmail}</p>
                    </td>
                    <td className="px-8 py-6 text-sm text-black font-medium">{r.courseName}</td>
                    <td className="px-8 py-6 text-sm text-gray-500 text-right">{formatCurrency(r.coursePrice)}</td>
                    <td className="px-8 py-6 text-sm text-[#8ec401] font-black text-right">+{formatCurrency(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
              {revenueList.length > 0 && (
                <tfoot className="bg-gray-50 border-t border-gray-100">
                  <tr>
                    <td colSpan={4} className="px-8 py-6 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Tổng doanh thu tháng {selectedMonth}:</td>
                    <td className="px-8 py-6 text-right text-xl font-black text-[#8ec401]">
                      {formatCurrency(revenueList.filter(r => new Date(r.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) === selectedMonth).reduce((sum, r) => sum + r.revenue, 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, highlight = false }: any) {
  return (
    <div className={cn(
      "p-8 rounded-[32px] border transition-all shadow-sm",
      highlight 
        ? "bg-[#baff02] border-[#baff02] shadow-xl shadow-[#baff02]/20" 
        : "bg-white border-gray-100 hover:border-gray-200"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-3 rounded-2xl",
          highlight ? "bg-[#0a0a0a]/10 text-[#0a0a0a]" : "bg-gray-50"
        )}>
          {icon}
        </div>
      </div>
      <p className={cn(
        "text-[10px] font-black uppercase tracking-widest mb-1",
        highlight ? "text-[#0a0a0a]/60" : "text-gray-400"
      )}>
        {title}
      </p>
      <h3 className={cn(
        "text-2xl font-black tracking-tight",
        highlight ? "text-[#0a0a0a]" : "text-black"
      )}>
        {value}
      </h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    PENDING: { 
      label: 'Chờ duyệt', 
      classes: 'bg-amber-50 text-amber-600 border-amber-200',
      icon: <Clock size={12} />
    },
    COMPLETED: { 
      label: 'Thành công', 
      classes: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: <CheckCircle size={12} />
    },
    FAILED: { 
      label: 'Từ chối', 
      classes: 'bg-rose-50 text-rose-600 border-rose-200',
      icon: <AlertCircle size={12} />
    }
  };

  const config = configs[status as keyof typeof configs] || configs.PENDING;

  return (
    <span className={cn(
      "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
      config.classes
    )}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
