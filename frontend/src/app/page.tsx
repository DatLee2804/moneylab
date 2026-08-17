'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  TrendingUp, 
  Cpu, 
  Rocket, 
  Target, 
  Star, 
  CheckCircle, 
  Shield, 
  Users, 
  Loader2,
  Globe,
  Megaphone,
  Briefcase,
  Layers,
  BookOpen,
  Clock,
  ChevronRight
} from 'lucide-react';
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
    avatar?: string;
  };
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    if (Number(price) === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  // Filter categories
  const categories = [
    { id: 'all', label: 'Tất cả', icon: <Layers size={16} /> },
    { id: 'finance', label: 'Tài chính cá nhân', icon: <TrendingUp size={16} /> },
    { id: 'investment', label: 'Đầu tư', icon: <Target size={16} /> },
    { id: 'ai', label: 'AI & Công nghệ', icon: <Cpu size={16} /> },
    { id: 'business', label: 'Kinh doanh', icon: <Briefcase size={16} /> },
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category?.toLowerCase().includes(selectedCategory.toLowerCase()));

  const featuredCourses = (filteredCourses.length > 0 ? filteredCourses : courses).slice(0, 6);
  
  // Mini course subset (short / beginner / free)
  const miniCourses = courses.filter(c => c.isFree || c.price < 500000 || c.category?.toLowerCase().includes('cơ bản')).slice(0, 3);
  const displayMiniCourses = miniCourses.length > 0 ? miniCourses : courses.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans text-[#1C221F] selection:bg-[#133E2B]/10 selection:text-[#133E2B]">
      {/* Top Banner Tag */}
      <div className="bg-[#133E2B] text-white py-2 px-4 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2">
        <Sparkles size={14} className="animate-pulse" />
        <span>Ưu đãi đặc biệt: Giảm 30% cho học viên mới đăng ký trong tuần này!</span>
        <Link href="/courses" className="underline font-black hover:opacity-80 ml-2">Khám phá ngay →</Link>
      </div>

      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column Text */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#133E2B]/10 text-[#133E2B] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-[#133E2B]" />
                <span>Nền tảng đào tạo Tài chính & AI thực chiến</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C221F] tracking-tight leading-[1.15]">
                Học để hiểu tiền, <br />
                <span className="text-[#133E2B]">Hiểu để đầu tư</span> & <span className="text-[#133E2B]">Ứng dụng AI</span>
              </h1>

              <p className="text-base sm:text-lg text-[#1C221F]/70 font-normal leading-relaxed max-w-xl">
                Khóa học tài chính, AI và kinh doanh thực chiến dành cho người đi làm và chủ doanh nghiệp. Học theo lộ trình rõ ràng, dễ áp dụng ngay vào thực tế.
              </p>

              {/* Stats */}
              <div className="flex items-center space-x-8 py-2 border-y border-[#E8E3D9]">
                <div>
                  <h4 className="text-2xl font-black text-[#133E2B]">10,000+</h4>
                  <p className="text-xs text-[#1C221F]/60 font-semibold uppercase tracking-wider">Học viên tin tưởng</p>
                </div>
                <div className="h-8 w-px bg-[#E8E3D9]"></div>
                <div>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-xl font-black text-[#1C221F]">4.9 / 5</span>
                  </div>
                  <p className="text-xs text-[#1C221F]/60 font-semibold uppercase tracking-wider">Đánh giá chất lượng</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link 
                  href="/courses" 
                  className="px-8 py-4 bg-[#133E2B] text-white font-bold rounded-xl hover:bg-[#0F2E1E] transition-all shadow-lg shadow-[#133E2B]/15 flex items-center space-x-2 group"
                >
                  <span>Khám phá ngay</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#roadmap" 
                  className="px-8 py-4 bg-white text-[#1C221F] font-bold rounded-xl border border-[#E8E3D9] hover:bg-[#FAF7F2] transition-all shadow-sm flex items-center"
                >
                  Xem giới thiệu
                </a>
              </div>
            </motion.div>

            {/* Right Column Image & Floating Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl bg-white p-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/expertgroup/900/675" 
                    alt="Money Lab Experts" 
                    width={900}
                    height={675}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating Dark Box */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#0F2E1E] text-white rounded-2xl shadow-xl border border-[#E8E3D9] flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Lộ trình chuẩn chỉnh</span>
                    <h4 className="text-sm font-bold text-white">Chuyên gia đồng hành 1:1</h4>
                    <p className="text-xs text-emerald-100/70">Học thực chiến & giải đáp thắc mắc 24/7</p>
                  </div>
                  <div className="w-10 h-10 bg-[#133E2B] text-white rounded-xl flex items-center justify-center shrink-0 font-bold shadow-md">
                    <CheckCircle size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CATEGORY FILTER BAR */}
        <section className="border-y border-[#E8E3D9] bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide py-1">
              <span className="text-xs font-bold uppercase text-[#1C221F]/50 tracking-wider shrink-0 mr-2">Danh mục:</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#133E2B] text-white shadow-md'
                      : 'bg-[#FAF7F2] text-[#1C221F] hover:bg-[#E8E3D9]/60'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN FEATURED COURSES GRID */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#133E2B] bg-[#133E2B]/10 px-3 py-1 rounded-full">Khám phá khóa học</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C221F] mt-3">Khóa học nổi bật</h2>
              <p className="text-sm text-[#1C221F]/60 mt-1">Được thiết kế tinh gọn, bám sát thực tế thị trường</p>
            </div>
            <Link 
              href="/courses" 
              className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm font-bold text-[#133E2B] hover:text-[#0F2E1E] group"
            >
              <span>Xem tất cả</span>
              <div className="w-7 h-7 rounded-full bg-[#133E2B]/10 flex items-center justify-center group-hover:bg-[#133E2B] group-hover:text-[#1C221F] transition-all">
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="text-[#133E2B] animate-spin" />
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-[#E8E3D9] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img 
                      src={course.coverImage || 'https://picsum.photos/seed/course/800/500'} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#0F2E1E] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      {course.category || 'Tài chính'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1 text-amber-500 font-bold">
                          <Star size={14} fill="currentColor" />
                          <span>4.9</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#1C221F]/60">1,250+ học viên</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1C221F] group-hover:text-[#133E2B] transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#1C221F]/60 mt-2 line-clamp-2 leading-relaxed">
                        {course.description || 'Khóa học cung cấp kiến thức nền tảng và thực hành ứng dụng trực tiếp.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-between">
                      <div>
                        {course.discountPrice && Number(course.discountPrice) > 0 ? (
                          <div className="flex items-baseline space-x-2">
                            <span className="text-base font-extrabold text-[#133E2B]">{formatPrice(course.discountPrice)}</span>
                            <span className="text-xs text-gray-500 line-through">{formatPrice(course.price)}</span>
                          </div>
                        ) : (
                          <span className="text-base font-extrabold text-[#133E2B]">{formatPrice(course.price)}</span>
                        )}
                      </div>

                      <Link 
                        href={`/courses/${course.id}`} 
                        className="px-4 py-2 bg-[#FAF7F2] text-[#133E2B] text-xs font-bold rounded-xl border border-[#E8E3D9] hover:bg-[#133E2B] hover:text-[#1C221F] hover:border-[#133E2B] transition-all"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E3D9]">
              <p className="text-sm font-semibold text-gray-500">Chưa có khóa học nào thuộc danh mục này.</p>
            </div>
          )}
        </section>

        {/* LEARNING ROADMAP SECTION */}
        <section id="roadmap" className="py-20 bg-white border-y border-[#E8E3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#133E2B] bg-[#133E2B]/10 px-3 py-1 rounded-full">Lộ trình học tập</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C221F] mt-3">Lộ trình rõ ràng, ứng dụng thực tế</h2>
              <p className="text-sm text-[#1C221F]/60 mt-2">Dù bạn là người mới bắt đầu hay muốn nâng cao tay nghề, Money Lab đều có lộ trình tương ứng</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Rocket className="text-[#133E2B]" size={28} />,
                  title: 'Đầu tư & Tài chính cá nhân',
                  desc: 'Quản lý dòng tiền, xây dựng danh mục đầu tư an toàn và tối ưu hóa lợi nhuận thụ động.',
                  linkText: 'Xem chi tiết lộ trình'
                },
                {
                  icon: <Globe className="text-[#133E2B]" size={28} />,
                  title: 'Ứng dụng AI & Công nghệ',
                  desc: 'Làm chủ các công cụ AI thế hệ mới để tự động hóa công việc, thiết kế và lập trình không code.',
                  linkText: 'Khám phá khóa học AI'
                },
                {
                  icon: <Megaphone className="text-[#133E2B]" size={28} />,
                  title: 'Kinh doanh & Marketing thực chiến',
                  desc: 'Xây dựng thương hiệu cá nhân, phát triển kênh bán hàng và tối ưu hóa doanh thu.',
                  linkText: 'Tìm hiểu lộ trình kinh doanh'
                }
              ].map((card, idx) => (
                <div key={idx} className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#E8E3D9] flex flex-col justify-between hover:shadow-lg transition-all">
                  <div>
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#E8E3D9] mb-6">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#1C221F] mb-3">{card.title}</h3>
                    <p className="text-xs text-[#1C221F]/70 leading-relaxed mb-6">{card.desc}</p>
                  </div>
                  <Link href="/courses" className="inline-flex items-center text-xs font-bold text-[#133E2B] hover:underline group">
                    <span>{card.linkText}</span>
                    <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MINI COURSE GRID ("Mini course dành cho người bận rộn") */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#133E2B] bg-[#133E2B]/10 px-3 py-1 rounded-full">Học nhanh 15-30 phút</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C221F] mt-3">Mini course cho người bận rộn</h2>
              <p className="text-sm text-[#1C221F]/60 mt-1">Các bài học ngắn gọn, cô đọng kiến thức cô đọng giải quyết ngay 1 vấn đề</p>
            </div>
            <Link href="/courses" className="mt-4 sm:mt-0 text-sm font-bold text-[#133E2B] hover:underline">
              Xem danh sách mini courses →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayMiniCourses.map((mini, idx) => (
              <div key={mini.id || idx} className="bg-white p-5 rounded-2xl border border-[#E8E3D9] flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <img 
                    src={mini.coverImage || 'https://picsum.photos/seed/mini/200/200'} 
                    alt={mini.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-[#133E2B] bg-[#133E2B]/10 px-2 py-0.5 rounded">Mini Course</span>
                    <div className="flex items-center text-[10px] text-gray-500">
                      <Clock size={12} className="mr-1" />
                      <span>30 phút</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-[#1C221F] line-clamp-1">{mini.title}</h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-[#133E2B]">{formatPrice(mini.price)}</span>
                    <Link href={`/courses/${mini.id}`} className="text-[11px] font-bold text-[#133E2B] bg-[#133E2B] hover:bg-[#a3e000] px-3 py-1 rounded-lg transition-colors">
                      Học ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7-DAY FREE TRIAL CTA BAR */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <div className="bg-[#0F2E1E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between border border-[#E8E3D9] relative overflow-hidden">
            <div className="space-y-3 text-center lg:text-left z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">Bắt đầu trải nghiệm</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Học thử miễn phí trong 7 ngày</h2>
              <p className="text-sm text-emerald-100/80 max-w-xl">
                Truy cập toàn bộ hệ thống bài giảng mẫu, tài nguyên công cụ AI và cộng đồng hỗ trợ mà không tốn chi phí.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 shrink-0 z-10">
              <Link 
                href="/auth/login" 
                className="px-8 py-4 bg-white text-[#0F2E1E] font-bold rounded-xl hover:bg-[#133E2B] transition-colors shadow-lg text-sm inline-block"
              >
                Bắt đầu ngay
              </Link>
            </div>
            {/* Background Accent Circle */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#133E2B] rounded-full blur-2xl opacity-50 pointer-events-none" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

