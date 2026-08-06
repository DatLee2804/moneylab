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
          <Loader2 className="w-10 h-10 text-[#133E2B] animate-spin" />
          <p className="text-xs text-[#1C221F]/60 font-semibold uppercase tracking-wider">Đang đồng bộ lộ trình học tập...</p>
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
            { label: 'Khóa học đang học', value: stats?.totalCourses || 0, icon: <BookOpen className="text-[#133E2B]" />, bg: 'bg-[#133E2B]/10' },
            { label: 'Giờ học tích lũy', value: stats?.studyHours || '0h', icon: <Clock className="text-blue-600" />, bg: 'bg-blue-50' },
            { label: 'Khóa học hoàn thành', value: stats?.completedCourses || 0, icon: <Award className="text-amber-500" />, bg: 'bg-amber-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E8E3D9] shadow-sm flex items-center space-x-5 transition-all hover:shadow-md">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                {stat.icon}
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-[#1C221F]">{stat.value}</h4>
                <p className="text-xs text-[#1C221F]/60 font-medium">{stat.label}</p>
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
                  className="bg-white rounded-2xl border border-[#E8E3D9] shadow-sm overflow-hidden group h-full transition-all hover:shadow-xl"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img 
                      src={enrollment.course.coverImage || 'https://picsum.photos/seed/elearning/1000/600'} 
                      alt={enrollment.course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-[#133E2B] text-white rounded-full flex items-center justify-center shadow-xl">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-0.5 bg-[#133E2B]/10 text-[#133E2B] text-[10px] font-bold rounded uppercase">{enrollment.course.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#1C221F] mb-4 group-hover:text-[#133E2B] transition-colors line-clamp-2 leading-tight">{enrollment.course.title}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-semibold text-[#1C221F]/70">
                        <span>Tiến độ học tập</span>
                        <span className="font-bold text-[#133E2B]">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#FAF7F2] border border-[#E8E3D9] rounded-full overflow-hidden">
                        <div className="h-full bg-[#133E2B] transition-all duration-700" style={{ width: `${enrollment.progress}%` }} />
                      </div>
                      <div className="pt-4 border-t border-[#E8E3D9] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Giảng viên</span>
                            <span className="text-xs font-bold text-[#1C221F] leading-tight">{enrollment.course.instructor.name}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Lộ trình học</span>
                          <div className="px-3 py-1.5 bg-[#133E2B] text-white rounded-lg text-xs font-bold shadow-sm group-hover:bg-[#0F2E1E] transition-all">
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
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E3D9] shadow-sm">
            <div className="w-16 h-16 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E3D9]">
              <BookOpen size={28} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-[#1C221F] mb-1">Bạn chưa tham gia khóa học nào</h3>
            <p className="text-xs text-[#1C221F]/60 font-medium mb-6">Bạn hãy khám phá danh sách khóa học để bắt đầu hành trình mới.</p>
            <Link href="/courses" className="px-6 py-3 bg-[#133E2B] text-white font-bold rounded-xl hover:bg-[#0F2E1E] transition-all shadow-md text-xs">
              Khám phá khóa học
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
