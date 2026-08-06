'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X, User, Search, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuthStore } from '@/store/authStore';
import { NotificationBell } from '../NotificationBell';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khóa học', href: '/courses' },
    { name: 'Lộ trình', href: '#roadmap' },
    { name: 'Giảng viên', href: '/instructors' },
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
    <header className="bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E3D9] sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.jpg" alt="Money Lab Logo" className="h-9 md:h-11 w-auto object-contain rounded-lg shadow-sm" />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex max-w-[240px] xl:max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E3D9] rounded-full text-xs text-[#1C221F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#133E2B]/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-[#1C221F]/80 hover:text-[#133E2B] transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 ml-4 shrink-0">
            {isAuthenticated ? (
              <>
                <Link 
                  href={getDashboardPath()} 
                  className="flex items-center space-x-2 px-4 py-2.5 bg-[#133E2B] text-white rounded-xl hover:bg-[#0F2E1E] transition-all shadow-sm whitespace-nowrap"
                  title="Vào Dashboard"
                >
                  <LayoutDashboard size={17} className="text-[#BAFF02]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
                </Link>
                <NotificationBell />
                <button 
                  onClick={() => logout()}
                  className="w-9 h-9 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border border-rose-200 hover:bg-rose-600 hover:text-white transition-all text-sm shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-3 py-2 text-sm font-bold text-[#133E2B] hover:text-[#0F2E1E] transition-colors whitespace-nowrap">
                  Đăng nhập
                </Link>
                <Link href="/auth/login" className="px-5 py-2.5 bg-[#133E2B] text-white text-sm font-bold rounded-xl hover:bg-[#0F2E1E] transition-all shadow-md shadow-[#133E2B]/10 active:scale-95 whitespace-nowrap">
                  Đăng ký ngay
                </Link>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center space-x-3">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#1C221F] hover:bg-black/5 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-t border-[#E8E3D9] px-4 pt-2 pb-6 space-y-2 shadow-xl">
          <div className="py-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E3D9] rounded-xl text-sm text-[#1C221F]"
              />
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-3 text-base font-semibold text-[#1C221F] hover:text-[#133E2B] hover:bg-black/5 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-2.5">
            {isAuthenticated ? (
               <>
                 <Link href={getDashboardPath()} className="w-full py-3 text-center text-sm font-bold bg-[#133E2B] text-white rounded-xl shadow-md" onClick={() => setIsMenuOpen(false)}>
                    Vào Dashboard của bạn
                 </Link>
                 <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }} 
                  className="w-full py-3 text-center text-sm font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-xl"
                >
                   Đăng xuất tài khoản
                </button>
               </>
            ) : (
              <>
                <Link href="/auth/login" className="w-full py-3 text-center text-sm font-bold text-[#133E2B] bg-white border border-[#E8E3D9] rounded-xl" onClick={() => setIsMenuOpen(false)}>
                  Đăng nhập
                </Link>
                <Link href="/auth/login" className="w-full py-3 text-center text-sm font-bold bg-[#133E2B] text-white rounded-xl shadow-md">
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

