'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Plus, 
  X, 
  Calendar, 
  Image as ImageIcon, 
  Send, 
  CheckCircle,
  Clock,
  LifeBuoy,
  Monitor,
  Loader2,
  User
} from 'lucide-react';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

interface SupportTicket {
  id: string;
  subject: string;
  content: string;
  type: 'TECHNICAL' | 'BILLING' | 'GENERAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  evidence?: string;
  sender?: {
    name: string;
    email: string;
  };
}

export const SupportSection = ({ role }: { role: string }) => {
  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const endpoint = (role === 'admin' || role === 'manager') 
        ? '/support' 
        : '/support/my-tickets';
      const response = await api.get(endpoint);
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchTickets();
  }, []);

  const [formData, setFormData] = React.useState({
    subject: '',
    reason: '',
    evidence: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/support', {
        subject: formData.subject,
        content: formData.reason,
        type: 'GENERAL',
      });
      setTickets([response.data, ...tickets]);
      setIsModalOpen(false);
      setFormData({ subject: '', reason: '', evidence: null });
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      alert('Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại sau.');
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
     try {
       setIsProcessing(true);
       await api.patch(`/support/${ticketId}/status`, { 
         status,
         response: replyMessage 
       });
       await fetchTickets();
       setReplyMessage('');
       setIsReplyModalOpen(false);
       alert('Đã cập nhật trạng thái yêu cầu');
     } catch (error) {
       console.error('Failed to update status:', error);
     } finally {
       setIsProcessing(false);
     }
  };

  const handleEscalate = async (ticketId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn chuyển tiếp vấn đề này cho Admin xử lý?')) return;
    try {
      setIsProcessing(true);
      await api.patch(`/support/${ticketId}/escalate`);
      await fetchTickets();
      setIsReplyModalOpen(false);
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
            <LifeBuoy className="text-[#baff02]" size={28} />
            <span>Hỗ trợ Kỹ thuật</span>
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Báo cáo lỗi hệ thống hoặc yêu cầu trợ giúp kỹ thuật</p>
        </div>
        {(role === 'student' || role === 'instructor') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-[#baff02] text-[#0a0a0a] rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#baff02]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            <span>Tạo yêu cầu mới</span>
          </button>
        )}
      </div>

      {/* Tickets Table */}
      <div className="bg-[#141414] rounded-[40px] border border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a]/50">
                {(role === 'admin' || role === 'manager') && (
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người yêu cầu</th>
                )}
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại yêu cầu</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vấn đề</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày tạo</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Bằng chứng</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                {(role === 'admin' || role === 'manager') && (
                   <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center space-y-3 px-8">
                       <Loader2 className="w-8 h-8 text-[#baff02] animate-spin" />
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang tải lịch sử hỗ trợ...</p>
                    </div>
                  </td>
                </tr>
              ) : tickets.map((ticket) => (
                <tr key={ticket.id} className="group hover:bg-[#0a0a0a]/40 transition-colors">
                  {(role === 'admin' || role === 'manager') && (
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#baff02]/10 text-[#baff02] flex items-center justify-center">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-black text-white uppercase tracking-tight flex items-center">
                            {ticket.sender?.name || 'Người dùng'}
                            {ticket.subject.includes('[ESCALATED]') && (
                              <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white text-[8px] rounded font-black animate-pulse">ESCALATED</span>
                            )}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase truncate max-w-[150px]">{ticket.sender?.email}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      ticket.subject.includes('[ESCALATED]') ? "text-rose-500 border-rose-500/20 bg-rose-500/5" : "text-[#baff02]"
                    )}>
                      {ticket.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-400 font-medium line-clamp-1 max-w-[250px] italic">"{ticket.content}"</p>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-bold font-sans">
                    {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-8 py-6">
                    {ticket.evidence ? (
                      <div className="flex items-center space-x-2 text-[#baff02] cursor-pointer hover:underline font-bold text-xs uppercase tracking-widest">
                        <ImageIcon size={16} />
                        <span>Xem lỗi</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Không có</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center space-x-2 shadow-sm border",
                      ticket.status === 'CLOSED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                      ticket.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {ticket.status === 'CLOSED' ? <CheckCircle size={12} /> : ticket.status === 'IN_PROGRESS' ? <Clock size={12} /> : <AlertTriangle size={12} />}
                      <span>{ticket.status === 'CLOSED' ? 'Đã xử lý' : ticket.status === 'IN_PROGRESS' ? 'Đang xử lý' : 'Mới'}</span>
                    </span>
                  </td>
                  {(role === 'admin' || role === 'manager') && (
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => {
                           setSelectedTicket(ticket);
                           setIsReplyModalOpen(true);
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
        </div>
      </div>

      {/* Create Ticket Modal */}
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
              className="relative bg-[#141414] rounded-[40px] overflow-hidden shadow-2xl max-w-xl w-full border border-white/10"
            >
              <div className="p-8 bg-[#0a0a0a] text-white flex items-center justify-between border-b border-white/5">
                <div className="flex items-center space-x-3">
                  <Monitor size={24} className="text-[#baff02]" />
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#baff02]">Báo cáo Lỗi Hệ thống</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Vấn đề gặp phải</label>
                    <input 
                      required
                      type="text" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/10 transition-all text-white placeholder:text-gray-700"
                      placeholder="VD: Không xem được video, Lỗi nạp tiền..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1 flex flex-col h-full">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Ngày phát hiện</label>
                       <div className="px-6 py-4 bg-[#0a0a0a] rounded-2xl text-xs font-black text-gray-500 flex items-center space-x-2 border border-dashed border-white/10">
                          <Calendar size={14} />
                          <span>{new Date().toLocaleDateString('vi-VN')}</span>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Ảnh màn hình lỗi</label>
                       <div className="relative group">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, evidence: e.target.files?.[0] || null})}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={cn(
                            "px-6 py-4 bg-[#0a0a0a] rounded-2xl text-xs font-black flex items-center space-x-2 transition-all border-2 border-dashed",
                            formData.evidence ? "border-[#baff02] text-[#baff02]" : "border-white/5 text-gray-500 group-hover:border-[#baff02]/50"
                          )}>
                             <ImageIcon size={14} />
                             <span className="truncate">{formData.evidence ? formData.evidence.name : "Tải ảnh lên..."}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Mô tả chi tiết lỗi</label>
                    <textarea 
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={4}
                      className="w-full px-8 py-5 bg-[#0a0a0a] border border-white/5 rounded-3xl text-sm font-medium focus:ring-2 focus:ring-[#baff02]/10 transition-all resize-none text-white placeholder:text-gray-700"
                      placeholder="Hãy cho chúng tôi biết bạn đang gặp vấn đề gì..."
                    />
                  </div>

                  <button 
                   type="submit"
                   className="w-full py-5 bg-[#baff02] text-[#0a0a0a] rounded-[32px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#baff02]/20 hover:bg-[#8ec401] transition-all flex items-center justify-center space-x-2"
                  >
                   <Send size={18} />
                   <span>Gửi yêu cầu hỗ trợ</span>
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Reply & Handing Modal */}
      <AnimatePresence>
        {isReplyModalOpen && selectedTicket && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReplyModalOpen(false)} className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-[#141414] rounded-[40px] shadow-2xl max-w-2xl w-full border border-white/10 overflow-hidden">
               {/* Modal Header */}
               <div className="p-8 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="p-3 bg-[#baff02]/10 text-[#baff02] rounded-2xl"><Monitor size={24} /></div>
                   <div>
                     <h3 className="text-xl font-black uppercase tracking-tight text-white">Xử lý yêu cầu hỗ trợ</h3>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">ID: {selectedTicket.id}</p>
                   </div>
                 </div>
                 <button onClick={() => setIsReplyModalOpen(false)} className="p-2 text-gray-500 hover:text-rose-500 transition-colors"><X size={24} /></button>
               </div>

               {/* Modal Content */}
               <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                 {/* Ticket Context */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-[#baff02] uppercase tracking-[0.2em]">
                        {selectedTicket.type}
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase">
                        <Calendar size={12} />
                        <span>{new Date(selectedTicket.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                   </div>
                   <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-white/5">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Vấn đề & Nội dung:</p>
                      <h4 className="text-lg font-black text-[#baff02] mb-2">{selectedTicket.subject}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-medium italic">"{selectedTicket.content}"</p>
                   </div>
                 </div>

                 {/* Sender Details */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-[#0a0a0a] rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Người yêu cầu</p>
                      <p className="text-sm font-black text-white">{selectedTicket.sender?.name}</p>
                    </div>
                    <div className="p-5 bg-[#0a0a0a] rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</p>
                      <p className="text-sm font-bold text-gray-500 truncate">{selectedTicket.sender?.email}</p>
                    </div>
                 </div>

                 {/* Resolution Section */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Phản hồi / Ghi chú xử lý</label>
                    <textarea 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Nhập nội dung phản hồi hoặc ghi chú kỹ thuật tại đây..."
                      className="w-full px-8 py-5 bg-[#0a0a0a] border border-white/5 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-[#baff02]/5 focus:border-[#baff02] outline-none transition-all resize-none text-white h-32"
                    ></textarea>
                 </div>

                 {/* Action Buttons */}
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}
                      disabled={isProcessing}
                      className="py-4 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                    >
                      Bắt đầu xử lý
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'CLOSED')}
                      disabled={isProcessing || !replyMessage.trim()}
                      className="py-4 bg-[#baff02] text-[#0a0a0a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#baff02]/10 hover:bg-[#8ec401] transition-all"
                    >
                      Hoàn tất & Đóng
                    </button>
                    {role === 'manager' && (
                      <button 
                        onClick={() => handleEscalate(selectedTicket.id)}
                        disabled={isProcessing}
                        className="col-span-2 py-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center space-x-2"
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
    </div>
  );
};
