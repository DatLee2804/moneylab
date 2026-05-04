import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="mb-8 block">
              <img src="/images/logo.jpg" alt="Money Lab Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
              Nền tảng đào tạo trực tuyến hàng đầu về tài chính và trí tuệ nhân tạo. Chúng tôi giúp bạn làm chủ tương lai với những kỹ năng thực chiến nhất.
            </p>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#baff02] transition-colors cursor-pointer">
                  <Globe size={18} />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-8 text-white">Khóa học phổ biến</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors font-medium">Xây dựng Website với AI</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors font-medium">Đầu tư chứng khoán từ 0-1</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors font-medium">Ứng dụng AI vào kinh doanh</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors font-medium">Xây dựng cộng đồng Facebook</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 text-white">Dành cho đối tác</h4>
            <ul className="space-y-4">
              <li><Link href="/instructor" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors">Trở thành giảng viên</Link></li>
              <li><Link href="/affiliate" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors">Chương trình Affiliate</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors">Hợp tác doanh nghiệp</Link></li>
              <li><Link href="/admin" className="text-sm text-gray-400 hover:text-[#baff02] transition-colors">Quản trị viên</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 text-white">Bản tin</h4>
            <p className="text-sm text-gray-400 mb-6">Đăng ký để nhận thông tin về các khóa học mới nhất và ưu đãi đặc biệt.</p>
            <form className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="flex-grow px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#baff02]"
              />
              <button className="px-4 py-2 bg-[#baff02] text-[#0a0a0a] text-sm font-black rounded-lg hover:bg-[#8ec401] transition-colors">
                Gửi
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
          <p>© 2026 Money Lab. Tất cả quyền được bảo lưu.</p>
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
