'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Mail, 
  MessageSquare,
  ChevronRight,
  X,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

export default function InstructorStudentsPage() {
  const [students, setStudents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal states
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null);
  const [studentComments, setStudentComments] = React.useState<any[]>([]);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = React.useState(false);
  const [isLoadingComments, setIsLoadingComments] = React.useState(false);

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

  const handleViewComments = async (student: any) => {
    setSelectedStudent(student);
    setIsCommentsModalOpen(true);
    setIsLoadingComments(true);
    try {
      const response = await api.get(`/lesson-comments/instructor/student/${student.id}`);
      setStudentComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  return (
    <DashboardLayout role="instructor" title="Danh sách học viên">
      <div className="w-full space-y-8 relative">
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
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phản hồi</th>
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
                        {student.courseCount} Khóa học
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
                          <button 
                            onClick={() => handleViewComments(student)}
                            className="p-2 text-gray-400 hover:text-[#baff02] transition-colors flex items-center space-x-1 border border-transparent hover:border-[#baff02]/20 rounded-lg"
                            title="Xem phản hồi"
                          >
                            <MessageSquare size={16} />
                            <span className="text-xs font-medium">Xem</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                        Chưa có học viên nào đăng ký khóa học của bạn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Comments Modal */}
      <AnimatePresence>
        {isCommentsModalOpen && selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
                <div>
                  <h3 className="text-xl font-black text-[#0f172a] dark:text-white flex items-center space-x-2">
                    <MessageSquare size={20} className="text-[#baff02]" />
                    <span>Phản hồi của học viên</span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedStudent.user.name} ({selectedStudent.user.email})
                  </p>
                </div>
                <button 
                  onClick={() => setIsCommentsModalOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900/50">
                {isLoadingComments ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 text-[#baff02] animate-spin" />
                  </div>
                ) : studentComments.length > 0 ? (
                  <div className="space-y-6">
                    {studentComments.map((comment) => (
                      <div key={comment.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-bold text-[#0f172a] dark:text-white">
                              Bài học: {comment.lesson?.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Khóa học: {comment.lesson?.section?.course?.title}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-md">
                            {new Date(comment.createdAt).toLocaleDateString('vi-VN')} {new Date(comment.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-50 dark:border-gray-800">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                    <p className="text-gray-500 font-medium text-sm">Học viên này chưa có phản hồi nào.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
