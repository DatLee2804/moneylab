'use client';

import React from 'react';
import { motion } from 'motion/react';
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
    <div className="min-h-screen bg-[#0a0a0a] transition-colors font-sans selection:bg-[#baff02]/30 selection:text-[#baff02]">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 dark:opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#baff02] via-transparent to-transparent" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-1.5 bg-[#baff02]/10 text-[#baff02] text-[10px] font-black rounded-full uppercase tracking-widest mb-6 inline-block">
                Về Money Lab
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                Kiến tạo tương lai bằng <span className="text-[#baff02]">Trí tuệ</span> và <span className="text-[#059669]">Tài chính</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-bold">
                Money Lab là nền tảng giáo dục trực tuyến hàng đầu, nơi hội tụ những chuyên gia thực chiến trong lĩnh vực AI và Tài chính, giúp bạn làm chủ công nghệ và tự chủ tài chính trong kỷ nguyên số.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-[#141414]/50 border-y border-white/5">
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
                  <div className="w-14 h-14 bg-[#141414] rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-white/5">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">
                  Câu chuyện của chúng tôi bắt đầu từ một <span className="text-[#baff02]">Khát vọng</span>
                </h2>
                <div className="space-y-6 text-gray-500 font-bold leading-relaxed">
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
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0f172a] overflow-hidden bg-gray-200 relative">
                        <Image src={`https://i.pravatar.cc/100?u=founder${i}`} alt="Founder" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">Đội ngũ sáng lập</p>
                    <p className="text-xs text-gray-400 font-bold">Hơn 15 năm kinh nghiệm Tài chính & Công nghệ</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-3 relative">
                  <Image 
                    src="https://picsum.photos/seed/team/1000/1000" 
                    alt="Team working" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-[#059669] p-8 rounded-3xl shadow-xl -rotate-3 hidden md:block">
                  <Target size={48} className="text-white mb-4" />
                  <p className="text-white font-black text-xl leading-tight uppercase tracking-widest">Mục tiêu 1 triệu<br />học viên vào 2030</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-[#141414]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">Giá trị cốt lõi</h2>
              <p className="text-gray-500 font-bold max-w-2xl mx-auto">Những nguyên tắc định hướng cho mọi hoạt động và quyết định của chúng tôi tại Money Lab.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-sm hover:shadow-2xl transition-all group hover:border-[#baff02]/20"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300", value.color)}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{value.title}</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed font-bold italic">
                    "{value.description}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#baff02] rounded-[40px] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#baff02]/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#059669]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight uppercase tracking-tight">
                  Sẵn sàng bắt đầu hành trình của bạn?
                </h2>
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm">
                  Tham gia cùng hàng ngàn học viên khác và bắt đầu làm chủ tương lai của bạn ngay hôm nay.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="w-full sm:w-auto px-10 py-5 bg-white text-[#baff02] font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl uppercase tracking-widest text-xs">
                    Khám phá khóa học
                  </button>
                  <button className="w-full sm:w-auto px-10 py-5 bg-[#baff02] border-2 border-white/20 text-[#0a0a0a] font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
                    Liên hệ tư vấn
                  </button>
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
