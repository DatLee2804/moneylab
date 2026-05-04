'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  ChevronRight, 
  Star,
  Loader2,
  BookOpen
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

interface InstructorStats {
  totalRevenue: string;
  studentCount: number;
  averageRating: string;
}

export default function InstructorDashboard() {
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [students] = useState<any[]>([
    { id: 1, name: 'Nguyễn Văn B', email: 'vanb@gmail.com', courses: 2, joined: '2024-03-15', progress: '85%' },
    { id: 2, name: 'Trần Thị C', email: 'thic@gmail.com', courses: 1, joined: '2024-03-18', progress: '40%' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/instructor/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch instructor stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="instructor" title="Đang tải...">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang đồng bộ thu nhập và học viên...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor" title="Tổng quan giảng viên">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Tổng doanh thu', value: stats?.totalRevenue || '0đ', change: 'Real-time', icon: <DollarSign className="text-[#baff02]" />, bg: 'bg-[#baff02]/10' },
            { label: 'Tổng học viên', value: stats?.studentCount || 0, change: 'Theo dõi', icon: <Users className="text-blue-500" />, bg: 'bg-blue-500/10' },
            { label: 'Đánh giá trung bình', value: stats?.averageRating || '4.9/5', change: 'Học viên tin tưởng', icon: <TrendingUp className="text-amber-500" />, bg: 'bg-amber-500/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-sm transition-all hover:shadow-xl hover:border-[#baff02]/20">
              <div className="flex justify-between items-center mb-6">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-[#baff02] bg-[#baff02]/10 px-2 py-1 rounded-lg uppercase tracking-widest">{stat.change}</span>
              </div>
              <h4 className="text-3xl font-black text-white mb-1">{stat.value}</h4>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm">
            <h3 className="text-lg font-black text-white mb-8 uppercase tracking-tight">Học viên mới (Dữ liệu mẫu)</h3>
            <div className="space-y-6">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#baff02]/10 text-[#baff02] flex items-center justify-center font-black">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white group-hover:text-[#baff02] transition-colors">{student.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Đã tham gia {student.courses} khóa học</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-700 group-hover:text-[#baff02] transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#baff02]/10 text-[#baff02] rounded-full flex items-center justify-center mb-6">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Quản lý khóa học</h3>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-relaxed mb-8">
              Bắt đầu xây dựng nội dung mới hoặc chỉnh sửa các khóa học hiện có để tối ưu hóa doanh thu.
            </p>
            <Link href="/dashboard/instructor/courses" className="px-8 py-4 bg-[#baff02] text-[#0a0a0a] font-black rounded-xl hover:bg-[#8ec401] transition-all shadow-xl shadow-[#baff02]/20 uppercase tracking-widest text-[10px]">
              Vào danh sách khóa học
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
