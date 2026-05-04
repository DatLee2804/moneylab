'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Award, BookOpen, Star, ChevronRight, Search, Filter, Globe, Twitter, Linkedin, Users, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Instructor {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  email: string;
  phone?: string;
  summary?: string;
  rating?: number;
  studentsCount?: number;
  coursesCount?: number;
}

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Tất cả', 'AI', 'Đầu Tư', 'Marketing', 'Tài chính', 'Lập trình', 'Kinh doanh'];

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await api.get('/users/public/instructors');
        setInstructors(response.data);
      } catch (error) {
        console.error('Failed to fetch instructors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (inst.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getAvatarUrl = (avatar?: string, id?: string) => {
    if (!avatar) return `https://i.pravatar.cc/400?u=${id}`;
    if (avatar.startsWith('http')) return avatar;
    return `${API_URL}${avatar}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] transition-colors font-sans selection:bg-[#baff02]/30 selection:text-[#baff02]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[#baff02]/5 -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-4 py-1.5 bg-[#baff02]/10 text-[#baff02] text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
                  Đội ngũ chuyên gia
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
                  Học từ những <span className="text-[#baff02]">Giảng viên</span> hàng đầu
                </h1>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed font-bold">
                  Dữ liệu giảng viên được lấy trực tiếp từ hệ thống của bạn. Đây là những chuyên gia thực chiến nhất.
                </p>
              </motion.div>

              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm giảng viên..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-white/10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 transition-all font-bold text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructors Grid */}
        <section className="py-20 lg:py-32 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#baff02] animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải danh sách chuyên gia...</p>
              </div>
            ) : filteredInstructors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {filteredInstructors.map((inst, idx) => (
                  <motion.div
                    key={inst.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-[#141414] rounded-[32px] border border-white/5 shadow-sm hover:shadow-2xl hover:border-[#baff02]/20 transition-all overflow-hidden group"
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      {/* Left: Avatar */}
                      <div className="sm:w-2/5 relative">
                        <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                          <img 
                            src={getAvatarUrl(inst.avatar, inst.id)} 
                            alt={inst.name} 
                            className="w-full h-full object-cover aspect-square sm:aspect-auto"
                          />
                        </div>
                      </div>

                      {/* Right: Info */}
                      <div className="sm:w-3/5 p-8 flex flex-col">
                        <div className="mb-6">
                          <h3 className="text-2xl font-black text-white mb-1 group-hover:text-[#baff02] transition-colors uppercase tracking-tight">{inst.name}</h3>
                          <p className="text-xs text-[#baff02] font-black uppercase tracking-widest">{inst.title || 'Giảng viên chuyên nghiệp'}</p>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed font-bold italic">
                          "{inst.summary || `${inst.name} là giảng viên giàu kinh nghiệm tại Money Lab, luôn tận tâm hỗ trợ học viên chinh phục kiến thức mới.`}"
                        </p>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-amber-500">
                              < Star size={14} fill="currentColor" />
                              <span className="text-xs font-black">4.9</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Users size={14} />
                              <span className="text-[10px] font-black">{(inst as any).studentsCount || 1240}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <BookOpen size={14} />
                              <span className="text-[10px] font-black">{(inst as any).coursesCount || 5}</span>
                            </div>
                          </div>
                          <Link href="/courses" className="w-10 h-10 bg-[#0a0a0a] border border-white/5 text-gray-500 hover:text-[#0a0a0a] hover:bg-[#baff02] rounded-xl flex items-center justify-center transition-all shadow-sm">
                            <ChevronRight size={20} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#141414] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-700" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Không tìm thấy giảng viên</h3>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Vui lòng thử lại với từ khóa khác.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}