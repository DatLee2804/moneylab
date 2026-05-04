'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, 
  X, 
  Check, 
  AlertCircle, 
  Search, 
  Filter, 
  Eye,
  User,
  BookOpen,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Image from 'next/image';

import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface PendingCourse {
  id: string;
  title: string;
  instructor: { name: string; email: string };
  category: string;
  price: number;
  createdAt: string;
  coverImage?: string;
  lessons: number;
}

export default function ManagerReviewPage() {
  const [courses, setCourses] = React.useState<PendingCourse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCourse, setSelectedCourse] = React.useState<PendingCourse | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [actionLoading, setActionLoading] = React.useState(false);

  const fetchPendingCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/courses?status=PENDING');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendingCourses();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      await api.patch(`/courses/${id}/status`, { status: 'APPROVED' });
      alert('Đã duyệt khóa học thành công!');
      fetchPendingCourses(); // Refresh list
    } catch (error) {
       console.error('Failed to approve course:', error);
       alert('Lỗi khi duyệt khóa học');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || !selectedCourse) return;
    try {
      setActionLoading(true);
      await api.patch(`/courses/${selectedCourse.id}/status`, { 
        status: 'REJECTED', 
        reason: rejectionReason 
      });
      alert('Đã từ chối khóa học');
      setIsRejectModalOpen(false);
      setRejectionReason('');
      setSelectedCourse(null);
      fetchPendingCourses();
    } catch (error) {
      console.error('Failed to reject course:', error);
      alert('Lỗi khi từ chối khóa học');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout role="manager" title="Duyệt khóa học">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-6">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
              <Clock size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-[#0f172a] dark:text-white">12</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Đang chờ duyệt</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-6">
            <div className="w-14 h-14 bg-[#baff02]/10 text-[#baff02] rounded-2xl flex items-center justify-center">
              <Check size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-[#0f172a] dark:text-white">148</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Đã duyệt tháng này</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-6">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
              <AlertCircle size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-[#0f172a] dark:text-white">5</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Bị từ chối</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học..." 
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#baff02]/20"
            />
          </div>
          <button className="px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-sans">
            <Filter size={18} />
            <span>Lọc theo danh mục</span>
          </button>
        </div>

        {/* Pending List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-[#baff02] animate-spin" />
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Đang tải danh sách chờ duyệt...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700">
               <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
               <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Không có khóa học nào đang chờ duyệt</p>
            </div>
          ) : (
            courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-64 h-48 lg:h-auto relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {course.coverImage ? (
                      <Image 
                        src={course.coverImage} 
                        alt={course.title} 
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                      {course.category || 'Chưa phân loại'}
                    </div>
                  </div>

                  <div className="flex-grow p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black text-[#0f172a] dark:text-white group-hover:text-[#baff02] transition-colors">{course.title}</h3>
                        <span className="text-sm font-black text-[#baff02]">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-gray-400" />
                          <span>{course.instructor?.name || 'Ẩn danh'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen size={16} className="text-gray-400" />
                          <span>{course.lessons} bài học</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-gray-400" />
                          <span>Gửi {new Date(course.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-50 dark:border-gray-700">
                      <button 
                        onClick={() => window.location.href = `/courses/${course.id}`}
                        className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-[#baff02] transition-colors"
                      >
                        <Eye size={18} />
                        <span>Xem chi tiết</span>
                      </button>

                      <div className="flex items-center space-x-3">
                        <button 
                          disabled={actionLoading}
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsRejectModalOpen(true);
                          }}
                          className="px-6 py-3 bg-rose-50 text-rose-600 font-black rounded-xl hover:bg-rose-100 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                        >
                          Từ chối
                        </button>
                        <button 
                          disabled={actionLoading}
                          onClick={() => handleApprove(course.id)}
                          className="px-6 py-3 bg-[#baff02] text-[#0f172a] font-black rounded-xl hover:bg-[#a3e600] transition-all text-xs uppercase tracking-widest shadow-lg shadow-[#baff02]/20 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                        >
                          {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Duyệt ngay'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsRejectModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-black text-[#0f172a] dark:text-white">Lý do từ chối</h3>
                <button onClick={() => setIsRejectModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do chi tiết..."
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 min-h-[150px] resize-none font-bold"
                />
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-900/50 flex gap-4">
                <button 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-grow py-4 text-sm font-black text-gray-500 hover:text-[#0f172a] dark:hover:text-white transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-grow py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 disabled:opacity-50 font-sans"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
