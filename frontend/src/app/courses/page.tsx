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
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] transition-colors font-sans selection:bg-[#baff02]/30 selection:text-[#baff02]">
      <Navbar />
      
      <main className="flex-grow py-12 lg:py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#baff02]/10 text-[#baff02] text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              <span>Thư viện khóa học</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-4 uppercase tracking-tight">Khám phá lộ trình <span className="text-[#baff02]">thực chiến</span></h1>
            <p className="text-gray-500 max-w-2xl font-bold uppercase tracking-widest text-[10px]">
              Dữ liệu được đồng bộ trực tiếp từ Database. Mỗi khóa học là một bước tiến mới trong sự nghiệp của bạn.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex-grow relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#baff02] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-white/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 transition-all font-black text-white placeholder:text-gray-700"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                    activeCategory === cat 
                      ? "bg-[#baff02] text-[#0a0a0a] shadow-lg shadow-[#baff02]/20" 
                      : "bg-[#141414] text-gray-500 border border-white/5 hover:border-[#baff02]/30"
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
              <Loader2 className="w-12 h-12 text-[#baff02] animate-spin mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải thư viện khóa học...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCourses.map((course) => (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -12 }}
                  className="bg-[#141414] rounded-[2.5rem] overflow-hidden shadow-xl border border-white/5 group flex flex-col h-full transition-all hover:border-[#baff02]/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={course.coverImage || 'https://picsum.photos/seed/trading/1000/600'} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#0a0a0a]/80 backdrop-blur-md text-[#baff02] text-[9px] font-black rounded-full shadow-sm border border-white/10 uppercase tracking-widest">
                      Database Live
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-2 py-1 bg-[#baff02]/10 text-[#baff02] text-[9px] font-black rounded uppercase tracking-widest">{course.category}</span>
                      <div className="flex items-center text-amber-400">
                        <Star size={12} fill="currentColor" />
                        <span className="ml-1 text-[10px] font-black text-gray-500 uppercase tracking-widest">4.9</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-[#baff02] transition-colors leading-tight line-clamp-2 uppercase tracking-tight">
                      {course.title}
                    </h3>
                    <div className="flex items-center space-x-4 mb-6 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      <span className="flex items-center"><BookOpen size={14} className="mr-1" /> Cơ bản</span>
                      <span className="flex items-center"><Clock size={14} className="mr-1" /> 12h học</span>
                    </div>
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">Học phí</p>
                        <div className="flex flex-col">
                          {course.isFree || Number(course.price) === 0 ? (
                            <span className="text-xl font-black text-[#baff02]">Khoá học miễn phí</span>
                          ) : course.discountPrice && Number(course.discountPrice) > 0 ? (
                            <>
                              <span className="text-xl font-black text-[#baff02]">{formatPrice(course.discountPrice)}</span>
                              <span className="text-[10px] text-gray-500 line-through font-bold mt-0.5">{formatPrice(course.price)}</span>
                            </>
                          ) : (
                            <span className="text-xl font-black text-[#baff02]">{formatPrice(course.price)}</span>
                          )}
                        </div>
                      </div>
                      <Link href={`/courses/${course.id}`} className="px-5 py-2.5 bg-[#baff02]/10 text-[#baff02] text-[10px] font-black rounded-xl hover:bg-[#baff02] hover:text-[#0a0a0a] transition-all uppercase tracking-widest">
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#141414] rounded-[40px] border border-white/5 border-dashed">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-700" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Không tìm thấy khóa học</h3>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Hệ thống không tìm thấy kết quả phù hợp với bộ lọc hiện tại.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
