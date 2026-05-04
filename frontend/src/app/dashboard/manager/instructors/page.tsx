'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Lock, 
  Unlock, 
  Eye, 
  BookOpen, 
  Star,
  DollarSign,
  X,
  Send,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Trash2,
  Loader2,
  Info
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

// Expanded Mock Data
const INITIAL_INSTRUCTORS = [
  { 
    id: 1, 
    name: 'Nguyễn Văn A', 
    email: 'vana@moneylab.vn', 
    phone: '0901 234 567',
    courses: 5, 
    rating: 4.9, 
    students: 1250, 
    revenue: '150.200.000đ',
    joined: '2023-01-10', 
    avatar: 'https://i.pravatar.cc/150?u=1',
    isLocked: false,
    bio: 'Chuyên gia tài chính với hơn 10 năm kinh nghiệm trong lĩnh vực đầu tư chứng khoán và quản lý quỹ.',
    location: 'TP. Hồ Chí Minh',
    specialization: 'Chứng khoán & Đầu tư'
  },
  { 
    id: 2, 
    name: 'Trần Thị Minh', 
    email: 'minh.tran@moneylab.vn', 
    phone: '0908 765 432',
    courses: 3, 
    rating: 4.8, 
    students: 840, 
    revenue: '85.500.000đ',
    joined: '2023-05-20', 
    avatar: 'https://i.pravatar.cc/150?u=2',
    isLocked: true,
    bio: 'Giảng viên AI & Công nghệ, đam mê ứng dụng trí tuệ nhân tạo vào kinh doanh thực tiễn.',
    location: 'Hà Nội',
    specialization: 'AI & Data Science'
  },
  { 
    id: 3, 
    name: 'Lê Hoàng Nam', 
    email: 'nam.le@moneylab.vn', 
    phone: '0912 345 678',
    courses: 2, 
    rating: 4.7, 
    students: 420, 
    revenue: '42.000.000đ',
    joined: '2023-11-15', 
    avatar: 'https://i.pravatar.cc/150?u=3',
    isLocked: false,
    bio: 'Chuyên viên Marketing số, giúp các doanh nghiệp vừa và nhỏ tối ưu hóa quy trình bán hàng.',
    location: 'Đà Nẵng',
    specialization: 'Digital Marketing'
  },
];

export default function ManagerInstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Modal Helpers
  const openEmailModal = (instructor: any) => {
    setSelectedInstructor(instructor);
    setIsEmailModalOpen(true);
  };

  const openDetailModal = (instructor: any) => {
    setSelectedInstructor(instructor);
    setIsDetailModalOpen(true);
  };

  const fetchInstructors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users?role=INSTRUCTOR');
      setInstructors(response.data);
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInstructors();
  }, []);

  // Update Lock Status
  const handleUpdateStatus = async () => {
    if (!selectedInstructor) return;
    try {
      const isCurrentlyLocked = selectedInstructor.status === 'BLOCKED';
      const newStatus = isCurrentlyLocked ? 'ACTIVE' : 'BLOCKED';
      
      await api.patch(`/users/${selectedInstructor.id}`, { 
        status: newStatus,
        lockReason: !isCurrentlyLocked ? lockReason : undefined
      });
      
      alert(`Đã ${newStatus === 'BLOCKED' ? 'khóa' : 'mở khóa'} tài khoản thành công!`);
      setIsLockModalOpen(false);
      setLockReason('');
      fetchInstructors();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  // Send Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstructor || !emailTitle || !emailContent) return;
    try {
      setIsSending(true);
      await api.post('/communications', {
        receiverId: selectedInstructor.id,
        subject: emailTitle,
        content: emailContent
      });
      
      alert(`Đã đưa email vào hàng chờ gửi đến giảng viên ${selectedInstructor.name}!`);
      setIsEmailModalOpen(false);
      setEmailTitle('');
      setEmailContent('');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Lỗi khi gửi yêu cầu liên hệ');
    } finally {
      setIsSending(false);
    }
  };

  const filteredInstructors = instructors.filter(ins => 
    ins.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ins.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="manager" title="Quản lý Giảng viên">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:shadow-xl">
          <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#0f172a] dark:text-white">Đội ngũ Giảng viên</h3>
              <p className="text-sm text-gray-400 font-medium">Quản lý tài khoản và theo dõi doanh thu</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#baff02] transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm giảng viên..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/10 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px] flex flex-col">
            {isLoading ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-[#baff02]" size={40} />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải danh sách giảng viên...</p>
              </div>
            ) : filteredInstructors.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-4">
                <Info size={40} className="text-gray-300" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Không tìm thấy giảng viên nào</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Giảng viên</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khóa học / Học viên</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng doanh thu</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đánh giá</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                <AnimatePresence mode='popLayout'>
                  {filteredInstructors.map((ins) => (
                    <motion.tr 
                      key={ins.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative",
                        ins.status === 'BLOCKED' && "bg-rose-50/30 dark:bg-rose-500/5"
                      )}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] text-[#baff02] flex items-center justify-center font-black text-lg border border-white/5 shadow-sm">
                              {ins.name.charAt(0)}
                            </div>
                            {ins.status === 'BLOCKED' && (
                              <div className="absolute -top-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                                <Lock size={10} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0f172a] dark:text-white flex items-center">
                              {ins.name}
                              {ins.status === 'BLOCKED' && <span className="ml-2 text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Locked</span>}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium">{ins.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                            <BookOpen size={14} className="text-[#baff02]" />
                            <span><b className="text-[#0f172a] dark:text-white">{ins.courses || 0}</b> khóa học</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                            <Users size={14} className="text-blue-500" />
                            <span><b className="text-[#0f172a] dark:text-white">{(ins.students || 0).toLocaleString()}</b> học viên</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-[#baff02]/10 rounded-lg text-[#baff02]">
                            <DollarSign size={14} />
                          </div>
                          <p className="text-sm font-black text-[#baff02]">{(ins.revenue || 0).toLocaleString()}đ</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-1.5 text-amber-500">
                          <Star size={16} fill="currentColor" />
                          <span className="text-sm font-black">{ins.rating}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-100 transition-opacity">
                          {/* Email Button */}
                          <button 
                            onClick={() => openEmailModal(ins)}
                            className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 rounded-xl transition-all" 
                            title="Liên hệ"
                          >
                            <Mail size={16} />
                          </button>
                          
                          {/* Lock Toggle Button */}
                           <button 
                            onClick={() => {
                              setSelectedInstructor(ins);
                              if (ins.status === 'BLOCKED') {
                                handleUpdateStatus(); // Direct unlock
                              } else {
                                setIsLockModalOpen(true); // Open reason modal for locking
                              }
                            }}
                            className={cn(
                              "p-2.5 rounded-xl transition-all",
                              ins.status === 'BLOCKED' 
                                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                            )}
                            title={ins.status === 'BLOCKED' ? "Mở khóa" : "Khóa tài khoản"}
                          >
                            {ins.status === 'BLOCKED' ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>

                          {/* Detail Button */}
                          <button 
                            onClick={() => openDetailModal(ins)}
                            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-[#baff02] hover:text-[#0f172a] rounded-xl transition-all" 
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>

      {/* Email Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmailModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl p-10 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Mail size={24} /></div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Gửi Email Liên Hệ</h3>
                </div>
                <button onClick={() => setIsEmailModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tên giảng viên</label>
                    <input type="text" readOnly value={selectedInstructor?.name} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-bold text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Địa chỉ email</label>
                    <input type="text" readOnly value={selectedInstructor?.email} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-bold text-gray-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tiêu đề (Title)</label>
                  <input required type="text" value={emailTitle} onChange={e => setEmailTitle(e.target.value)} placeholder="Nhập tiêu đề email..." className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nội dung</label>
                  <textarea required rows={5} value={emailContent} onChange={e => setEmailContent(e.target.value)} placeholder="Nhập nội dung thư gửi giảng viên..." className="w-full px-5 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none shadow-sm"></textarea>
                </div>
                <button type="submit" disabled={isSending} className="w-full flex items-center justify-center space-x-3 py-4 bg-[#baff02] text-[#0f172a] rounded-2xl text-sm font-black shadow-lg shadow-[#baff02]/20">
                  {isSending ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /><span>Gửi Email</span></>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lock Reason Modal */}
      <AnimatePresence>
        {isLockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLockModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl p-10 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                 <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><Lock size={24} /></div>
                 <button onClick={() => setIsLockModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Khóa tài khoản</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6 px-1">Lưu ý: Giảng viên sẽ không thể đăng nhập và nhận được thông báo qua email.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Lý do khóa tài khoản</label>
                  <textarea 
                    rows={4} 
                    value={lockReason} 
                    onChange={e => setLockReason(e.target.value)} 
                    placeholder="Nhập lý do chi tiết..." 
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all resize-none text-[#0f172a] dark:text-white"
                  ></textarea>
                </div>
                <button 
                  onClick={handleUpdateStatus}
                  disabled={!lockReason.trim()}
                  className="w-full py-4 bg-rose-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-rose-500/20 disabled:opacity-50"
                >
                  Xác nhận Khóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              
              {/* Header Profile */}
              <div className="relative h-40 bg-[#baff02]/10">
                <div className="absolute -bottom-16 left-10 flex items-end space-x-6">
                  <div className="relative">
                    {selectedInstructor?.avatar ? (
                      <Image src={selectedInstructor.avatar} width={128} height={128} className="w-32 h-32 rounded-[32px] object-cover border-8 border-white dark:border-gray-900 shadow-xl" alt={selectedInstructor.name} />
                    ) : (
                      <div className="w-32 h-32 rounded-[32px] bg-[#0a0a0a] text-[#baff02] flex items-center justify-center font-black text-4xl border-8 border-white dark:border-gray-900 shadow-xl">
                        {selectedInstructor?.name?.charAt(0)}
                      </div>
                    )}
                    <div className={cn("absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900", selectedInstructor?.status === 'BLOCKED' ? "bg-rose-500" : "bg-emerald-500")}></div>
                  </div>
                  <div className="pb-4">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{selectedInstructor?.name}</h3>
                    <p className="text-sm text-[#baff02] font-bold uppercase tracking-widest">{selectedInstructor?.specialization || 'Giảng viên'}</p>
                  </div>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-black/20 text-gray-700 dark:text-white rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
              </div>

              {/* Body Content */}
              <div className="px-10 pt-20 pb-10">
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Doanh thu</p>
                    <p className="text-lg font-black text-[#baff02]">{(selectedInstructor?.balance || 0).toLocaleString()}đ</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Học viên</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{(selectedInstructor?.students || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Khóa học</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{selectedInstructor?.courses || 0}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl"><Info size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tiểu sử</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{selectedInstructor?.bio}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="text-gray-400" size={18} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedInstructor?.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="text-gray-400" size={18} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedInstructor?.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="text-gray-400" size={18} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedInstructor?.location || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-gray-400" size={18} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Tham gia: {selectedInstructor?.createdAt ? new Date(selectedInstructor.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[#0f172a] dark:text-white">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <Star fill="currentColor" size={20} />
                    <span className="text-xl font-black">{selectedInstructor?.rating || '0.0'}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase ml-1 tracking-widest opacity-60">Xếp hạng</span>
                  </div>
                  <button 
                     onClick={() => {
                        setIsDetailModalOpen(false);
                        openEmailModal(selectedInstructor);
                     }}
                     className="px-8 py-3 bg-[#baff02] text-[#0f172a] rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#baff02]/20"
                  >
                    Gửi phản hồi nhanh
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
