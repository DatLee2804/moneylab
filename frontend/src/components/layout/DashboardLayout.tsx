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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C221F] flex selection:bg-[#133E2B]/10 selection:text-[#133E2B]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E8E3D9] transition-transform duration-300 transform lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex-shrink-0 shadow-sm",
        !isSidebarOpen && "-translate-x-full lg:hidden"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/logo.jpg" alt="Money Lab Logo" className="h-10 w-auto object-contain rounded-lg shadow-sm" />
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-[#1C221F] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-grow px-4 space-y-1.5 overflow-y-auto">
            <div className="px-4 py-2 text-[10px] font-black text-[#1C221F]/40 uppercase tracking-widest mb-1">Menu quản trị</div>
            {currentMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                  pathname === item.href 
                    ? "bg-[#133E2B] text-white shadow-md shadow-[#133E2B]/10" 
                    : "text-[#1C221F]/70 hover:bg-[#FAF7F2] hover:text-[#133E2B]"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-[#133E2B]"
                )}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E8E3D9] mb-3">
              <p className="text-xs text-[#1C221F]/60 font-bold mb-2 uppercase tracking-tight">Cần hỗ trợ?</p>
              <button className="w-full py-2 bg-white text-xs font-bold text-[#133E2B] rounded-xl border border-[#E8E3D9] shadow-sm hover:bg-[#133E2B] hover:text-white transition-colors">
                Trung tâm hỗ trợ
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-500 hover:text-rose-600 transition-colors font-bold text-sm"
            >
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-[#E8E3D9] flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4 flex-grow max-w-xl">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className={cn(
                 "lg:hidden p-2 text-gray-500 hover:text-[#1C221F] transition-colors",
                 isSidebarOpen && "hidden"
               )}
             >
               <Menu size={20} />
             </button>
             <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mọi thứ..." 
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E8E3D9] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#133E2B]/20 transition-all text-[#1C221F] placeholder:text-gray-400"
                />
             </div>
          </div>

          <div className="flex items-center space-x-5">
            <button className="relative p-2 text-gray-500 hover:bg-[#FAF7F2] rounded-xl transition-all border border-[#E8E3D9]">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-[#E8E3D9]"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#1C221F] capitalize leading-none mb-1">{user?.name || role}</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none">{user?.role || role}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#133E2B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-10">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1C221F] tracking-tight">{title}</h1>
            <p className="text-xs text-[#1C221F]/50 font-semibold uppercase tracking-wider mt-1">Chào mừng bạn quay trở lại!</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};est mt-1">Chào mừng bạn quay trở lại!</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
