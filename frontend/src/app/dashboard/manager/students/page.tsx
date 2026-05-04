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
  CheckCircle2,
  DollarSign,
  X,
  Send,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Info,
  Trophy,
  BarChart3
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';



export default function ManagerStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Modal Helpers
  const openEmailModal = (student: any) => {
    setSelectedStudent(student);
    setIsEmailModalOpen(true);
  };

  const openDetailModal = (student: any) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users?role=STUDENT');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  // Update Status
  const handleUpdateStatus = async () => {
    if (!selectedStudent) return;
    try {
      const isCurrentlyLocked = selectedStudent.status === 'BLOCKED';
      const newStatus = isCurrentlyLocked ? 'ACTIVE' : 'BLOCKED';
      
      await api.patch(`/users/${selectedStudent.id}`, { 
        status: newStatus,
        lockReason: !isCurrentlyLocked ? lockReason : undefined
      });
      
      alert(`Đã ${newStatus === 'BLOCKED' ? 'khóa' : 'mở khóa'} học viên thành công!`);
      setIsLockModalOpen(false);
      setLockReason('');
      fetchStudents();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  // Send Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !emailTitle || !emailContent) return;
    try {
      setIsSending(true);
      await api.post('/communications', {
        receiverId: selectedStudent.id,
        subject: emailTitle,
        content: emailContent
      });
      
      alert(`Đã đưa email vào hàng chờ gửi đến học viên ${selectedStudent.name}!`);
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

  const filteredStudents = students.filter(std => 
    std.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    std.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="manager" title="Quản lý Học viên">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:shadow-xl">
          <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#0f172a] dark:text-white">Danh sách Học viên</h3>
              <p className="text-sm text-gray-400 font-medium">Theo dõi tiến độ học tập và hiệu suất Affiliate</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#baff02] transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm học viên..." 
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
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải danh sách học viên...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Học viên</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Doanh thu Affiliate</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Hoàn thành</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                <AnimatePresence mode='popLayout'>
                  {filteredStudents.map((std) => (
                    <motion.tr 
                      key={std.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative",
                        std.status === 'BLOCKED' && "bg-rose-50/30 dark:bg-rose-500/5"
                      )}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] text-[#baff02] flex items-center justify-center font-black text-lg border border-white/5 shadow-sm">
                              {std.name.charAt(0)}
                            </div>
                            {std.status === 'BLOCKED' && (
                              <div className="absolute -top-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                                <Lock size={10} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0f172a] dark:text-white flex items-center">
                              {std.name}
                              {std.status === 'BLOCKED' && <span className="ml-2 text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Locked</span>}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium">{std.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">
                          <BookOpen size={14} className="text-[#baff02]" />
                          <span>{std.enrolledCourses}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-[#baff02]/10 rounded-lg text-[#baff02]">
                            <DollarSign size={14} />
                          </div>
                          <p className="text-sm font-black text-[#baff02]">{(std.balance || 0).toLocaleString()}đ</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={14} />
                          <span>{std.completedCourses}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-100 transition-opacity">
                          {/* Email Button */}
                          <button 
                            onClick={() => openEmailModal(std)}
                            className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 rounded-xl transition-all" 
                            title="Liên hệ"
                          >
                            <Mail size={16} />
                          </button>
                          
                          {/* Lock Toggle Button */}
                           <button 
                            onClick={() => {
                              setSelectedStudent(std);
                              if (std.status === 'BLOCKED') {
                                handleUpdateStatus(); // Direct unlock
                              } else {
                                setIsLockModalOpen(true);
                              }
                            }}
                            className={cn(
                              "p-2.5 rounded-xl transition-all",
                              std.status === 'BLOCKED' 
                                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                            )}
                            title={std.status === 'BLOCKED' ? "Mở khóa" : "Khóa tài khoản"}
                          >
                            {std.status === 'BLOCKED' ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>

                          {/* Detail Button */}
                          <button 
                            onClick={() => openDetailModal(std)}
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

      {/* Email Modal - Reuse same logic */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmailModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl p-10 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Mail size={24} /></div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Liên hệ Học viên</h3>
                </div>
                <button onClick={() => setIsEmailModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tên học viên</label>
                    <input type="text" readOnly value={selectedStudent?.name} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-bold text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Địa chỉ email</label>
                    <input type="text" readOnly value={selectedStudent?.email} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-bold text-gray-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tiêu đề (Title)</label>
                  <input required type="text" value={emailTitle} onChange={e => setEmailTitle(e.target.value)} placeholder="Nhập tiêu đề email..." className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nội dung</label>
                  <textarea required rows={5} value={emailContent} onChange={e => setEmailContent(e.target.value)} placeholder="Nhập nội dung thư gửi học viên..." className="w-full px-5 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none shadow-sm"></textarea>
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
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Khóa học viên</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6 px-1">Lưu ý: Học viên sẽ không thể đăng nhập và nhận được thông báo qua email.</p>
              
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
              <div className="relative h-40 bg-blue-500/10">
                <div className="absolute -bottom-16 left-10 flex items-end space-x-6">
                  <div className="relative">
                    <Image src={selectedStudent?.avatar || `https://i.pravatar.cc/150?u=${selectedStudent?.id}`} width={128} height={128} className="w-32 h-32 rounded-[32px] object-cover border-8 border-white dark:border-gray-900 shadow-xl" alt={selectedStudent?.name} />
                    <div className={cn("absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900", selectedStudent?.status === 'BLOCKED' ? "bg-rose-500" : "bg-emerald-500")}></div>
                  </div>
                  <div className="pb-4">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{selectedStudent?.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{selectedStudent?.level}</span>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Học viên hệ thống</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-black/20 text-gray-700 dark:text-white rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
              </div>

              {/* Body Content */}
              <div className="px-10 pt-20 pb-10">
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Khóa học đang học</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{selectedStudent?.enrolledCourses || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Hoàn thành</p>
                    <p className="text-lg font-black text-emerald-500">{selectedStudent?.completedCourses || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Affiliate Revenue</p>
                    <p className="text-lg font-black text-[#baff02]">{(selectedStudent?.balance || 0).toLocaleString()}đ</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl"><Info size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Giới thiệu</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{selectedStudent?.bio}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="text-gray-400" size={18} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent?.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="text-gray-400" size={18} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent?.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="text-gray-400" size={18} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent?.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm font-bold text-gray-900 dark:text-white">
                        <Calendar className="text-gray-400" size={18} />
                        <span>Tham gia: {selectedStudent?.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-rose-500">
                    <Trophy size={20} />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hạng thành viên:</span>
                    <span className="text-sm font-black text-[#0f172a] dark:text-white">{selectedStudent?.level} Member</span>
                  </div>
                  <button className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    selectedStudent?.status === 'BLOCKED' ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  )}>
                    {selectedStudent?.status === 'BLOCKED' ? "Đang bị khóa" : "Hoạt động"}
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
