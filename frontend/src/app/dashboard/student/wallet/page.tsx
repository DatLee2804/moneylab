'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  CreditCard, 
  ChevronRight, 
  AlertCircle,
  Banknote,
  Loader2,
  History,
  ArrowDownLeft,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { cn } from '@/utils/utils';

export default function StudentWalletPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userRes, transRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/financial/my-transactions')
        ]);
        setUser(userRes.data);
        setTransactions(transRes.data);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="student" title="Ví & Tài chính">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải dữ liệu tài chính...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="Ví & Tài chính">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Current Balance Card */}
            <div className="bg-[#baff02] p-10 rounded-[40px] text-[#0a0a0a] relative overflow-hidden shadow-2xl shadow-[#baff02]/20 font-sans">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10">
                <p className="text-xs font-black text-[#0a0a0a]/60 uppercase tracking-widest mb-4">Số dư khả dụng</p>
                <h3 className="text-5xl font-black mb-10">{Number(user?.balance || 0).toLocaleString('vi-VN')}đ</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-[#0a0a0a] text-white font-black rounded-2xl hover:bg-gray-900 transition-all shadow-xl flex items-center justify-center space-x-2">
                    <Banknote size={20} />
                    <span>Rút tiền ngay</span>
                  </button>
                  <button className="px-8 py-4 bg-transparent border-2 border-[#0a0a0a]/20 text-[#0a0a0a] font-black rounded-2xl hover:bg-white/10 transition-all">
                    Lịch sử rút tiền
                  </button>
                </div>
              </div>
            </div>

            {/* Bank Info Settings */}
            <div className="bg-[#141414] p-10 rounded-[40px] border border-white/5 shadow-sm">
              <h3 className="text-xl font-black text-white mb-8">Thông tin tài khoản ngân hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Ngân hàng</label>
                  <input type="text" readOnly value={user?.bankName || 'Chưa cập nhật'} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Số tài khoản</label>
                  <input type="text" readOnly value={user?.bankAccount || 'Chưa cập nhật'} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Chủ tài khoản</label>
                  <input type="text" readOnly value={user?.bankOwner || 'Chưa cập nhật'} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Chi nhánh</label>
                  <input type="text" readOnly value={user?.bankBranch || 'Chưa cập nhật'} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold text-white outline-none" />
                </div>
              </div>
              <button className="mt-10 px-10 py-4 bg-white/5 text-gray-400 font-black rounded-2xl hover:bg-white/10 transition-all border border-white/5 text-xs uppercase tracking-widest">
                Thay đổi thông tin trong Cài đặt
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Recent Transactions List */}
            <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Giao dịch gần đây</h4>
                <History size={18} className="text-gray-500" />
              </div>
              <div className="space-y-6">
                {transactions.length === 0 ? (
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center py-10">Chưa có giao dịch</p>
                ) : transactions.slice(0, 5).map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        tx.type === 'COMMISSION' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      )}>
                        {tx.type === 'COMMISSION' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{tx.description || tx.type}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-xs font-black",
                        tx.type === 'COMMISSION' ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {tx.type === 'COMMISSION' ? '+' : '-'}{Number(tx.amount).toLocaleString()}đ
                      </p>
                      <span className="text-[8px] font-black uppercase text-gray-600">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-10 w-full py-4 bg-white/5 border border-white/5 text-gray-500 font-black rounded-2xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest">
                 Xem tất cả giao dịch
              </button>
            </div>

            {/* Tip Card */}
            <div className="bg-amber-500/5 p-8 rounded-[40px] border border-amber-500/20 shadow-xl shadow-amber-500/5">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 animate-pulse">
                <AlertCircle size={24} />
              </div>
              <h4 className="text-lg font-black text-amber-500 mb-4">Mẹo kiếm tiền</h4>
              <p className="text-sm text-amber-500/80 leading-relaxed font-medium">
                Sử dụng mã giới thiệu duy nhất của bạn để mời bạn bè tham gia học tập và nhận ngay hoa hồng Affiliate lên đến 30%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

