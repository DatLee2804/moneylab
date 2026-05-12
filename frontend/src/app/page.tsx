'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Play, TrendingUp, Cpu, Rocket, Target, Star, CheckCircle, Shield, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import api from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  discountPrice?: number;
  category: string;
  isCombo?: boolean;
  isFree?: boolean;
  students?: number;
  createdAt: string;
  instructor?: {
    name: string;
  };
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses?status=APPROVED');
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const formatPrice = (price: any) => {
    if (Number(price) === 0) return 'Khoá học miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  // Logic to separate courses into categories
  const displayCombo = courses.filter(c => c.isCombo === true).slice(0, 4);

  const bestSelling = [...courses].sort((a, b) => (b.students || 0) - (a.students || 0)).slice(0, 4);

  const displayBeginner = courses.filter(c => c.isFree === true || c.category.toLowerCase().includes('cơ bản')).slice(0, 4);

  const latestCourses = [...courses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  const renderCourseCard = (course: Course, isLight: boolean = false) => (
    <motion.div 
      key={course.id}
      whileHover={{ y: -12 }}
      className={`${isLight ? 'bg-white border-gray-200 shadow-xl' : 'bg-[#1a1a1a] border-white/5 shadow-xl'} rounded-[2rem] overflow-hidden border group flex flex-col h-full`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={course.coverImage || 'https://picsum.photos/seed/course/800/500'} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-[#0a0a0a] text-[10px] font-bold rounded-full shadow-sm">
          HOT
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-2 py-1 bg-[#baff02]/10 text-[#baff02] text-[10px] font-bold rounded uppercase">{course.category}</span>
          <div className="flex items-center text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="ml-1 text-xs font-bold text-gray-400">4.9</span>
          </div>
        </div>
        <h3 className={`text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-3 group-hover:text-[#baff02] transition-colors leading-tight min-h-[3rem] line-clamp-2`}>
          {course.title}
        </h3>
        <div className={`mt-auto pt-5 border-t ${isLight ? 'border-gray-100' : 'border-white/5'} flex items-center justify-between`}>
          <div>
            <div className="flex flex-col">
              {course.discountPrice && Number(course.discountPrice) > 0 ? (
                <>
                  <span className="text-lg font-extrabold text-[#baff02]">{formatPrice(course.discountPrice)}</span>
                  <span className="text-[10px] text-gray-500 line-through font-bold mt-0.5">{formatPrice(course.price)}</span>
                </>
              ) : (
                <span className="text-lg font-extrabold text-[#baff02]">{formatPrice(course.price)}</span>
              )}
            </div>
          </div>
          <Link href={`/courses/${course.id}`} className="px-3 py-2 bg-[#baff02]/10 text-[#baff02] text-[10px] font-bold rounded-xl hover:bg-[#baff02] hover:text-[#0a0a0a] transition-all uppercase tracking-widest">
            Chi tiết
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const renderSection = (title: string, subtitle: string, sectionCourses: Course[], bgClass: string, isLight: boolean = false) => {
    return (
      <section className={`py-20 ${bgClass} transition-colors border-t ${isLight ? 'border-gray-200' : 'border-white/5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <div className="inline-block px-3 py-1 bg-[#baff02]/10 text-[#baff02] text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">Khám phá</div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>{title}</h2>
              <p className={`${isLight ? 'text-gray-600' : 'text-gray-500'} font-light`}>{subtitle}</p>
            </div>
            <Link href="/courses" className="mt-6 md:mt-0 flex items-center text-[#baff02] font-bold hover:text-[#8ec401] transition-colors group text-sm">
              Xem tất cả 
              <div className="ml-2 w-8 h-8 bg-[#baff02]/10 rounded-full flex items-center justify-center group-hover:bg-[#baff02] group-hover:text-[#0a0a0a] transition-all">
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="w-10 h-10 text-[#baff02] animate-spin" />
            </div>
          ) : sectionCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sectionCourses.map(course => renderCourseCard(course, isLight))}
            </div>
          ) : (
            <div className={`text-center py-10 ${isLight ? 'bg-white border-gray-100' : 'bg-[#1a1a1a] border-white/5'} rounded-[2rem] border`}>
              <p className="text-gray-500 font-bold">Chưa có khóa học nào.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] font-sans selection:bg-[#baff02]/30 selection:text-[#baff02]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-[#0a0a0a] py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold mb-8">
                  <Sparkles size={16} />
                  <span>Nền tảng đào tạo Tài chính & AI thực chiến</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8">
                  Làm chủ <span className="text-[#baff02]">Tài chính</span> <br />
                  & Công nghệ <span className="text-[#baff02]">AI</span>
                </h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl">
                  Khóa học tài chính, AI và kinh doanh thực chiến cho người đi làm và chủ doanh nghiệp. Học theo lộ trình rõ ràng, dễ áp dụng ngay.
                </p>
                
                <div className="flex flex-wrap gap-5">
                  <Link href="/courses" className="px-10 py-5 bg-[#baff02] text-[#0a0a0a] font-black rounded-2xl hover:bg-[#8ec401] transition-all shadow-2xl shadow-[#baff02]/20 active:scale-95 flex items-center">
                    Bắt đầu học ngay
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                  <button className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center group">
                    Xem lộ trình
                  </button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-[#141414]">
                    <Image 
                    src="https://picsum.photos/seed/business/1000/600" 
                    alt="Money Lab Learning" 
                    width={1000}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Khóa học mới</p>
                        <h3 className="text-white text-xl font-bold">Xây Dựng Website Bằng AI</h3>
                      </div>
                      <div className="w-12 h-12 bg-[#baff02] rounded-2xl flex items-center justify-center text-[#0a0a0a] shadow-lg">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 1. Combo Courses */}
        {renderSection('Khóa học Combo', 'Tiết kiệm chi phí với các bộ khóa học được thiết kế chuẩn xác', displayCombo, 'bg-gray-100', true)}

        {/* 2. Best Selling */}
        {renderSection('Khóa học bán chạy nhất', 'Những khóa học được học viên lựa chọn nhiều nhất trong tháng', bestSelling, 'bg-[#0a0a0a]', false)}

        {/* 3. Beginner Courses */}
        {renderSection('Khóa học cho người mới', 'Xây dựng nền tảng vững chắc từ con số 0', displayBeginner, 'bg-gray-100', true)}

        {/* 4. Latest Courses */}
        {renderSection('Khóa học mới nhất', 'Cập nhật xu hướng và kiến thức công nghệ, tài chính mới nhất', latestCourses, 'bg-[#0a0a0a]', false)}

        {/* Why Choose Section */}
        <section className="py-24 bg-gray-100 border-t border-gray-200 text-gray-900 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-extrabold mb-8 leading-tight">Tại sao chọn <br /><span className="text-[#8ec401] drop-shadow-sm">Money Lab?</span></h2>
                <div className="space-y-8">
                  {[
                    { title: 'Kiến thức thực chiến', desc: 'Nội dung được đúc kết từ kinh nghiệm thực tế, không lý thuyết suông.', icon: <CheckCircle className="text-[#8ec401]" /> },
                    { title: 'Cộng đồng hỗ trợ', desc: 'Tham gia cộng đồng học viên năng động, hỗ trợ giải đáp thắc mắc 24/7.', icon: <Users className="text-[#8ec401]" /> },
                    { title: 'Chứng nhận hoàn thành', desc: 'Nhận chứng chỉ uy tín sau khi hoàn thành khóa học và bài kiểm tra.', icon: <Shield className="text-[#8ec401]" /> },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-5">
                      <div className="mt-1">{item.icon}</div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl">
                  <div className="grid grid-cols-2 gap-8">
                    {[
                      { label: 'Học viên', value: '10K+' },
                      { label: 'Khóa học', value: '50+' },
                      { label: 'Giảng viên', value: '20+' },
                      { label: 'Tỉ lệ hài lòng', value: '98%' },
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <h3 className="text-4xl font-extrabold text-[#8ec401] mb-2 drop-shadow-sm">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
