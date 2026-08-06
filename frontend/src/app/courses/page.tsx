'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ChevronDown, BookOpen, Clock, BarChart, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  isFree: boolean;
  coverImage: string;
  category: string;
  instructor?: {
    name: string;
  };
}

export default function CourseCatalog() {
  const categories = ['Tất cả', 'Đầu tư', 'AI & Công nghệ', 'Marketing & Mạng xã hội', 'Vibe Coding', 'Tài chính'];
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'Tất cả' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] transition-colors font-sans text-[#1C221F] selection:bg-[#133E2B]/10 selection:text-[#133E2B]">
      <Navbar />
      
      <main className="flex-grow py-12 lg:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#133E2B]/10 text-[#133E2B] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              <span>Thư viện khóa học</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C221F] mb-3 tracking-tight">Khám phá lộ trình <span className="text-[#133E2B]">thực chiến</span></h1>
            <p className="text-sm text-[#1C221F]/60 max-w-2xl font-normal leading-relaxed">
              Dữ liệu được đồng bộ trực tiếp từ Database. Mỗi khóa học là một bước tiến mới trong sự nghiệp của bạn.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex-grow relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#133E2B] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E8E3D9] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#133E2B]/20 transition-all text-sm font-semibold text-[#1C221F] placeholder:text-gray-500"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                    activeCategory === cat 
                      ? "bg-[#133E2B] text-white shadow-md" 
                      : "bg-white text-[#1C221F] border border-[#E8E3D9] hover:bg-[#E8E3D9]/40"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#133E2B] animate-spin mb-4" />
              <p className="text-xs text-[#1C221F]/60 font-semibold uppercase tracking-wider">Đang tải thư viện khóa học...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E3D9] hover:shadow-xl group flex flex-col h-full transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img 
                      src={course.coverImage || 'https://picsum.photos/seed/trading/1000/600'} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0F2E1E] text-[#1C221F] text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wider">
                      {course.category || 'Tài chính'}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-0.5 bg-[#133E2B]/10 text-[#133E2B] text-[10px] font-bold rounded uppercase">{course.category || 'Khóa học'}</span>
                        <div className="flex items-center text-amber-500">
                          <Star size={13} fill="currentColor" />
                          <span className="ml-1 text-xs font-bold text-[#1C221F]/60">4.9</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-[#1C221F] group-hover:text-[#133E2B] transition-colors leading-snug line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-[#1C221F]/60 font-medium">
                        <span className="flex items-center"><BookOpen size={14} className="mr-1" /> Cơ bản</span>
                        <span className="flex items-center"><Clock size={14} className="mr-1" /> 12h học</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-between">
                      <div>
                        <div className="flex flex-col">
                          {course.isFree || Number(course.price) === 0 ? (
                            <span className="text-base font-extrabold text-[#133E2B]">Khoá học miễn phí</span>
                          ) : course.discountPrice && Number(course.discountPrice) > 0 ? (
                            <>
                              <span className="text-base font-extrabold text-[#133E2B]">{formatPrice(course.discountPrice)}</span>
                              <span className="text-xs text-gray-500 line-through font-normal">{formatPrice(course.price)}</span>
                            </>
                          ) : (
                            <span className="text-base font-extrabold text-[#133E2B]">{formatPrice(course.price)}</span>
                          )}
                        </div>
                      </div>
                      <Link href={`/courses/${course.id}`} className="px-4 py-2 bg-[#FAF7F2] text-[#133E2B] text-xs font-bold rounded-xl border border-[#E8E3D9] hover:bg-[#133E2B] hover:text-[#1C221F] hover:border-[#133E2B] transition-all">
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E3D9] shadow-sm">
              <div className="w-16 h-16 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E3D9]">
                <Search size={28} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-[#1C221F] mb-1">Không tìm thấy khóa học</h3>
              <p className="text-xs text-[#1C221F]/60 font-medium">Hệ thống không tìm thấy kết quả phù hợp với từ khóa tìm kiếm của bạn.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
