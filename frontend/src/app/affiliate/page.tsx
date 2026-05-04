'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Share2, TrendingUp, DollarSign, Users, MousePointer2, Copy, CheckCircle, Sparkles, Gift, ShieldCheck, Zap, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/utils/utils';

export default function AffiliatePage() {
  const [copied, setCopied] = React.useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText('https://moneylab.vn/ref/user123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] transition-colors font-sans selection:bg-[#baff02]/30 selection:text-[#baff02]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-[#0a0a0a] text-white py-24 lg:py-40 overflow-hidden border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#baff02]/10 text-[#baff02] text-[10px] font-black uppercase tracking-widest mb-8 border border-[#baff02]/20"
            >
              <Sparkles size={14} />
              <span>Chương trình đối tác Money Lab</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black mb-8 leading-tight uppercase tracking-tight"
            >
              Chia sẻ tri thức, <br />
              <span className="text-[#baff02]">Kiếm tiền bền vững</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-bold italic"
            >
              Tham gia mạng lưới đối tác của Money Lab để lan tỏa những giá trị thực chiến về Tài chính & AI, đồng thời nhận hoa hồng lên đến <span className="text-white font-black uppercase">40%</span> cho mỗi đơn hàng thành công.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button className="px-10 py-5 bg-[#baff02] text-[#0a0a0a] font-black rounded-2xl shadow-2xl shadow-[#baff02]/30 hover:bg-[#8ec401] transition-all active:scale-95 w-full sm:w-auto uppercase tracking-widest text-xs">
                Đăng ký đối tác ngay
              </button>
              <button className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all w-full sm:w-auto uppercase tracking-widest text-xs">
                Tìm hiểu chính sách
              </button>
            </motion.div>
          </div>
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#baff02]/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#baff02]/10 rounded-full blur-[120px]"></div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tight">Tại sao nên chọn Money Lab?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
                Chúng tôi không chỉ cung cấp hoa hồng, chúng tôi cung cấp một hệ sinh thái hỗ trợ bạn phát triển tối đa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: <DollarSign size={32} />, title: "Hoa hồng cao nhất", desc: "Nhận mức hoa hồng cạnh tranh từ 20% đến 40% cho mỗi khóa học, sách hoặc combo được bán ra." },
                { icon: <TrendingUp size={32} />, title: "Cookie 60 ngày", desc: "Hệ thống ghi nhận khách hàng của bạn trong vòng 60 ngày kể từ lần click đầu tiên." },
                { icon: <ShieldCheck size={32} />, title: "Thanh toán minh bạch", desc: "Hệ thống đối soát tự động, thanh toán nhanh chóng vào ngày 15 hàng tháng." }
              ].map((item, idx) => (
                <div key={idx} className="p-12 rounded-[2.5rem] bg-[#141414] border border-white/5 hover:border-[#baff02]/30 transition-all group shadow-sm hover:shadow-xl">
                  <div className="w-20 h-20 bg-[#0a0a0a] text-[#baff02] rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#baff02] group-hover:text-[#0a0a0a] transition-all duration-300 border border-white/5">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-bold italic">"{item.desc}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-32 bg-[#141414]/20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#141414] rounded-[3rem] p-12 lg:p-24 relative overflow-hidden border border-white/5 shadow-2xl">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black text-white mb-10 leading-tight uppercase tracking-tight border-l-8 border-[#baff02] pl-8">Bắt đầu kiếm tiền <br /> chỉ với 3 bước</h2>
                  <div className="space-y-12">
                    {[
                      { step: "01", title: "Đăng ký tài khoản", desc: "Tạo tài khoản đối tác hoàn toàn miễn phí chỉ trong 1 phút." },
                      { step: "02", title: "Chia sẻ link", desc: "Lấy link affiliate và chia sẻ lên Facebook, YouTube, Blog hoặc cộng đồng của bạn." },
                      { step: "03", title: "Nhận hoa hồng", desc: "Nhận tiền thưởng ngay khi có học viên đăng ký qua link của bạn." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-6">
                        <div className="text-4xl font-black text-[#baff02]/30 font-mono">{item.step}</div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h4>
                          <p className="text-gray-400 font-bold text-sm tracking-widest">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-inner">
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-[#baff02]/20 text-[#baff02] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Zap size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Link giới thiệu của bạn</h3>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Chia sẻ link này để bắt đầu nhận hoa hồng</p>
                  </div>
                  <div className="flex items-center space-x-4 p-5 bg-black/40 rounded-2xl border border-white/5 mb-8 shadow-inner">
                    <input 
                      type="text" 
                      readOnly 
                      value="https://moneylab.vn/ref/user123" 
                      className="bg-transparent border-none focus:ring-0 text-gray-300 text-sm flex-grow font-mono"
                    />
                    <button 
                      onClick={copyLink}
                      className="p-3 bg-white/10 text-[#baff02] rounded-xl hover:bg-[#baff02] transition-all duration-300"
                    >
                      {copied ? <CheckCircle size={20} className="text-white" /> : <Copy size={20} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest">Số click</p>
                      <p className="text-3xl font-black text-white">1,240</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest">Hoa hồng</p>
                      <p className="text-3xl font-black text-[#baff02]">12.5M</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#baff02]/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            </div>
          </div>
        </section>

        {/* FAQ Section Placeholder */}
        <section className="py-32 bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tight">Câu hỏi thường gặp</h2>
            <div className="space-y-4 text-left">
              {[
                "Hoa hồng được tính như thế nào?",
                "Khi nào tôi nhận được thanh toán?",
                "Tôi có thể chạy quảng cáo Google Ads không?",
                "Làm sao để theo dõi đơn hàng thành công?"
              ].map((q, idx) => (
                <div key={idx} className="p-6 bg-[#141414] border border-white/5 rounded-3xl flex justify-between items-center cursor-pointer hover:border-[#baff02]/30 transition-all shadow-sm hover:shadow-md group">
                  <span className="font-bold text-white uppercase tracking-wide text-sm">{q}</span>
                  <ChevronDown size={20} className="text-gray-400 group-hover:text-[#baff02] transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
