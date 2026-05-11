'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function InstructorStudentsPage() {
  const [students, setStudents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/enrollments/instructor/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <DashboardLayout role="instructor" title="Danh sách học viên">
      <div className="w-full space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải danh sách học viên...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-none border-y border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden -mx-8 lg:-mx-12">
            <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#0f172a] dark:text-white">Theo dõi tiến độ</h3>
              <p className="text-sm text-gray-400 font-medium">Tương tác và hỗ trợ học viên trong quá trình học</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Tìm học viên..." className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none" />
              </div>
              <button className="p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-500 rounded-xl border border-gray-100 dark:border-gray-700 hover:text-[#baff02] transition-colors"><Filter size={18} /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Học viên</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày tham gia</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Số khóa học</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiến độ TB</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#baff02]/10 text-[#baff02] flex items-center justify-center font-bold text-sm">
                          {student.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0f172a] dark:text-white">{student.user.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{student.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(student.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {student.course.title}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#baff02]" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#0f172a] dark:text-white">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-[#baff02] transition-colors" title="Gửi mail"><Mail size={16} /></button>
                        <button className="p-2 text-gray-400 hover:text-[#baff02] transition-colors" title="Nhắn tin"><MessageSquare size={16} /></button>
                        <button className="p-2 text-gray-300 hover:text-[#baff02] transition-colors"><ChevronRight size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
}
