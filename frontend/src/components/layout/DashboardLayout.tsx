'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Search,
  PieChart,
  ShieldCheck,
  UserCheck,
  FileText,
  LifeBuoy,
  MessageSquare,
  Inbox,
  BadgePercent,
  TrendingUp,
  Wallet,
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuthStore } from '@/store/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'instructor' | 'manager' | 'admin' | 'affiliate';
  title: string;
}

export const DashboardLayout = ({ children, role, title }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const menuItems = {
    student: [
      { name: 'Khóa học của tôi', href: '/dashboard/student', icon: <BookOpen size={20} /> },
      { name: 'Tiến độ học tập', href: '/dashboard/student/progress', icon: <PieChart size={20} /> },
      { name: 'Ví & Tài chính', href: '/dashboard/student/wallet', icon: <Wallet size={20} /> },
      { name: 'Thanh toán', href: '/dashboard/student/payments', icon: <CreditCard size={20} /> },
      { name: 'Báo cáo', href: '/dashboard/student/reports', icon: <FileText size={20} /> },
      { name: 'Hỗ trợ', href: '/dashboard/student/support', icon: <LifeBuoy size={20} /> },
    ],
    instructor: [
      { name: 'Tổng quan', href: '/dashboard/instructor', icon: <LayoutDashboard size={20} /> },
      { name: 'Khóa học của tôi', href: '/dashboard/instructor/courses', icon: <BookOpen size={20} /> },
      { name: 'Combo khóa học', href: '/dashboard/instructor/combos', icon: <BadgePercent size={20} /> },
      { name: 'Học viên', href: '/dashboard/instructor/students', icon: <Users size={20} /> },
      { name: 'Báo cáo', href: '/dashboard/instructor/reports', icon: <FileText size={20} /> },
      { name: 'Rút tiền', href: '/dashboard/instructor/payouts', icon: <Wallet size={20} /> },
      { name: 'Hỗ trợ', href: '/dashboard/instructor/support', icon: <LifeBuoy size={20} /> },
      { name: 'Cài đặt', href: '/dashboard/instructor/settings', icon: <Settings size={20} /> },
    ],
    manager: [
      { name: 'Tổng quan', href: '/dashboard/manager', icon: <LayoutDashboard size={20} /> },
      { name: 'Duyệt khóa học', href: '/dashboard/manager/review', icon: <ShieldCheck size={20} /> },
      { name: 'Giảng viên', href: '/dashboard/manager/instructors', icon: <UserCheck size={20} /> },
      { name: 'Học viên', href: '/dashboard/manager/students', icon: <Users size={20} /> },
      { name: 'Khóa học', href: '/dashboard/manager/courses', icon: <BookOpen size={20} /> },
      { name: 'Báo cáo', href: '/dashboard/manager/reports', icon: <FileText size={20} /> },
      { name: 'Hỗ trợ', href: '/dashboard/manager/support', icon: <LifeBuoy size={20} /> },
    ],
    admin: [
      { name: 'Tổng quan', href: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
      { name: 'Người dùng', href: '/dashboard/admin/users', icon: <Users size={20} /> },
      { name: 'Thanh toán', href: '/dashboard/admin/payouts', icon: <CreditCard size={20} /> },
      { name: 'Cài đặt hệ thống', href: '/dashboard/admin/settings', icon: <Settings size={20} /> },
      { name: 'Toàn bộ Báo cáo', href: '/dashboard/admin/reports', icon: <FileText size={20} /> },
      { name: 'Toàn bộ Hỗ trợ', href: '/dashboard/admin/support', icon: <LifeBuoy size={20} /> },
    ],
    affiliate: [
      { name: 'Trang chủ', href: '/dashboard/affiliate', icon: <LayoutDashboard size={20} /> },
      { name: 'Thống kê', href: '/dashboard/affiliate/stats', icon: <PieChart size={20} /> },
      { name: 'Báo cáo', href: '/dashboard/affiliate/reports', icon: <FileText size={20} /> },
      { name: 'Hỗ trợ', href: '/dashboard/affiliate/support', icon: <LifeBuoy size={20} /> },
    ]
  };

  const currentMenuItems = menuItems[role] || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex selection:bg-[#baff02]/30 selection:text-[#baff02]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#141414] border-r border-white/5 transition-transform duration-300 transform lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex-shrink-0",
        !isSidebarOpen && "-translate-x-full lg:hidden"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-8 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.jpg" alt="Money Lab Logo" className="h-10 w-auto object-contain" />
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-grow px-4 space-y-2">
            <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Main Menu</div>
            {currentMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                  pathname === item.href 
                    ? "bg-[#baff02] text-[#0a0a0a] shadow-lg shadow-[#baff02]/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-[#baff02]"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-[#0a0a0a]" : "text-gray-500 group-hover:text-[#baff02]"
                )}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-white/5 mb-4">
              <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-tighter">Cần hỗ trợ?</p>
              <button className="w-full py-2.5 bg-[#141414] text-xs font-bold rounded-xl border border-white/5 shadow-sm hover:bg-white/5 transition-colors">
                Trung tâm hỗ trợ
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3.5 text-gray-500 hover:text-rose-500 transition-colors font-bold text-sm"
            >
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#141414] border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4 flex-grow max-w-xl">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className={cn(
                 "lg:hidden p-2 text-gray-400 hover:text-white transition-colors",
                 isSidebarOpen && "hidden"
               )}
             >
               <Menu size={20} />
             </button>
             <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mọi thứ..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#baff02]/10 transition-all text-white placeholder:text-gray-600"
                />
             </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#141414]"></span>
            </button>
            <div className="h-8 w-px bg-white/5"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white capitalize leading-none mb-1">{user?.name || role}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">{user?.role || role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#baff02]/10 text-[#baff02] flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 lg:p-12">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Chào mừng bạn quay trở lại!</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
