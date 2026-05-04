'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X, User, Search, Globe, Moon, Sun, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuthStore } from '@/store/authStore';
import { NotificationBell } from '../NotificationBell';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const navLinks = [
    { name: 'Khóa học', href: '/courses' },
    { name: 'Giảng viên', href: '/instructors' },
    { name: 'Affiliate', href: '/affiliate' },
    { name: 'Về chúng tôi', href: '/about' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/auth/login';
    const role = user.role.toLowerCase();
    const roleRedirects = {
      'admin': '/dashboard/admin',
      'instructor': '/dashboard/instructor',
      'student': '/dashboard/student',
      'manager': '/dashboard/manager',
      'affiliate': '/dashboard/affiliate'
    };
    return roleRedirects[role as keyof typeof roleRedirects] || '/dashboard/student';
  };

  return (
    <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.jpg" alt="Money Lab Logo" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-grow max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học AI, Tài chính..." 
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 transition-all text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-[#baff02] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-5 ml-8">
            {isAuthenticated ? (
              <>
                <Link 
                  href={getDashboardPath()} 
                  className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all group"
                  title="Vào Dashboard"
                >
                  <LayoutDashboard size={18} className="text-[#baff02]" />
                  <span className="text-xs font-bold">Dashboard</span>
                </Link>
                <NotificationBell />
                <button 
                  onClick={() => logout()}
                  className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all overflow-hidden font-black text-sm"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors">
                  <User size={20} />
                </Link>
                <Link href="/auth/login" className="px-6 py-2.5 bg-[#baff02] text-[#0a0a0a] text-sm font-black rounded-xl hover:bg-[#8ec401] transition-all shadow-lg shadow-[#baff02]/20">
                  Đăng nhập
                </Link>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center space-x-4">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-t border-white/5 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          <div className="py-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
              />
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-4 text-base font-medium text-gray-400 hover:text-[#baff02] hover:bg-white/5 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-3">
            {isAuthenticated ? (
               <>
                 <Link href={getDashboardPath()} className="w-full py-4 text-center text-sm font-black bg-[#baff02] text-[#0a0a0a] rounded-lg shadow-lg" onClick={() => setIsMenuOpen(false)}>
                    Vào Dashboard của bạn
                 </Link>
                 <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }} 
                  className="w-full py-4 text-center text-sm font-black bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg"
                >
                   Đăng xuất tài khoản
                </button>
               </>
            ) : (
              <>
                <Link href="/auth/login" className="w-full py-3 text-center text-sm font-semibold text-[#baff02] border border-[#baff02]/30 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Đăng nhập
                </Link>
                <Link href="/auth/register" className="w-full py-3 text-center text-sm font-black bg-[#baff02] text-[#0a0a0a] rounded-lg shadow-lg shadow-[#baff02]/20">
                  Đăng ký ngay
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
