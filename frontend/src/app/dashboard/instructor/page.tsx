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
            { label: 'Tổng doanh thu', value: stats?.totalRevenue || '0đ', change: 'Real-time', icon: <DollarSign className="text-[#133E2B]" />, bg: 'bg-[#133E2B]/10' },
            { label: 'Tổng học viên', value: stats?.studentCount || 0, change: 'Theo dõi', icon: <Users className="text-blue-600" />, bg: 'bg-blue-50' },
            { label: 'Đánh giá trung bình', value: stats?.averageRating || '4.9/5', change: 'Học viên tin tưởng', icon: <TrendingUp className="text-amber-500" />, bg: 'bg-amber-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E8E3D9] shadow-sm transition-all hover:shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  {stat.icon}
                </div>
                <span className="text-[11px] font-bold text-[#133E2B] bg-[#133E2B]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">{stat.change}</span>
              </div>
              <h4 className="text-2xl lg:text-3xl font-extrabold text-[#1C221F] mb-1">{stat.value}</h4>
              <p className="text-xs text-[#1C221F]/60 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E3D9] shadow-sm">
            <h3 className="text-lg font-bold text-[#1C221F] mb-6">Học viên mới</h3>
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E3D9] group cursor-pointer hover:border-[#133E2B]/30 transition-all">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#133E2B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1C221F] group-hover:text-[#133E2B] transition-colors">{student.name}</p>
                      <p className="text-xs text-[#1C221F]/60 font-normal">Đã tham gia {student.courses} khóa học</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 group-hover:text-[#133E2B] transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E3D9] shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-[#FAF7F2] text-[#133E2B] border border-[#E8E3D9] rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#1C221F] mb-2">Quản lý khóa học</h3>
            <p className="text-xs text-[#1C221F]/60 leading-relaxed mb-6 max-w-sm">
              Bắt đầu xây dựng nội dung mới hoặc chỉnh sửa các khóa học hiện có để tối ưu hóa doanh thu.
            </p>
            <Link href="/dashboard/instructor/courses" className="px-6 py-3 bg-[#133E2B] text-white font-bold rounded-xl hover:bg-[#0F2E1E] transition-all shadow-md text-xs">
              Vào danh sách khóa học
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
