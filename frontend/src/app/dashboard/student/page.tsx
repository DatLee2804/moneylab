'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Play,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Enrollment {
  courseId: string;
  progress: number;
  lastAccessed?: string;
  course: {
    id: string;
    title: string;
    coverImage: string;
    category: string;
    instructor: {
      name: string;
      email: string;
    };
  }
}

interface Stats {
  totalCourses: number;
  completedCourses: number;
  studyHours: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsRes, statsRes] = await Promise.all([
          api.get('/enrollments/me'),
          api.get('/dashboard/student/stats')
        ]);
        setEnrollments(enrollmentsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="student" title="Đang tải...">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang đồng bộ lộ trình học tập...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="Khóa học của tôi">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Khóa học đang học', value: stats?.totalCourses || 0, icon: <BookOpen className="text-[#baff02]" />, bg: 'bg-[#baff02]/10' },
            { label: 'Giờ học tích lũy', value: stats?.studyHours || '0h', icon: <Clock className="text-blue-400" />, bg: 'bg-blue-400/10' },
            { label: 'Khóa học hoàn thành', value: stats?.completedCourses || 0, icon: <Award className="text-amber-400" />, bg: 'bg-amber-400/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-sm flex items-center space-x-6 transition-all hover:bg-white/[0.02]">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg)}>
                {stat.icon}
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">{stat.value}</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Courses Grid */}
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enrollment) => (
              <div 
                key={enrollment.courseId}
                onClick={() => router.push(`/courses/${enrollment.course.id}/player`)}
                className="cursor-pointer"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#141414] rounded-[32px] border border-white/5 shadow-sm overflow-hidden group h-full transition-all hover:border-[#baff02]/20"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={enrollment.course.coverImage || 'https://picsum.photos/seed/elearning/1000/600'} 
                      alt={enrollment.course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-[#baff02] text-[#0a0a0a] rounded-full flex items-center justify-center shadow-xl">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-0.5 bg-[#baff02]/10 text-[#baff02] text-[8px] font-black rounded uppercase tracking-widest">{enrollment.course.category}</span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-4 group-hover:text-[#baff02] transition-colors line-clamp-2 leading-tight">{enrollment.course.title}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span>Tiến độ học tập</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#baff02] transition-all duration-700" style={{ width: `${enrollment.progress}%` }} />
                      </div>
                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Giảng viên</span>
                            <span className="text-sm font-black text-white leading-tight">{enrollment.course.instructor.name}</span>
                            <span className="text-[11px] text-gray-400 truncate max-w-[200px]">{enrollment.course.instructor.email}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Lộ trình học</span>
                          <div className="px-3 py-1 bg-[#baff02] text-[#0a0a0a] rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#baff02]/20 group-hover:bg-white transition-all">
                            Tiếp tục học
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#141414] rounded-[40px] border border-white/5 border-dashed">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase">Bạn chưa tham gia khóa học nào</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-8">Bạn hãy khám phá danh sách khóa học để bắt đầu hành trình mới.</p>
            <Link href="/courses" className="px-8 py-4 bg-[#baff02] text-[#0a0a0a] font-black rounded-xl hover:bg-[#8ec401] transition-all shadow-xl shadow-[#baff02]/20 uppercase tracking-widest text-xs">
              Khám phá khóa học
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
