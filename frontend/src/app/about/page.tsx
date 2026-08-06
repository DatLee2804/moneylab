'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Zap, 
  Globe, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  const stats = [
    { label: 'Học viên', value: '50,000+', icon: <Users className="text-[#baff02]" /> },
    { label: 'Khóa học', value: '200+', icon: <BookOpen className="text-[#059669]" /> },
    { label: 'Giảng viên', value: '150+', icon: <Award className="text-amber-500" /> },
    { label: 'Quốc gia', value: '15+', icon: <Globe className="text-blue-500" /> },
  ];

  const values = [
    {
      title: 'Chất lượng thực chiến',
      description: 'Chúng tôi tập trung vào những kiến thức có thể áp dụng ngay vào công việc và đầu tư thực tế.',
      icon: <Zap size={24} />,
      color: 'bg-[#baff02]'
    },
    {
      title: 'Cập nhật liên tục',
      description: 'Thế giới AI và Tài chính thay đổi từng ngày, và giáo trình của chúng tôi cũng vậy.',
      icon: <TrendingUp size={24} />,
      color: 'bg-[#059669]'
    },
    {
      title: 'Cộng đồng hỗ trợ',
      description: 'Học viên không chỉ học một mình mà còn tham gia vào mạng lưới chuyên gia và bạn học cùng chí hướng.',
      icon: <MessageSquare size={24} />,
      color: 'bg-[#baff02]'
    },
    {
      title: 'Công nghệ dẫn đầu',
      description: 'Ứng dụng những công nghệ AI mới nhất để tối ưu hóa trải nghiệm học tập của người dùng.',
      icon: <Cpu size={24} />,
      color: 'bg-[#059669]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] transition-colors font-sans text-[#1C221F] selection:bg-[#133E2B]/10 selection:text-[#133E2B]">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-white border-b border-[#E8E3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-1.5 bg-[#133E2B]/10 text-[#133E2B] text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-block">
                Về Money Lab
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-[#1C221F] mb-6 tracking-tight leading-tight">
                Kiến tạo tương lai bằng <span className="text-[#133E2B]">Trí tuệ</span> và <span className="text-[#133E2B]">Tài chính</span>
              </h1>
              <p className="text-base md:text-lg text-[#1C221F]/70 max-w-3xl mx-auto leading-relaxed font-normal">
                Money Lab là nền tảng giáo dục trực tuyến hàng đầu, nơi hội tụ những chuyên gia thực chiến trong lĩnh vực AI và Tài chính, giúp bạn làm chủ công nghệ và tự chủ tài chính trong kỷ nguyên số.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-[#FAF7F2] border-b border-[#E8E3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-[#E8E3D9]">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-[#133E2B] mb-1">{stat.value}</h3>
                  <p className="text-xs text-[#1C221F]/60 font-semibold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#E8E3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C221F] mb-6 leading-tight">
                  Câu chuyện của chúng tôi bắt đầu từ một <span className="text-[#133E2B]">Khát vọng</span>
                </h2>
                <div className="space-y-5 text-[#1C221F]/70 font-normal leading-relaxed text-sm">
                  <p>
                    Được thành lập vào năm 2023, Money Lab ra đời trong bối cảnh làn sóng Trí tuệ nhân tạo (AI) đang thay đổi mọi khía cạnh của đời sống và kinh tế. Chúng tôi nhận thấy một khoảng cách lớn giữa kiến thức hàn lâm và nhu cầu thực tế của thị trường.
                  </p>
                  <p>
                    Sứ mệnh của chúng tôi là xóa bỏ rào cản đó. Chúng tôi không chỉ dạy bạn cách sử dụng công cụ, chúng tôi dạy bạn cách tư duy, cách ứng dụng AI để tạo ra giá trị thực và cách quản lý tài chính để đạt được sự tự do bền vững.
                  </p>
                  <p>
                    Tại Money Lab, mỗi khóa học là một lộ trình được thiết kế tỉ mỉ, từ cơ bản đến nâng cao, đảm bảo học viên có thể thực hành ngay sau mỗi bài giảng.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200 relative">
                        <Image src={`https://i.pravatar.cc/100?u=founder${i}`} alt="Founder" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1C221F] uppercase tracking-tight">Đội ngũ sáng lập</p>
                    <p className="text-[11px] text-[#1C221F]/60">Hơn 15 năm kinh nghiệm Tài chính & Công nghệ</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border border-[#E8E3D9] relative">
                  <Image 
                    src="https://picsum.photos/seed/team/1000/1000" 
                    alt="Team working" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#0F2E1E] p-6 rounded-2xl shadow-xl text-white hidden md:block border border-white/10">
                  <Target size={36} className="text-[#BAFF02] mb-2" />
                  <p className="font-bold text-base leading-tight uppercase tracking-wider text-white">Mục tiêu 1 triệu<br />học viên vào 2030</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 lg:py-28 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#133E2B] bg-[#133E2B]/10 px-3 py-1 rounded-full">Nguyên tắc hoạt động</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C221F] mt-3">Giá trị cốt lõi</h2>
              <p className="text-sm text-[#1C221F]/60 mt-2">Những nguyên tắc định hướng cho mọi hoạt động và quyết định của chúng tôi tại Money Lab.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-[#E8E3D9] shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 bg-[#133E2B] group-hover:bg-[#0F2E1E] transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1C221F] mb-3">{value.title}</h3>
                  <p className="text-xs text-[#1C221F]/70 leading-relaxed font-normal">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-[#0F2E1E] rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl border border-white/10 text-white">
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#BAFF02]">Hành trình làm chủ tài chính</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Sẵn sàng bắt đầu hành trình của bạn?
              </h2>
              <p className="text-emerald-100/80 text-sm max-w-xl mx-auto font-normal">
                Tham gia cùng hàng ngàn học viên khác và bắt đầu làm chủ tương lai của bạn ngay hôm nay.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/courses" className="w-full sm:w-auto px-8 py-4 bg-white text-[#0F2E1E] font-bold rounded-xl hover:bg-[#BAFF02] transition-colors text-sm shadow-md">
                  Khám phá khóa học
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto px-8 py-4 bg-[#133E2B] text-white font-bold rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-sm">
                  Tạo tài khoản ngay
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
