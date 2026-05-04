'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  ChevronRight,
  Loader2 
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import api from '@/lib/api';

export default function StudentProgressPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/enrollments/me');
        setEnrollments(response.data);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="student" title="Tiến độ học tập">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải tiến độ học tập...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="Tiến độ học tập">
      <div className="max-w-7xl mx-auto space-y-8 uppercase">
        <div className="bg-[#141414] rounded-[40px] border border-white/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Tiến độ học tập chi tiết</h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Theo dõi quá trình hoàn thành các khóa học của bạn</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a]/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">STT</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày đăng ký</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiến độ</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-500 font-black uppercase tracking-widest text-[10px]">Bạn chưa đăng ký khóa học nào</td>
                  </tr>
                ) : enrollments.map((en, idx) => (
                  <tr key={en.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-sm font-bold text-gray-500">{idx + 1}</td>
                    <td className="px-8 py-6 text-sm font-black text-white group-hover:text-[#baff02] transition-colors">{en.course.title}</td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium font-sans">
                      {new Date(en.enrolledAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#baff02] transition-all" style={{ width: `${en.progress}%` }} />
                        </div>
                        <span className="text-xs font-black text-[#baff02]">{en.progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Link href={`/courses/${en.course.id}/player`} className="flex items-center space-x-2 text-[#baff02] hover:underline transition-all group-hover:translate-x-1 duration-300">
                        <span className="text-xs font-black uppercase tracking-widest">Tiếp tục học</span>
                        <ChevronRight size={14} />
                      </Link>
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

