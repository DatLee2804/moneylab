'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Check, 
  X,
  History,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';

import api from '@/lib/api';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
    payout: any;
  }>({
    isOpen: false,
    type: null,
    payout: null
  });

  const fetchPayouts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/financial/payout-requests');
      setPayouts(response.data);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayouts();
  }, []);

  const handleAction = async () => {
    if (!confirmModal.payout || !confirmModal.type) return;
    
    try {
      if (confirmModal.type === 'approve') {
        await api.patch(`/financial/payouts/${confirmModal.payout.id}/approve`);
      } else {
        await api.patch(`/financial/transactions/${confirmModal.payout.id}/reject`);
      }
      
      alert(confirmModal.type === 'approve' ? 'Đã duyệt thanh toán thành công' : 'Đã từ chối thanh toán');
      fetchPayouts();
    } catch (error) {
      console.error('Action failed:', error);
      alert('Thao tác thất bại, vui lòng thử lại');
    } finally {
      setConfirmModal({ isOpen: false, type: null, payout: null });
    }
  };

  return (
    <DashboardLayout role="admin" title="Yêu cầu rút tiền">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div>
               <h3 className="text-xl font-black text-black flex items-center justify-center sm:justify-start space-x-2 uppercase tracking-tight">
                  <CreditCard size={24} className="text-[#8ec401]" />
                  <span>Danh sách yêu cầu rút tiền</span>
               </h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Phê duyệt hoặc từ chối các giao dịch tài chính</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-100 transition-colors font-sans">Tất cả</button>
              <button className="px-6 py-2.5 bg-[#baff02]/20 text-[#8ec401] rounded-xl text-[10px] font-black uppercase tracking-widest font-sans">Chờ duyệt</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Người dùng</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Số tiền</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Thông tin ngân hàng</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ngày yêu cầu</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Đang tải dữ liệu tài chính...</td>
                  </tr>
                ) : payouts.map((p) => (
                  <tr key={p.id} className="transition-all hover:bg-gray-50">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-gray-600 shadow-sm">{p.user?.name?.charAt(0) || 'U'}</div>
                        <div>
                          <p className="text-sm font-black text-black">{p.user?.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold">{p.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-[#8ec401] tracking-tight">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(p.amount))}
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs font-black text-black">{p.user?.bankName || 'Chưa cập nhật'}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                          STK: {p.user?.bankAccount || 'N/A'} - {p.user?.bankOwner}
                       </p>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-gray-500 font-black uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center space-x-1.5",
                        p.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : 
                        p.status === 'FAILED' ? "bg-rose-50 text-rose-600 border border-rose-200" :
                        "bg-amber-50 text-amber-600 border border-amber-200"
                      )}>
                        <div className={cn("w-1 h-1 rounded-full", 
                          p.status === 'COMPLETED' ? "bg-emerald-500" : 
                          p.status === 'FAILED' ? "bg-rose-500" : "bg-amber-500"
                        )} />
                        <span>{p.status === 'COMPLETED' ? 'Thành công' : p.status === 'FAILED' ? 'Đã từ chối' : 'Chờ duyệt'}</span>
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {p.status === 'PENDING' && (
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => setConfirmModal({ isOpen: true, type: 'approve', payout: p })}
                            className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm" 
                            title="Chấp nhận thanh toán"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => setConfirmModal({ isOpen: true, type: 'reject', payout: p })}
                            className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm" 
                            title="Từ chối thanh toán"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {confirmModal.isOpen && confirmModal.payout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal({ isOpen: false, type: null, payout: null })} className="absolute inset-0 bg-[#0f172a]/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }} className="relative bg-white rounded-[40px] p-10 shadow-2xl max-w-md w-full text-center border border-gray-100">
              <div className={cn(
                "w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-sm border",
                confirmModal.type === 'approve' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
              )}>
                {confirmModal.type === 'approve' ? <Check size={40} /> : <X size={40} />}
              </div>
              <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">
                {confirmModal.type === 'approve' ? 'Duyệt thanh toán?' : 'Từ chối thanh toán?'}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed italic">
                Bạn có chắc chắn muốn {confirmModal.type === 'approve' ? 'duyệt' : 'từ chối'} số tiền <span className="font-black text-[#8ec401]">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(confirmModal.payout.amount))}</span> cho người dùng <span className="font-black text-black">{confirmModal.payout.user?.name}</span> không?
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmModal({ isOpen: false, type: null, payout: null })}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 hover:text-gray-700 transition-all font-sans"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleAction}
                  className={cn(
                    "flex-[2] py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition-all px-8",
                    confirmModal.type === 'approve' ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600" : "bg-rose-500 shadow-rose-500/20 hover:bg-rose-600"
                  )}
                >
                  Xác nhận {confirmModal.type === 'approve' ? 'Duyệt' : 'Từ chối'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
