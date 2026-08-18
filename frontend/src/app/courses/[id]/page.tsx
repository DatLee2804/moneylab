'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Star, Users, Clock, Globe, CheckCircle, 
  ChevronDown, Share2, Heart, BookOpen, Shield, 
  Award, MessageCircle, Lock, Loader2, Sparkles,
  ChevronRight, Calendar, BarChart, HardDrive, Smartphone,
  Facebook, Twitter, Link as LinkIcon, Mail, Plus
} from 'lucide-react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/utils/utils';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  isPreview: boolean;
  order: number;
  content?: string;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  specialization?: string;
}

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  introVideoUrl?: string;
  coverImage: string;
  price: number;
  discountPrice?: number;
  isFree: boolean;
  category: string;
  instructorId: string;
  instructor?: UserProfile;
  sections: Section[];
  reviews?: Review[];
  totalDuration: number;
  totalLessons: number;
  displayStudents: number;
  isCombo?: boolean;
  includedCourses?: any[];
}

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>([]);
  
  const { user } = useAuthStore();
  const userRole = user?.role;
  const userId = user?.id;
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Randomize rating once per mount
  const randomRating = useMemo(() => (4.5 + Math.random() * 0.5).toFixed(1), []);
  const randomReviewCount = useMemo(() => Math.floor(Math.random() * 50) + 10, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${params.id}`);
        setCourse(response.data);
        // Open first section by default
        if (response.data.sections?.length > 0) {
          setOpenSections([response.data.sections[0].id]);
        }
      } catch (error) {
        console.error('Failed to fetch course detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchCourse();
  }, [params.id]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && user && course && !isEnrolling) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'enroll') {
        router.replace(`/courses/${course.id}`);
        setTimeout(() => {
          handleEnroll();
        }, 500);
      }
    }
  }, [user, course, isEnrolling]);

  const handleEnroll = async () => {
    if (!course || isEnrolling) return;

    if (!user) {
      localStorage.setItem('postAuthAction', JSON.stringify({
        action: 'enroll',
        courseId: course.id,
        redirectUrl: `/courses/${course.id}`
      }));
      router.push('/auth/login');
      return;
    }

    if (userRole?.toUpperCase() === 'INSTRUCTOR' && userId === course.instructorId) {
      alert("Bạn là giảng viên của khoá học này.");
      router.push(`/dashboard/instructor`);
      return;
    }

    if (userRole?.toUpperCase() === 'MANAGER' || userRole?.toUpperCase() === 'ADMIN') {
      router.push(`/courses/${course.id}/player`);
      return;
    }
    
    setIsEnrolling(true);
    try {
      if (course.isFree) {
        await api.post(`/enrollments/join/${course.id}`);
        router.push('/dashboard/student');
      } else {
        const res = await api.post('/financial/momo-pay', { courseId: course.id });
        if (res.data.payUrl) {
          console.log("--- Official MoMo PayUrl Generated ---");
          console.log(res.data.payUrl);
          window.location.href = res.data.payUrl;
        } else {
          alert('Không thể tạo liên kết thanh toán MoMo. Vui lòng thử lại sau.');
          setIsEnrolling(false);
        }
      }
    } catch (error: any) {
      console.error("Cannot enroll:", error);
      if (error.response?.status === 409) {
        router.push(`/courses/${course.id}/player`);
      } else {
        alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        setIsEnrolling(false);
      }
    }
  };

  const handleConfirmTransfer = () => {
    alert("Cảm ơn bạn! Hệ thống đang kiểm tra giao dịch của bạn. Vui lòng đợi trong giây lát.");
    setPaymentData(null);
    router.push('/dashboard/student');
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  const formatDuration = (minutes: number) => {
    const hours = (minutes / 60).toFixed(1);
    return `${hours} giờ`;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${id}&playsinline=1`;
    }
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#1C221F] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải nội dung...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-[#1C221F] text-2xl font-bold">Không tìm thấy khóa học</h2>
        <Link href="/courses" className="mt-4 text-[#1C221F] hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1C221F] selection:bg-[#133E2B]/30 selection:text-[#1C221F] font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Top Banner / Breadcrumbs */}
      <div className="bg-[#FAF7F2] border-b border-[#E8E3D9] py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-xs font-bold text-gray-500">
          <Link href="/" className="hover:text-[#133E2B] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link href="/courses" className="hover:text-[#133E2B] transition-colors">Khóa học</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 line-clamp-1">{course.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT CONTENT (8 columns) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. Media Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-[#E8E3D9] bg-[#111111] shadow-2xl group"
            >
              {course.introVideoUrl ? (
                course.introVideoUrl.includes('youtube.com') || course.introVideoUrl.includes('youtu.be') || course.introVideoUrl.includes('drive.google.com') ? (
                  <iframe 
                    src={getEmbedUrl(course.introVideoUrl) || ''} 
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={course.introVideoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )
              ) : (
                <Image 
                  src={course.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000'} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="Cover" 
                />
              )}
            </motion.div>

            {/* 2. Headline Section */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight">
                {course.title}
              </h1>
              {course.shortDescription && (
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                  {course.shortDescription}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[#1C221F] text-lg font-black">{randomRating}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(Number(randomRating)) ? "currentColor" : "none"} />)}
                  </div>
                  <span className="text-gray-500 text-xs font-bold">({randomReviewCount} đánh giá)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Users size={16} />
                  <span className="text-sm font-bold">{course.displayStudents} học viên</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-[#E8E3D9]">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-gray-500">
                    <Play size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase">Bài học</p>
                    <p className="text-xs font-bold">{course.totalLessons} bài học</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-gray-500">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase">Thời gian</p>
                    <p className="text-xs font-bold">{formatDuration(course.totalDuration)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-gray-500">
                    <BarChart size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase">Trình độ</p>
                    <p className="text-xs font-bold">Mọi trình độ</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-gray-500">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase">Ngôn ngữ</p>
                    <p className="text-xs font-bold">Tiếng Việt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Giới thiệu khoá học */}
            <div className="bg-[#FAF7F2] rounded-[2rem] p-8 lg:p-10 border border-[#E8E3D9]">
              <h3 className="text-xl font-black mb-6 flex items-center space-x-3">
                <div className="w-1.5 h-6 bg-[#133E2B] rounded-full" />
                <span>Giới thiệu khoá học</span>
              </h3>
              <div 
                className="prose max-w-none text-gray-600 font-medium leading-[1.8] text-sm course-description-content"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            <style jsx global>{`
              .course-description-content * {
                color: #4b5563 !important;
              }
              .course-description-content strong, 
              .course-description-content h1, 
              .course-description-content h2, 
              .course-description-content h3 {
                color: #1C221F !important;
              }
            `}</style>

            {/* 4. Khoá học bao gồm */}
            <div className="bg-[#FAF7F2] rounded-[2rem] p-8 lg:p-10 border border-[#E8E3D9]">
              <h3 className="text-xl font-black mb-8 flex items-center space-x-3">
                <div className="w-1.5 h-6 bg-[#133E2B] rounded-full" />
                <span>Khoá học bao gồm</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="flex items-center space-x-4 text-gray-700">
                  <Play size={20} className="text-[#133E2B]" />
                  <span className="text-sm font-bold">{course.totalLessons} bài học video</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-700">
                  <Clock size={20} className="text-[#133E2B]" />
                  <span className="text-sm font-bold">{formatDuration(course.totalDuration)} nội dung</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-700">
                  <Shield size={20} className="text-[#133E2B]" />
                  <span className="text-sm font-bold">Truy cập trọn đời</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-700">
                  <Smartphone size={20} className="text-[#133E2B]" />
                  <span className="text-sm font-bold">Xem trên mọi thiết bị</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-700">
                  <Award size={20} className="text-[#133E2B]" />
                  <span className="text-sm font-bold">Cấp chứng chỉ hoàn thành</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-700">
                  <MessageCircle size={20} className="text-[#133E2B]" />
                  <span className="text-sm font-bold">Hỗ trợ giảng viên 24/7</span>
                </div>
              </div>
            </div>

            {/* 5. Nội dung / Combo */}
            {course.isCombo ? (
              <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <h3 className="text-xl font-black flex items-center space-x-3">
                    <div className="w-1.5 h-6 bg-[#133E2B] rounded-full" />
                    <span>Các khóa học trong Combo này</span>
                  </h3>
                  <span className="text-xs font-bold text-gray-500">{course.includedCourses?.length || 0} khóa học</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.includedCourses?.map((included: any) => (
                    <Link href={`/courses/${included.id}`} key={included.id} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E3D9] flex items-center space-x-4 hover:border-[#133E2B]/50 transition-colors group">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {included.coverImage ? (
                          <Image src={included.coverImage} fill className="object-cover group-hover:scale-105 transition-transform" alt={included.title} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500"><Play size={20} /></div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-[#1C221F] line-clamp-1 group-hover:text-[#133E2B] transition-colors">{included.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-1">{included.instructor?.name}</p>
                        <div className="mt-2 flex items-baseline space-x-2">
                          <span className="text-xs font-bold text-[#1C221F]">{included.discountPrice ? formatPrice(included.discountPrice) : formatPrice(included.price)}</span>
                          {included.discountPrice && Number(included.discountPrice) > 0 && (
                            <span className="text-[10px] text-gray-500 line-through">{formatPrice(included.price)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <h3 className="text-xl font-black flex items-center space-x-3">
                    <div className="w-1.5 h-6 bg-[#133E2B] rounded-full" />
                    <span>Nội dung khoá học</span>
                  </h3>
                  <span className="text-xs font-bold text-gray-500">{course.sections?.length || 0} chương • {course.totalLessons} bài học</span>
                </div>

                <div className="space-y-4">
                  {course.sections?.map((section, idx) => (
                    <div 
                      key={section.id} 
                      className={cn(
                        "bg-[#FAF7F2] rounded-3xl border border-[#E8E3D9] overflow-hidden transition-all",
                        openSections.includes(section.id) ? "ring-1 ring-[#133E2B]/20" : ""
                      )}
                    >
                      <button 
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-6 hover:bg-[#133E2B]/5 transition-colors group"
                      >
                        <div className="flex items-center space-x-4 text-left">
                          <div className="w-8 h-8 rounded-xl bg-[#133E2B]/10 flex items-center justify-center text-[10px] font-black text-[#133E2B] group-hover:bg-[#133E2B] group-hover:text-white transition-all">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-black group-hover:text-[#133E2B] transition-colors">{section.title}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{section.lessons.length} bài học</p>
                          </div>
                        </div>
                        <ChevronDown 
                          size={18} 
                          className={cn("text-gray-500 transition-transform duration-300", openSections.includes(section.id) && "rotate-180 text-[#133E2B]")} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {openSections.includes(section.id) && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[#E8E3D9] divide-y divide-[#E8E3D9]"
                          >
                            {section.lessons.map((lesson, lIdx) => (
                              <div 
                                key={lesson.id} 
                                onClick={() => {
                                  if (course.isFree || lesson.isPreview) {
                                    window.location.href = `/courses/${course.id}/player?lessonId=${lesson.id}`;
                                  }
                                }}
                                className={cn(
                                  "p-5 pl-8 flex items-center justify-between group transition-colors",
                                  (course.isFree || lesson.isPreview) ? "cursor-pointer hover:bg-[#133E2B]/5" : "cursor-not-allowed opacity-50"
                                )}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="text-gray-600">
                                    {lesson.isPreview || course.isFree ? <Play size={14} fill="currentColor" className="text-[#133E2B]" /> : <Lock size={14} />}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-700">{lesson.title}</span>
                                    {(lesson.isPreview || course.isFree) && (
                                      <span className="text-[9px] text-[#133E2B] font-black uppercase tracking-widest mt-0.5">
                                        {course.isFree ? 'Miễn phí' : 'Học thử miễn phí'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-bold">{lesson.duration || 0} phút</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Giảng viên */}
            <div className="bg-[#FAF7F2] rounded-[2rem] p-10 border border-[#E8E3D9]">
              <h3 className="text-xl font-black mb-10 flex items-center space-x-3">
                <div className="w-1.5 h-6 bg-[#133E2B] rounded-full" />
                <span>Thông tin giảng viên</span>
              </h3>
              
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-[#133E2B]/20">
                    <Image src={course.instructor?.avatar || 'https://i.pravatar.cc/300'} fill className="object-cover" alt="Instructor" />
                  </div>
                  <div className="mt-4 flex justify-center space-x-3 text-gray-500">
                    <Facebook size={16} className="hover:text-[#133E2B] cursor-pointer" />
                    <Twitter size={16} className="hover:text-[#133E2B] cursor-pointer" />
                    <LinkIcon size={16} className="hover:text-[#133E2B] cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-[#1C221F]">{course.instructor?.name || 'Money Lab Team'}</h4>
                  <p className="text-xs font-black text-[#1C221F]/60 uppercase tracking-widest">{course.instructor?.specialization || 'Chuyên gia đào tạo AI & Business'}</p>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                    {course.instructor?.bio || "Một dự án từ Money Studio nhầm chia sẻ những kiến thức mới nhất hiện nay."}
                  </p>
                  <div className="flex space-x-8 pt-4">
                    <div className="text-center">
                      <p className="text-lg font-black">{randomRating}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase">Đánh giá</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black">{randomReviewCount}+</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase">Học viên</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black">{course.totalLessons}+</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase">Bài học</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Đánh giá từ học viên */}
            <div className="space-y-8">
              <h3 className="text-xl font-black flex items-center space-x-3">
                <div className="w-1.5 h-6 bg-[#133E2B] rounded-full" />
                <span>Cảm nhận của học viên</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(course.reviews && course.reviews.length > 0) ? course.reviews.map(review => (
                  <div key={review.id} className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8E3D9] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#133E2B]/10 relative overflow-hidden">
                          <Image src={review.user?.avatar || 'https://i.pravatar.cc/100'} fill alt="Reviewer" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{review.user?.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{review.content}"</p>
                  </div>
                )) : (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8E3D9] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-[#133E2B]/10 relative overflow-hidden">
                            <Image src={`https://i.pravatar.cc/100?u=${i}`} fill alt="Reviewer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{['Tiến Dũng', 'Minh Anh', 'Hương Giang', 'Quốc Bảo'][i]}</p>
                            <p className="text-[10px] text-gray-500 font-bold">Vừa xong</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed italic">
                        {[
                          "Khoá học cực kỳ thực chiến, giúp mình áp dụng AI vào công việc ngay lập tức.",
                          "Giảng viên giải thích rất dễ hiểu, lộ trình rõ ràng, đáng tiền lắm mọi người ơi.",
                          "Chưa bao giờ học khoá nào mà thấy kiến thức được update liên tục như ở đây.",
                          "Đỉnh của chóp! AI không còn là điều gì đó xa lạ nữa sau khi học xong."
                        ][i]}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (4 columns) - Sticky Enrollment Card */}
          <div className="lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-[#E8E3D9] shadow-2xl overflow-hidden">
                <div className="p-8 lg:p-10 space-y-8">
                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Học phí đầu tư</p>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-baseline space-x-4">
                        {course.isFree || Number(course.price) === 0 ? (
                          <span className="text-4xl font-black text-[#1C221F]">MIỄN PHÍ</span>
                        ) : (
                          <>
                            <span className="text-4xl font-black text-[#1C221F]">
                              {course.discountPrice && Number(course.discountPrice) > 0 ? formatPrice(course.discountPrice) : formatPrice(course.price)}
                            </span>
                            {course.discountPrice && Number(course.discountPrice) > 0 && (
                              <span className="text-lg text-gray-500 line-through font-bold opacity-60">{formatPrice(course.price)}</span>
                            )}
                          </>
                        )}
                      </div>
                      {!course.isFree && course.discountPrice && Number(course.discountPrice) > 0 && (
                        <p className="text-[11px] text-rose-500 font-black uppercase tracking-wider animate-pulse">
                          Tiết kiệm ngay {formatPrice(Number(course.price) - Number(course.discountPrice))}
                        </p>
                      )}
                    </div>
                  </div>

                      <div className="space-y-4">
                        <button 
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                          className={cn(
                            "w-full py-5 font-black rounded-2xl transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3",
                            isEnrolling 
                              ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-[#E8E3D9]" 
                              : "bg-[#133E2B] text-white hover:bg-[#8ec401] shadow-[#133E2B]/20"
                          )}
                        >
                          {isEnrolling ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#1C221F]" />
                          ) : (
                            <PlusIcon size={18} className="hidden" />
                          )}
                          <span>{isEnrolling ? 'ĐANG XỬ LÝ...' : (userRole?.toUpperCase() === 'MANAGER' || userRole?.toUpperCase() === 'ADMIN' ? 'QUẢN LÝ KHÓA HỌC' : (course.isFree ? 'THAM GIA NGAY' : 'ĐĂNG KÝ HỌC'))}</span>
                        </button>
                        <p className="text-center text-[10px] text-gray-500 font-bold">Cam kết chất lượng • Hoàn trả nếu không hài lòng</p>
                      </div>

                      <div className="space-y-5 pt-4 border-t border-[#E8E3D9]">
                        <div className="flex items-center justify-between text-gray-500">
                          <div className="flex items-center space-x-3">
                            <BookOpen size={16} />
                            <span className="text-xs font-bold">Bài học</span>
                          </div>
                          <span className="text-xs font-black text-[#1C221F]">{course.totalLessons}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <div className="flex items-center space-x-3">
                            <Clock size={16} />
                            <span className="text-xs font-bold">Thời lượng</span>
                          </div>
                          <span className="text-xs font-black text-[#1C221F]">{formatDuration(course.totalDuration)}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <div className="flex items-center space-x-3">
                            <Smartphone size={16} />
                            <span className="text-xs font-bold">Nền tảng</span>
                          </div>
                          <span className="text-xs font-black text-[#1C221F]">All devices</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <div className="flex items-center space-x-3">
                            <Shield size={16} />
                            <span className="text-xs font-bold">Truy cập</span>
                          </div>
                          <span className="text-xs font-black text-[#1C221F]">Vĩnh viễn</span>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-center space-x-6 text-gray-500 border-t border-[#E8E3D9]">
                        <button className="flex items-center space-x-2 hover:text-[#1C221F] transition-colors">
                          <Share2 size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Chia sẻ</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                          <Heart size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Yêu thích</span>
                        </button>
                      </div>
                </div>
              </div>

              {/* Secure Info Card */}
              <div className="bg-[#133E2B]/5 border border-[#133E2B]/20 rounded-3xl p-6 flex items-start space-x-4">
                <Shield size={24} className="text-[#1C221F] flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-[#1C221F] uppercase tracking-widest">Thanh toán bảo mật</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Hệ thống thanh toán MoMo mã hoá SSL 128-bit, đảm bảo tuyệt đối thông tin giao dịch của bạn.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function PlusIcon({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
