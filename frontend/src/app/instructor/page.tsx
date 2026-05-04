'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ChevronRight, 
  Star,
  Shield,
  CreditCard
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';

export default function InstructorPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="instructor" title="Đang tải...">
        <div className="space-y-8 animate-pulse text-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-[#141414] rounded-3xl border border-white/5"></div>
            ))}
          </div>
          <div className="h-96 bg-[#141414] rounded-[40px] border border-white/5"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor" title="Tổng quan giảng viên">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Tổng doanh thu', value: '45,200,000đ', change: '+12.5%', icon: <DollarSign className="text-[#baff02]" />, bg: 'bg-[#baff02]/10' },
            { label: 'Tổng học viên', value: '1,284', change: '+8.2%', icon: <Users className="text-blue-500" />, bg: 'bg-blue-500/10' },
            { label: 'Đánh giá trung bình', value: '4.9/5', change: 'Ổn định', icon: <TrendingUp className="text-amber-500" />, bg: 'bg-amber-500/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-sm hover:border-[#baff02]/30 transition-all">
              <div className="flex justify-between items-center mb-6">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  {stat.icon}
                </div>
                <span className="text-xs font-black text-[#baff02] bg-[#baff02]/10 px-2 py-1 rounded-lg">{stat.change}</span>
              </div>
              <h4 className="text-3xl font-black text-white mb-1">{stat.value}</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm">
            <h3 className="text-lg font-black text-white mb-8">Học viên mới nhất</h3>
            <div className="space-y-6">
              {[
                { id: 1, name: 'Nguyễn Văn B', email: 'vanb@gmail.com', courses: 2 },
                { id: 2, name: 'Trần Thị C', email: 'thic@gmail.com', courses: 1 },
                { id: 3, name: 'Lê Văn D', email: 'vand@gmail.com', courses: 3 },
              ].map((student) => (
                <div key={student.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#baff02]/10 text-[#baff02] flex items-center justify-center font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[#baff02] transition-colors">{student.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Đã mua {student.courses} khóa học</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 group-hover:text-[#baff02] transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm">
            <h3 className="text-lg font-black text-white mb-8">Đánh giá gần đây</h3>
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="p-6 bg-[#0a0a0a] rounded-3xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Image src={`https://i.pravatar.cc/150?u=review${i}`} width={32} height={32} className="w-8 h-8 rounded-lg object-cover" alt="Student avatar" />
                      <p className="text-xs font-bold text-white">Học viên {i}</p>
                    </div>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                    "Khóa học rất hay và thực tế. Giảng viên hỗ trợ nhiệt tình, kiến thức dễ hiểu."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
