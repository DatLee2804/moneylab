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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] transition-colors font-sans text-[#1C221F] selection:bg-[#133E2B]/10 selection:text-[#133E2B]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white text-[#1C221F] py-20 lg:py-32 border-b border-[#E8E3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#133E2B]/10 text-[#133E2B] text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles size={14} />
              <span>Chương trình đối tác Money Lab</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.15]"
            >
              Chia sẻ tri thức, <br />
              <span className="text-[#133E2B]">Kiếm tiền bền vững</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-[#1C221F]/70 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Tham gia mạng lưới đối tác của Money Lab để lan tỏa những giá trị thực chiến về Tài chính & AI, đồng thời nhận hoa hồng lên đến <span className="text-[#133E2B] font-extrabold">40%</span> cho mỗi đơn hàng thành công.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="px-8 py-4 bg-[#133E2B] text-white font-bold rounded-xl shadow-lg shadow-[#133E2B]/15 hover:bg-[#0F2E1E] transition-all active:scale-95 w-full sm:w-auto text-sm">
                Đăng ký đối tác ngay
              </button>
              <button className="px-8 py-4 bg-[#FAF7F2] text-[#1C221F] font-bold rounded-xl border border-[#E8E3D9] hover:bg-[#E8E3D9]/40 transition-all w-full sm:w-auto text-sm">
                Tìm hiểu chính sách
              </button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-28 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#133E2B] bg-[#133E2B]/10 px-3 py-1 rounded-full">Đặc quyền đối tác</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C221F] mt-3">Tại sao nên chọn Money Lab?</h2>
              <p className="text-sm text-[#1C221F]/60 mt-2">
                Chúng tôi không chỉ cung cấp hoa hồng, chúng tôi cung cấp một hệ sinh thái hỗ trợ bạn phát triển tối đa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <DollarSign size={28} />, title: "Hoa hồng cao nhất", desc: "Nhận mức hoa hồng cạnh tranh từ 20% đến 40% cho mỗi khóa học, sách hoặc combo được bán ra." },
                { icon: <TrendingUp size={28} />, title: "Cookie 60 ngày", desc: "Hệ thống ghi nhận khách hàng của bạn trong vòng 60 ngày kể từ lần click đầu tiên." },
                { icon: <ShieldCheck size={28} />, title: "Thanh toán minh bạch", desc: "Hệ thống đối soát tự động, thanh toán nhanh chóng vào ngày 15 hàng tháng." }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-white border border-[#E8E3D9] hover:shadow-xl transition-all group shadow-sm">
                  <div className="w-14 h-14 bg-[#FAF7F2] text-[#133E2B] rounded-2xl flex items-center justify-center mb-6 border border-[#E8E3D9] group-hover:bg-[#133E2B] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#1C221F]">{item.title}</h3>
                  <p className="text-xs text-[#1C221F]/70 leading-relaxed font-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-white border-y border-[#E8E3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0F2E1E] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-white/10">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 leading-tight">Bắt đầu kiếm tiền <br /> chỉ với 3 bước</h2>
                  <div className="space-y-8">
                    {[
                      { step: "01", title: "Đăng ký tài khoản", desc: "Tạo tài khoản đối tác hoàn toàn miễn phí chỉ trong 1 phút." },
                      { step: "02", title: "Chia sẻ link", desc: "Lấy link affiliate và chia sẻ lên Facebook, YouTube, Blog hoặc cộng đồng của bạn." },
                      { step: "03", title: "Nhận hoa hồng", desc: "Nhận tiền thưởng ngay khi có học viên đăng ký qua link của bạn." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-5">
                        <div className="text-2xl font-black text-[#BAFF02] font-mono">{item.step}</div>
                        <div>
                          <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                          <p className="text-xs text-emerald-100/70">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-[#BAFF02] text-[#0F2E1E] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold shadow-md">
                      <Zap size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Link giới thiệu của bạn</h3>
                    <p className="text-xs text-emerald-100/70">Chia sẻ link này để bắt đầu nhận hoa hồng</p>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-xl border border-white/10 mb-6">
                    <input 
                      type="text" 
                      readOnly 
                      value="https://moneylab.vn/ref/user123" 
                      className="bg-transparent border-none focus:outline-none text-emerald-100 text-xs flex-grow font-mono"
                    />
                    <button 
                      onClick={copyLink}
                      className="p-2.5 bg-[#BAFF02] text-[#0F2E1E] rounded-lg hover:bg-[#a3e000] transition-all"
                    >
                      {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                      <p className="text-[10px] text-emerald-100/60 uppercase font-semibold mb-1">Số click</p>
                      <p className="text-2xl font-extrabold text-white">1,240</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                      <p className="text-[10px] text-emerald-100/60 uppercase font-semibold mb-1">Hoa hồng</p>
                      <p className="text-2xl font-extrabold text-[#BAFF02]">12.5M</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[#FAF7F2]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-[#1C221F] mb-10">Câu hỏi thường gặp</h2>
            <div className="space-y-3 text-left">
              {[
                "Hoa hồng được tính như thế nào?",
                "Khi nào tôi nhận được thanh toán?",
                "Tôi có thể chạy quảng cáo Google Ads không?",
                "Làm sao để theo dõi đơn hàng thành công?"
              ].map((q, idx) => (
                <div key={idx} className="p-5 bg-white border border-[#E8E3D9] rounded-2xl flex justify-between items-center cursor-pointer hover:border-[#133E2B]/30 transition-all shadow-sm group">
                  <span className="font-bold text-[#1C221F] text-sm">{q}</span>
                  <ChevronDown size={18} className="text-gray-400 group-hover:text-[#133E2B] transition-colors" />
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
