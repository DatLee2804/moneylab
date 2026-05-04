'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Eye,
  FileText,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';

export default function ManagerPage() {
  const [activeTab, setActiveTab] = React.useState<'review' | 'instructors'>('review');

  const pendingCourses = [
    { id: 1, title: 'Kỹ thuật Prompt Engineering nâng cao', instructor: 'Trần Văn A', date: '2025-05-10', category: 'AI' },
    { id: 2, title: 'Phân tích kỹ thuật trong Crypto', instructor: 'Lê Thị B', date: '2025-05-12', category: 'Tài chính' },
    { id: 3, title: 'Xây dựng thương hiệu cá nhân bằng AI', instructor: 'Phạm Văn C', date: '2025-05-14', category: 'Marketing' },
  ];

  return (
    <DashboardLayout role="manager" title="Quản lý hệ thống">
      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setActiveTab('review')}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative px-2",
              activeTab === 'review' ? "text-[#baff02]" : "text-gray-400 hover:text-[#0f172a] dark:hover:text-white"
            )}
          >
            Duyệt khóa học
            {activeTab === 'review' && <motion.div layoutId="m-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#baff02] rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('instructors')}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative px-2",
              activeTab === 'instructors' ? "text-[#baff02]" : "text-gray-400 hover:text-[#0f172a] dark:hover:text-white"
            )}
          >
            Quản lý giảng viên
            {activeTab === 'instructors' && <motion.div layoutId="m-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#baff02] rounded-full" />}
          </button>
        </div>

        {activeTab === 'review' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                  <h3 className="text-lg font-black text-[#0f172a] dark:text-white flex items-center">
                    <ShieldCheck className="mr-2 text-[#baff02]" size={20} />
                    Khóa học chờ duyệt
                  </h3>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase rounded-lg">
                    {pendingCourses.length} yêu cầu mới
                  </span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-gray-50 dark:border-gray-700">
                       <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên khóa học</th>
                       <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Giảng viên</th>
                       <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày gửi</th>
                       <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Hành động</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                     {pendingCourses.map((course) => (
                       <tr key={course.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                         <td className="p-6">
                           <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-xl bg-[#baff02]/5 text-[#baff02] flex items-center justify-center">
                               <FileText size={18} />
                             </div>
                             <div>
                               <p className="text-sm font-bold text-[#0f172a] dark:text-white group-hover:text-[#baff02] transition-colors">{course.title}</p>
                               <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-[8px] font-bold rounded uppercase">{course.category}</span>
                             </div>
                           </div>
                         </td>
                         <td className="p-6 text-sm text-gray-500 font-medium">{course.instructor}</td>
                         <td className="p-6 text-sm text-gray-500 font-medium">{course.date}</td>
                         <td className="p-6">
                           <div className="flex items-center justify-center space-x-2">
                             <button className="p-2 text-gray-400 hover:text-[#baff02] transition-colors" title="Xem chi tiết"><Eye size={18} /></button>
                             <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors" title="Phê duyệt"><CheckCircle2 size={18} /></button>
                             <button className="p-2 text-gray-400 hover:text-rose-500 transition-colors" title="Từ chối"><XCircle size={18} /></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'instructors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 flex items-center space-x-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#baff02]/10 text-[#baff02] flex items-center justify-center font-bold text-xl">
                  {i === 1 ? 'A' : i === 2 ? 'B' : 'C'}
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0f172a] dark:text-white">Giảng viên {i}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">10 khóa học • 2.5K học viên</p>
                  <button className="mt-4 text-xs font-bold text-[#baff02] hover:underline flex items-center">
                    Xem hồ sơ <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
