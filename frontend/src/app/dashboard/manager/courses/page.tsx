'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  Eye, 
  Star,
  DollarSign,
  Users,
  Layers,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';



export default function ManagerCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const handleToggleLock = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'APPROVED' ? 'REJECTED' : 'APPROVED';
      await api.patch(`/courses/${id}/status`, { status: newStatus });
      setCourses(courses.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Failed to toggle lock:', error);
    }
  };

  return (
    <DashboardLayout role="manager" title="Quản lý Khóa học">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#0f172a] dark:text-white">Kho khóa học hệ thống</h2>
            <p className="text-sm text-gray-500 font-medium">Kiểm soát nội dung và hiệu suất kinh doanh</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#baff02] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Tìm khóa học..." 
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/10 outline-none transition-all" 
              />
            </div>
            <button className="p-2.5 bg-white dark:bg-gray-800 text-gray-500 rounded-xl border border-gray-100 dark:border-gray-700 hover:text-[#baff02] transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:shadow-xl">
          <div className="overflow-x-auto min-h-[400px] flex flex-col">
            {isLoading ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-[#baff02]" size={40} />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang kết nối Database...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chi tiết</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Doanh thu</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Đánh giá</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                <AnimatePresence mode='popLayout'>
                  {courses.map((course) => (
                    <motion.tr 
                      key={course.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-white/5 transition-all group",
                        course.status === 'Bị khóa' && "opacity-60 grayscale-[0.5]"
                      )}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-20 h-12 rounded-xl overflow-hidden shadow-sm bg-gray-900 border border-white/5 flex items-center justify-center">
                            {course.coverImage ? (
                              <Image src={course.coverImage} fill className="object-cover" alt={course.title} />
                            ) : (
                              <BookOpen size={16} className="text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0f172a] dark:text-white group-hover:text-[#baff02] transition-colors">{course.title}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: COURSE-{course.id.toString().padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-medium">
                            <Layers size={12} className="text-[#baff02]" />
                            <span>{course.lessons} buổi học</span>
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-medium">
                            <Users size={12} className="text-blue-500" />
                            <span>{course.students.toLocaleString()} học viên</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-block space-y-0.5">
                          <p className="text-sm font-black text-[#baff02]">
                            {Number(course.price) === 0 || course.isFree ? 'Khoá học miễn phí' : `${Number(course.price).toLocaleString('vi-VN')}đ`}
                          </p>
                          <p className="text-[10px] text-gray-400 line-through font-medium">Original</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center space-x-1 text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm font-black">{course.rating}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center space-x-1.5",
                          course.status === 'APPROVED' 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                            : course.status === 'REJECTED'
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        )}>
                          {course.status === 'APPROVED' ? <CheckCircle2 size={12} /> : course.status === 'REJECTED' ? <Lock size={12} /> : <Clock size={12} />}
                          <span>{course.status === 'APPROVED' ? 'Hoạt động' : course.status === 'REJECTED' ? 'Bị khóa' : 'Chờ duyệt'}</span>
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleLock(course.id, course.status)}
                            className={cn(
                              "p-2.5 rounded-xl transition-all",
                              course.status === 'REJECTED' 
                                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                            )}
                            title={course.status === 'REJECTED' ? "Mở khóa" : "Khóa khóa học"}
                          >
                            {course.status === 'REJECTED' ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                          <Link 
                            href={`/courses/${course.id}/player`}
                            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-[#baff02] hover:bg-[#baff02]/10 rounded-xl transition-all inline-flex items-center justify-center"
                            title="Xem chi tiết khóa học"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            )}
          </div>
          
          <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tổng cộng: {courses.length} khóa học</p>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
               <DollarSign size={14} className="text-[#baff02]" />
               <span className="text-xs font-black text-[#0f172a] dark:text-white">
                 Tổng doanh thu: {courses.reduce((acc: number, c: any) => acc + (Number(c.price) * (c.students || 0)), 0).toLocaleString('vi-VN')}đ
               </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
