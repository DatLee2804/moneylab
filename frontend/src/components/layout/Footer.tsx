import React from 'react';
import Link from 'next/link';
import { Globe, Facebook, Youtube, Send, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0F2E1E] text-white py-16 md:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Brand & Desc */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/logo.jpg" alt="Money Lab Logo" className="h-10 w-auto object-contain rounded-lg bg-white p-1" />
              <span className="text-xl font-black text-white tracking-tight">MONEY LAB</span>
            </Link>
            <p className="text-emerald-100/80 text-sm leading-relaxed font-normal">
              Nền tảng đào tạo trực tuyến hàng đầu về tài chính và trí tuệ nhân tạo. Chúng tôi giúp bạn làm chủ tương lai với những kỹ năng thực chiến nhất.
            </p>
            <div className="flex space-x-3 pt-2">
              {[
                { icon: <Facebook size={18} />, href: '#' },
                { icon: <Youtube size={18} />, href: '#' },
                { icon: <Send size={18} />, href: '#' },
                { icon: <Globe size={18} />, href: '#' },
              ].map((item, i) => (
                <a key={i} href={item.href} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#BAFF02] hover:text-[#0F2E1E] transition-all cursor-pointer">
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Col 2: Popular Courses */}
          <div>
            <h4 className="text-base font-bold mb-6 text-white uppercase tracking-wider">Khóa học phổ biến</h4>
            <ul className="space-y-3.5">
              <li><Link href="/courses" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Xây dựng Website với AI</Link></li>
              <li><Link href="/courses" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Đầu tư chứng khoán từ 0-1</Link></li>
              <li><Link href="/courses" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Ứng dụng AI vào kinh doanh</Link></li>
              <li><Link href="/courses" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Quản lý tài chính cá nhân</Link></li>
            </ul>
          </div>

          {/* Col 3: Partners & Links */}
          <div>
            <h4 className="text-base font-bold mb-6 text-white uppercase tracking-wider">Dành cho đối tác</h4>
            <ul className="space-y-3.5">
              <li><Link href="/instructor" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Trở thành giảng viên</Link></li>
              <li><Link href="/affiliate" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Chương trình Affiliate</Link></li>
              <li><Link href="/about" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Hợp tác doanh nghiệp</Link></li>
              <li><Link href="/auth/login" className="text-sm text-emerald-100/70 hover:text-[#BAFF02] transition-colors">Hỗ trợ & Lộ trình học</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-base font-bold mb-6 text-white uppercase tracking-wider">Bản tin Money Lab</h4>
            <p className="text-sm text-emerald-100/70 mb-5 leading-relaxed">Đăng ký để nhận thông tin về các khóa học mới nhất và ưu đãi đặc biệt.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2">
              <div className="relative flex-grow">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200/50" />
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-emerald-100/40 focus:outline-none focus:ring-1 focus:ring-[#BAFF02]"
                />
              </div>
              <button className="px-4 py-2.5 bg-[#BAFF02] text-[#0F2E1E] text-sm font-bold rounded-xl hover:bg-[#a3e000] transition-colors shrink-0">
                Gửi
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-emerald-100/50 font-normal">
          <p>© 2026 Money Lab Academy. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

