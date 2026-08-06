'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  CreditCard,
  Loader2,
  AlertCircle 
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import api from '@/lib/api';

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/financial/my-transactions');
        // Filter for payment type if needed, or show all relevant
        const paymentTrans = response.data.filter((t: any) => t.type === 'PAYMENT');
        setPayments(paymentTrans);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="student" title="Lịch sử thanh toán">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#1C221F] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải lịch sử giao dịch...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="Lịch sử thanh toán">
      <div className="max-w-7xl mx-auto space-y-8 uppercase">
        <div className="bg-white rounded-[40px] border border-[#E8E3D9] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#E8E3D9]">
            <h3 className="text-xl font-black text-[#1C221F] flex items-center space-x-3 uppercase tracking-tight">
              <History size={24} className="text-[#1C221F]" />
              <span>Giao dịch của bạn</span>
            </h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Theo dõi các đơn hàng và trạng thái thanh toán</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Mã giao dịch</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ngày</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nội dung</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Số tiền</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3D9]">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-500 font-black uppercase tracking-widest text-[10px]">Bạn chưa có giao dịch thanh toán nào</td>
                  </tr>
                ) : payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-[10px] font-bold text-gray-500 font-sans tracking-tighter uppercase">{p.id}</td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium font-sans">
                      {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-8 py-6 text-sm text-[#1C221F] font-bold">{p.description || 'Thanh toán khóa học'}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#1C221F]">{Number(p.amount).toLocaleString()}đ</td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 bg-[#133E2B]/10 text-[#1C221F] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#133E2B]/20">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

