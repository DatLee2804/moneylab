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
  Loader2
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
  const [stats, setStats] = React.useState<RevenueStats>({ weekly: 0, monthly: 0, yearly: 0 });
  const [balance, setBalance] = React.useState(0);
  const [history, setHistory] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState('');
  const [revenueList, setRevenueList] = React.useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');

  React.useEffect(() => {
    if (revenueList.length > 0 && !selectedMonth) {
      const months = Array.from(new Set(revenueList.map(r => new Date(r.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }))));
      setSelectedMonth(months[0] as string);
    }
  }, [revenueList]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, balanceRes, historyRes, revenueRes] = await Promise.all([
        api.get('/financial/instructor/stats'),
        api.get('/financial/balance'),
        api.get('/financial/my-transactions'),
        api.get('/financial/instructor/revenue-details')
      ]);
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

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
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
          {/* Withdrawal Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#141414] rounded-[40px] border border-white/5 p-8 sticky top-32">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-[#baff02]/10 rounded-2xl text-[#baff02]">
                  <ArrowUpRight size={24} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Yêu cầu Rút tiền</h2>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-2 block">Số tiền muốn rút (VNĐ)</label>
                  <input 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="VD: 500000"
                    className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white font-bold focus:ring-2 focus:ring-[#baff02]/10 transition-all outline-none"
                    required
                  />
                </div>

                <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Số dư khả dụng:</span>
                    <span className="text-white">{formatCurrency(balance)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Phí giao dịch:</span>
                    <span className="text-white">0đ</span>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting || isLoading}
                  className="w-full py-4 bg-[#baff02] text-[#0a0a0a] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-[#baff02]/10"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  <span>Gửi yêu cầu rút tiền</span>
                </button>

                <p className="text-[10px] text-gray-500 font-medium text-center italic">
                  * Yêu cầu sẽ được Admin phê duyệt trong vòng 24h làm việc.
                </p>
              </form>
            </div>
          </div>

          {/* History Table */}
          <div className="lg:col-span-2">
            <div className="bg-[#141414] rounded-[40px] border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <History className="text-[#baff02]" size={24} />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Lịch sử giao dịch</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#0a0a0a]/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày yêu cầu</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Số tiền</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <Loader2 className="animate-spin text-[#baff02] mx-auto mb-3" size={32} />
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Đang tải lịch sử...</p>
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <AlertCircle className="text-gray-700 mx-auto mb-3" size={40} />
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Chưa có giao dịch rút tiền nào</p>
                        </td>
                      </tr>
                    ) : history.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6 text-center font-mono text-[10px] text-gray-500">
                          {tx.id.split('-')[0].toUpperCase()}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-white">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</p>
                          <p className="text-[10px] font-medium text-gray-500">{new Date(tx.createdAt).toLocaleTimeString('vi-VN')}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-white">
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
        <div className="bg-[#141414] rounded-[40px] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-[#baff02]" size={24} />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Chi tiết doanh thu</h2>
            </div>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 text-white font-bold text-sm rounded-xl focus:ring-[#baff02] focus:border-[#baff02] block p-3 outline-none"
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
                <tr className="bg-[#0a0a0a]/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Học viên</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Giá khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thực nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="animate-spin text-[#baff02] mx-auto mb-3" size={32} />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Đang tải...</p>
                    </td>
                  </tr>
                ) : revenueList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <AlertCircle className="text-gray-700 mx-auto mb-3" size={40} />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Chưa có giao dịch nào</p>
                    </td>
                  </tr>
                ) : revenueList.filter(r => new Date(r.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) === selectedMonth).map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-white">{new Date(r.date).toLocaleDateString('vi-VN')}</p>
                      <p className="text-[10px] font-medium text-gray-500">{new Date(r.date).toLocaleTimeString('vi-VN')}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-white">{r.studentName}</p>
                      <p className="text-[10px] font-medium text-gray-500">{r.studentEmail}</p>
                    </td>
                    <td className="px-8 py-6 text-sm text-white font-medium">{r.courseName}</td>
                    <td className="px-8 py-6 text-sm text-gray-400 text-right">{formatCurrency(r.coursePrice)}</td>
                    <td className="px-8 py-6 text-sm text-[#baff02] font-black text-right">+{formatCurrency(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
              {revenueList.length > 0 && (
                <tfoot className="bg-[#0a0a0a]/50 border-t border-white/5">
                  <tr>
                    <td colSpan={4} className="px-8 py-6 text-right text-xs font-black text-white uppercase tracking-widest">Tổng doanh thu tháng {selectedMonth}:</td>
                    <td className="px-8 py-6 text-right text-xl font-black text-[#baff02]">
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
      "p-8 rounded-[32px] border transition-all",
      highlight 
        ? "bg-[#baff02] border-[#baff02] shadow-xl shadow-[#baff02]/10" 
        : "bg-[#141414] border-white/5 hover:border-white/10"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-3 rounded-2xl",
          highlight ? "bg-[#0a0a0a]/10 text-[#0a0a0a]" : "bg-[#baff02]/10"
        )}>
          {icon}
        </div>
      </div>
      <p className={cn(
        "text-[10px] font-black uppercase tracking-widest mb-1",
        highlight ? "text-[#0a0a0a]/60" : "text-gray-500"
      )}>
        {title}
      </p>
      <h3 className={cn(
        "text-2xl font-black tracking-tight",
        highlight ? "text-[#0a0a0a]" : "text-white"
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
      classes: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      icon: <Clock size={12} />
    },
    COMPLETED: { 
      label: 'Thành công', 
      classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      icon: <CheckCircle size={12} />
    },
    FAILED: { 
      label: 'Từ chối', 
      classes: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
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
