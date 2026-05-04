'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Lock, 
  Unlock, 
  Pencil,
  X,
  Send,
  ShieldCheck,
  CreditCard,
  Key,
  User as UserIcon,
  Loader2,
  Trash2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

interface User {
  id: string; // Changed from number to string for UUID compatibility
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string; // Backend uses joinedAt
  password?: string;
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Email Form State
  const [emailForm, setEmailForm] = React.useState({
    subject: '',
    content: ''
  });

  // Edit Form State
  const [editForm, setEditForm] = React.useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const toggleLock = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      await api.patch(`/users/${id}`, { status: newStatus });
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Failed to toggle lock:', error);
    }
  };

  const [isSending, setIsSending] = React.useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !emailForm.subject || !emailForm.content) return;
    
    try {
      setIsSending(true);
      await api.post('/communications', {
        receiverId: selectedUser.id,
        subject: emailForm.subject,
        content: emailForm.content
      });
      
      alert(`Đã đưa email vào hàng chờ gửi đến người dùng ${selectedUser.name}!`);
      setIsEmailModalOpen(false);
      setEmailForm({ subject: '', content: '' });
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Lỗi khi gửi yêu cầu liên hệ');
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    try {
      const { id, ...updateData } = editForm;
      await api.patch(`/users/${id}`, updateData);
      setUsers(users.map(u => u.id === id ? editForm : u));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  // handleDeleteUser function removed to prevent permanent data loss. 
  // Accounts should be locked instead.

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatus = (status: string) => {
    const isPrimary = status === 'ACTIVE';
    return (
      <span className={cn(
        "inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
        isPrimary ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      )}>
        <div className={cn("w-1.5 h-1.5 rounded-full", isPrimary ? "bg-emerald-400" : "bg-rose-400")} />
        <span>{status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}</span>
      </span>
    );
  };

  return (
    <DashboardLayout role="admin" title="Quản lý người dùng">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-[#141414] rounded-[40px] border border-white/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Cơ sở dữ liệu Người dùng</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Quản lý thành viên hệ thống từ Database thực tế</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm người dùng..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 transition-all outline-none text-white placeholder:text-gray-600" 
                />
              </div>
              <button onClick={fetchUsers} className="p-2.5 bg-[#0a0a0a] text-gray-400 rounded-xl border border-white/5 font-sans hover:text-[#baff02] transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto min-h-[400px] flex flex-col">
            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#baff02]" size={40} />
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Đang tải dữ liệu từ máy chủ...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0a0a0a]/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thông tin chính</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-500 font-bold text-sm">Không tìm thấy người dùng nào.</td>
                    </tr>
                  ) : filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] text-[#baff02] flex items-center justify-center font-black text-lg shadow-sm border border-white/5">{u.name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-black text-white group-hover:text-[#baff02] transition-colors">{u.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block",
                          u.role === 'admin' ? "bg-rose-500/10 text-rose-400" : 
                          u.role === 'instructor' ? "bg-blue-500/10 text-blue-400" : 
                          u.role === 'manager' ? "bg-[#baff02]/10 text-[#baff02]" : 
                          "bg-gray-500/10 text-gray-400"
                        )}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {renderStatus(u.status)}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => { setSelectedUser(u); setIsEmailModalOpen(true); }}
                            className="p-2.5 bg-[#baff02]/5 text-[#baff02] rounded-xl hover:bg-[#baff02] hover:text-[#0a0a0a] transition-all" 
                            title="Gửi mail thông báo"
                          >
                            <Mail size={18} />
                          </button>
                           <button 
                            onClick={() => toggleLock(u.id, u.status)}
                            className={cn(
                              "p-2.5 rounded-xl transition-all",
                              u.status === 'ACTIVE' 
                                ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" 
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                            )} 
                            title={u.status === 'ACTIVE' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {u.status === 'ACTIVE' ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>
                          <button 
                            onClick={() => { setEditForm(u); setIsEditModalOpen(true); }}
                            className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/5" 
                            title="Chỉnh sửa hồ sơ"
                          >
                            <Pencil size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* --- EMAIL MODAL --- */}
      <AnimatePresence>
        {isEmailModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmailModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#141414] rounded-[40px] overflow-hidden shadow-2xl max-w-lg w-full border border-white/10">
              <div className="p-8 bg-[#baff02] text-[#0a0a0a]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Mail size={24} />
                    <h3 className="text-xl font-black uppercase tracking-tight">Gửi Email cho Người dùng</h3>
                  </div>
                  <button onClick={() => setIsEmailModalOpen(false)} className="hover:scale-110 transition-transform"><X size={24} /></button>
                </div>
                <p className="text-xs font-bold opacity-70">Người nhận: <span className="underline italic">{selectedUser.name}</span> ({selectedUser.email})</p>
              </div>
              <form onSubmit={handleSendEmail} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3">Tiêu đề email</label>
                    <input required type="text" value={emailForm.subject} onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})} placeholder="Nhập tiêu đề..." className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 transition-all outline-none text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3">Nội dung email</label>
                    <textarea required rows={6} value={emailForm.content} onChange={(e) => setEmailForm({...emailForm, content: e.target.value})} placeholder="Viết nội dung tin nhắn tại đây..." className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 transition-all outline-none resize-none text-white" />
                  </div>
                </div>
                <button type="submit" disabled={isSending} className="w-full py-5 bg-[#baff02] text-[#0a0a0a] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#baff02]/20 hover:bg-[#8ec401] transition-all flex items-center justify-center space-x-2">
                  {isSending ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      <Send size={18} />
                      <span>Gửi tin nhắn ngay</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT PROFILE MODAL --- */}
      <AnimatePresence>
        {isEditModalOpen && editForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-[#141414] rounded-[40px] overflow-x-hidden overflow-y-auto max-h-[90vh] shadow-2xl max-w-2xl w-full border border-white/10 custom-scrollbar">
              <div className="p-10 bg-[#0a0a0a] text-[#baff02] flex items-center justify-between sticky top-0 z-10 border-b border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-[#baff02] text-[#0a0a0a] rounded-[22px] flex items-center justify-center shadow-lg"><UserIcon size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Chỉnh sửa hồ sơ</h3>
                    <p className="text-xs font-bold text-[#baff02]/60 uppercase tracking-widest">ID: ...{editForm.id.substring(0, 8)} • {editForm.role}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white"><X size={28} /></button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-10 space-y-10">
                {/* Account Section */}
                <section>
                  <div className="flex items-center space-x-3 mb-6 border-l-4 border-[#baff02] pl-4">
                    <ShieldCheck size={20} className="text-[#baff02]" />
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Thông tin Tài khoản</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3">Họ và tên</label>
                      <input required type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 transition-all outline-none text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3">Email liên hệ</label>
                      <input required type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 transition-all outline-none text-white" />
                    </div>
                  </div>
                </section>

                {/* Banking Section */}
                <section>
                  <div className="flex items-center space-x-3 mb-6 border-l-4 border-amber-400 pl-4">
                    <CreditCard size={20} className="text-amber-400" />
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Thông tin Ngân hàng</h4>
                  </div>
                  <div className="p-8 bg-amber-400/5 rounded-3xl border border-amber-400/10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-amber-400/40 uppercase tracking-widest pl-1">Tên ngân hàng</p>
                          <input type="text" value={editForm.bankName || ''} onChange={(e) => setEditForm({...editForm, bankName: e.target.value})} className="w-full px-5 py-4 bg-[#0a0a0a] rounded-xl text-sm font-black text-gray-300 border border-white/5" />
                       </div>
                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-amber-400/40 uppercase tracking-widest pl-1">Chủ tài khoản</p>
                          <input type="text" value={editForm.bankOwner || ''} onChange={(e) => setEditForm({...editForm, bankOwner: e.target.value})} className="w-full px-5 py-4 bg-[#0a0a0a] rounded-xl text-sm font-black text-gray-300 border border-white/5" />
                       </div>
                       <div className="space-y-1.5 md:col-span-2">
                          <p className="text-[10px] font-black text-amber-400/40 uppercase tracking-widest pl-1">Số tài khoản</p>
                          <input type="text" value={editForm.bankAccount || ''} onChange={(e) => setEditForm({...editForm, bankAccount: e.target.value})} className="w-full px-5 py-4 bg-[#0a0a0a] rounded-xl text-lg font-mono font-black text-gray-100 border border-white/5 tracking-widest" />
                       </div>
                    </div>
                  </div>
                </section>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-5 bg-[#0a0a0a] text-gray-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">Hủy bỏ</button>
                  <button type="submit" className="flex-[2] py-5 bg-[#baff02] text-[#0a0a0a] rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#baff02]/20 hover:bg-[#8ec401] transition-all flex items-center justify-center space-x-2">
                    <ShieldCheck size={18} />
                    <span>Lưu thay đổi hồ sơ</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
