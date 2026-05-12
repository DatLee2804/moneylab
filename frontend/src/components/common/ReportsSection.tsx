'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  Calendar, 
  User, 
  Mail, 
  Image as ImageIcon, 
  Send, 
  CheckCircle,
  Clock,
  ShieldAlert,
  FileText,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

interface Report {
  id: string;
  reason: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  reporter?: {
    name: string;
    email: string;
  };
  reportedEmail?: string;
  reportedUser?: {
    name: string;
    email: string;
  };
}

export const ReportsSection = ({ role }: { role: string }) => {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);
  const [isHandleModalOpen, setIsHandleModalOpen] = React.useState(false);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const endpoint = (role === 'admin' || role === 'manager') 
        ? '/reports' 
        : '/reports/my-reports';
      const response = await api.get(endpoint);
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  const [formData, setFormData] = React.useState({
    reportedUser: '',
    reportedEmail: '',
    reason: '',
    evidence: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/reports', {
        reportedEmail: formData.reportedEmail,
        reason: formData.reason,
      });
      setReports([response.data, ...reports]);
      setIsModalOpen(false);
      setFormData({ reportedUser: '', reportedEmail: '', reason: '', evidence: null });
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Không thể gửi báo cáo. Vui lòng thử lại sau.');
    }
  };

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      setIsProcessing(true);
      await api.patch(`/reports/${reportId}/resolve`, { status });
      await fetchReports();
      setIsHandleModalOpen(false);
      alert('Đã cập nhật trạng thái báo cáo');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNotifyAndResolve = async (reportId: string) => {
    if (!replyMessage.trim()) return alert('Vui lòng nhập nội dung cảnh báo');
    try {
      setIsProcessing(true);
      // Gửi email thông báo
      await api.post(`/reports/${reportId}/notify`, { message: replyMessage });
      // Cập nhật trạng thái thành RESOLVED
      await api.patch(`/reports/${reportId}/resolve`, { status: 'RESOLVED' });
      await fetchReports();
      setIsHandleModalOpen(false);
      setReplyMessage('');
      alert('Đã gửi cảnh báo và hoàn tất xử lý');
    } catch (error) {
      console.error('Failed to notify and resolve:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEscalate = async (reportId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn chuyển tiếp báo cáo này cho Admin xử lý?')) return;
    try {
      setIsProcessing(true);
      await api.patch(`/reports/${reportId}/escalate`);
      await fetchReports();
      setIsHandleModalOpen(false);
      alert('Đã chuyển tiếp cho Admin');
    } catch (error) {
      console.error('Failed to escalate:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center space-x-3">
            <ShieldAlert className="text-[#baff02]" size={28} />
            <span>Báo cáo Người dùng</span>
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Tố cáo hành vi không phù hợp của người dùng khác</p>
        </div>
        {(role === 'student' || role === 'instructor') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-[#baff02] text-[#0a0a0a] rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#baff02]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            <span>Tạo báo cáo mới</span>
          </button>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-[#141414] rounded-[40px] border border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a]/50">
                {(role === 'admin' || role === 'manager') && (
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người báo cáo</th>
                )}
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người bị báo cáo</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày tạo</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lý do báo cáo</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                {(role === 'admin' || role === 'manager') && (
                   <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center space-y-3 px-8">
                       <Loader2 className="w-8 h-8 text-[#baff02] animate-spin" />
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang tải báo cáo...</p>
                    </div>
                  </td>
                </tr>
              ) : reports.map((report) => (
                <tr key={report.id} className="group hover:bg-[#0a0a0a]/40 transition-colors">
                  {(role === 'admin' || role === 'manager') && (
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-black text-white uppercase tracking-tight flex items-center">
                            {report.reporter?.name || 'Người dùng'}
                            {report.reason.includes('[ESCALATED]') && (
                              <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white text-[8px] rounded font-black animate-pulse">ESCALATED</span>
                            )}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase truncate max-w-[150px]">{report.reporter?.email}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-black text-white uppercase tracking-tight">{report.reportedUser?.name || 'Người dùng'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase truncate max-w-[150px]">
                          {report.reportedUser?.email || report.reportedEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-bold font-sans">
                    {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-400 font-medium line-clamp-1 max-w-[200px] italic">"{report.reason}"</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center space-x-2 border shadow-sm",
                      report.status === 'RESOLVED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                      report.status === 'DISMISSED' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                      report.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {report.status === 'RESOLVED' ? <CheckCircle size={12} /> : report.status === 'DISMISSED' ? <X size={12} /> : <Clock size={12} />}
                      <span>{report.status === 'RESOLVED' ? 'Đã xử lý' : report.status === 'DISMISSED' ? 'Từ chối' : report.status === 'IN_PROGRESS' ? 'Đang xử lý' : 'Mới'}</span>
                    </span>
                  </td>
                  {(role === 'admin' || role === 'manager') && (
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => {
                           setSelectedReport(report);
                           setIsHandleModalOpen(true);
                         }}
                         className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#baff02] hover:text-[#0a0a0a] transition-all"
                       >
                         Xử lý
                       </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <FileText className="mx-auto text-gray-200" size={60} />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Chưa có báo cáo nào được tạo</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply & Handing Modal */}
      <AnimatePresence>
        {isHandleModalOpen && selectedReport && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsHandleModalOpen(false)} className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-[40px] shadow-2xl max-w-2xl w-full border border-gray-100 overflow-hidden">
               {/* Modal Header */}
               <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><ShieldAlert size={24} /></div>
                   <div>
                     <h3 className="text-xl font-black uppercase tracking-tight text-black">Xử lý báo cáo vi phạm</h3>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">ID: {selectedReport.id}</p>
                   </div>
                 </div>
                 <button onClick={() => setIsHandleModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
               </div>

               {/* Modal Content */}
               <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
                 {/* Report Context */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-rose-50 rounded-lg text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">
                        REPORT / USER VIOLATION
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase">
                        <Calendar size={12} />
                        <span>{new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                   </div>
                   <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Lý do báo cáo:</p>
                      <p className="text-sm text-gray-700 leading-relaxed font-bold italic">"{selectedReport.reason}"</p>
                   </div>
                 </div>

                 {/* People Info */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Người báo cáo</p>
                      <p className="text-sm font-black text-black">{selectedReport.reporter?.name}</p>
                      <p className="text-[10px] font-bold text-gray-500 truncate">{selectedReport.reporter?.email}</p>
                    </div>
                    <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Người bị báo cáo</p>
                      <p className="text-sm font-black text-black">{selectedReport.reportedUser?.name}</p>
                      <p className="text-[10px] font-bold text-gray-500 truncate">{selectedReport.reportedUser?.email || selectedReport.reportedEmail}</p>
                    </div>
                 </div>

                 {/* Resolution Section */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nội dung cảnh báo (Gửi email)</label>
                    <textarea 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Nhập nội dung cảnh báo vi phạm sẽ gửi đến email người bị tố cáo..."
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-[#baff02]/20 focus:border-[#baff02] outline-none transition-all resize-none text-black h-32 placeholder:text-gray-400"
                    ></textarea>
                 </div>

                 {/* Action Buttons */}
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleUpdateStatus(selectedReport.id, 'IN_PROGRESS')}
                      disabled={isProcessing}
                      className="py-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                    >
                      Bắt đầu xử lý
                    </button>
                    <button 
                      onClick={() => handleNotifyAndResolve(selectedReport.id)}
                      disabled={isProcessing || !replyMessage.trim()}
                      className="py-4 bg-[#baff02] text-[#0a0a0a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#baff02]/20 hover:bg-[#8ec401] transition-all"
                    >
                      Gửi cảnh báo & Đóng
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                      disabled={isProcessing}
                      className="py-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      Xác nhận: Không có lỗi
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedReport.id, 'DISMISSED')}
                      disabled={isProcessing}
                      className="py-4 bg-gray-100 text-gray-600 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Từ chối báo cáo
                    </button>
                    {role === 'manager' && (
                      <button 
                        onClick={() => handleEscalate(selectedReport.id)}
                        disabled={isProcessing}
                        className="col-span-2 py-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center space-x-2"
                      >
                         <AlertTriangle size={14} />
                        <span>Chuyển tiếp cho Admin hệ thống</span>
                      </button>
                    )}
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[40px] overflow-hidden shadow-2xl max-w-xl w-full border border-gray-100"
            >
              <div className="p-8 bg-[#baff02] text-[#0a0a0a] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldAlert size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight">Tố cáo Người dùng</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#0a0a0a]/10 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white">
                 {/* Target User Info */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Tên người bị báo cáo</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            required
                            type="text" 
                            value={formData.reportedUser}
                            onChange={(e) => setFormData({...formData, reportedUser: e.target.value})}
                            className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#baff02]/50 transition-all text-black placeholder:text-gray-400 outline-none"
                            placeholder="Nhập tên..."
                          />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Địa chỉ Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            required
                            type="email" 
                            value={formData.reportedEmail}
                            onChange={(e) => setFormData({...formData, reportedEmail: e.target.value})}
                            className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#baff02]/50 transition-all text-black placeholder:text-gray-400 outline-none"
                            placeholder="example@gmail.com"
                          />
                        </div>
                    </div>
                 </div>

                 {/* Reason and Evidence */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1 flex flex-col h-full">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Ngày báo cáo</label>
                       <div className="px-6 py-3.5 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 flex items-center space-x-2 border border-dashed border-gray-200">
                          <Calendar size={14} />
                          <span>{new Date().toLocaleDateString('vi-VN')}</span>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Minh chứng (Ảnh)</label>
                       <div className="relative group">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, evidence: e.target.files?.[0] || null})}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={cn(
                            "px-6 py-3.5 bg-gray-50 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all border-2 border-dashed",
                            formData.evidence ? "border-[#baff02] text-[#baff02]" : "border-gray-200 text-gray-500 group-hover:border-[#baff02]/50"
                          )}>
                             <ImageIcon size={14} />
                             <span className="truncate">{formData.evidence ? formData.evidence.name : "Chọn tệp tin..."}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Chi tiết lý do báo cáo</label>
                    <textarea 
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={5}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-200 rounded-3xl text-sm font-medium focus:ring-2 focus:ring-[#baff02]/50 transition-all resize-none italic text-black placeholder:text-gray-400 outline-none"
                      placeholder="Mô tả cụ thể hành vi vi phạm..."
                    />
                 </div>

                 <button 
                  type="submit"
                  className="w-full py-5 bg-[#baff02] text-[#0a0a0a] rounded-[32px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#baff02]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                 >
                   <Send size={18} />
                   <span>Gửi yêu cầu tố cáo</span>
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
