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
    <div className="min-h-screen bg-[#FAF7F2] transition-colors font-sans text-[#1C221F] selection:bg-[#133E2B]/10 selection:text-[#133E2B]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 border-b border-[#E8E3D9] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-4 py-1.5 bg-[#133E2B]/10 text-[#133E2B] text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                  Đội ngũ chuyên gia
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C221F] mb-4 tracking-tight">
                  Học từ những <span className="text-[#133E2B]">Giảng viên</span> hàng đầu
                </h1>
                <p className="text-base text-[#1C221F]/60 mb-8 leading-relaxed font-normal">
                  Đội ngũ giảng viên giàu kinh nghiệm thực chiến, sẵn sàng đồng hành cùng bạn trong từng chặng đường.
                </p>
              </motion.div>

              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm giảng viên..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF7F2] border border-[#E8E3D9] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#133E2B]/20 transition-all font-semibold text-[#1C221F] text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructors Grid */}
        <section className="py-16 lg:py-24 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#133E2B] animate-spin mb-4" />
                <p className="text-xs text-[#1C221F]/60 font-semibold uppercase tracking-wider">Đang tải danh sách chuyên gia...</p>
              </div>
            ) : filteredInstructors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredInstructors.map((inst, idx) => (
                  <motion.div
                    key={inst.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-white rounded-2xl border border-[#E8E3D9] shadow-sm hover:shadow-xl hover:border-[#133E2B]/20 transition-all overflow-hidden group"
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      {/* Left: Avatar */}
                      <div className="sm:w-2/5 relative bg-[#FAF7F2]">
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                          <img 
                            src={getAvatarUrl(inst.avatar, inst.id)} 
                            alt={inst.name} 
                            className="w-full h-full object-cover aspect-square sm:aspect-auto group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>

                      {/* Right: Info */}
                      <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                          <div className="mb-3">
                            <h3 className="text-xl font-extrabold text-[#1C221F] mb-1 group-hover:text-[#133E2B] transition-colors tracking-tight">{inst.name}</h3>
                            <p className="text-xs text-[#133E2B] font-bold uppercase tracking-wider">{inst.title || 'Giảng viên chuyên nghiệp'}</p>
                          </div>

                          <p className="text-xs text-[#1C221F]/70 line-clamp-3 mb-6 leading-relaxed italic">
                            "{inst.summary || `${inst.name} là giảng viên giàu kinh nghiệm tại Money Lab, luôn tận tâm hỗ trợ học viên chinh phục kiến thức mới.`}"
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-amber-500">
                              <Star size={14} fill="currentColor" />
                              <span className="text-xs font-bold text-[#1C221F]">4.9</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[#1C221F]/60">
                              <Users size={14} />
                              <span className="text-xs font-semibold">{(inst as any).studentsCount || 1240}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[#1C221F]/60">
                              <BookOpen size={14} />
                              <span className="text-xs font-semibold">{(inst as any).coursesCount || 5}</span>
                            </div>
                          </div>
                          <Link href="/courses" className="w-9 h-9 bg-[#FAF7F2] border border-[#E8E3D9] text-[#133E2B] hover:bg-[#133E2B] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm">
                            <ChevronRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E3D9]">
                <div className="w-16 h-16 bg-[#FAF7F2] border border-[#E8E3D9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-[#1C221F] mb-1">Không tìm thấy giảng viên</h3>
                <p className="text-xs text-[#1C221F]/60 font-medium">Vui lòng thử lại với từ khóa khác.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}