'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Copy, 
  Check, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  MousePointer2, 
  Search, 
  Filter, 
  ChevronRight,
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';

export default function AffiliateDashboard() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCopied, setIsCopied] = React.useState(false);
  const referralLink = "https://moneylab.vn/ref/nguyenvana";

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const stats = [
    { label: 'Lượt click', value: '1,284', change: '+12.5%', icon: <MousePointer2 size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Đăng ký mới', value: '156', change: '+8.2%', icon: <Users size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Đơn hàng thành công', value: '42', change: '+15.4%', icon: <ShoppingBag size={20} />, color: 'text-[#baff02]', bg: 'bg-[#baff02]/10' },
    { label: 'Hoa hồng tạm tính', value: '12,500,000đ', change: '+22.1%', icon: <Wallet size={20} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const referrals = [
    { id: 1, user: 'Lê Văn B', date: '2024-03-20', course: 'Xây dựng Website với AI', status: 'Thành công', commission: '250,000đ' },
    { id: 2, user: 'Trần Thị C', date: '2024-03-19', course: 'Đầu tư chứng khoán từ 0-1', status: 'Chờ duyệt', commission: '450,000đ' },
    { id: 3, user: 'Phạm Văn D', date: '2024-03-18', course: 'Ứng dụng AI vào kinh doanh', status: 'Thành công', commission: '300,000đ' },
    { id: 4, user: 'Nguyễn Thị E', date: '2024-03-17', course: 'Xây dựng Website với AI', status: 'Thành công', commission: '250,000đ' },
    { id: 5, user: 'Hoàng Văn F', date: '2024-03-16', course: 'Đầu tư chứng khoán từ 0-1', status: 'Hủy', commission: '0đ' },
  ];

  if (isLoading) {
    return (
      <DashboardLayout role="affiliate" title="Affiliate Dashboard">
        <div className="space-y-8 animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-[32px]"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-[32px]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="affiliate" title="Affiliate Dashboard">
      <div className="space-y-8">
        {/* Referral Link Generator */}
        <section className="bg-[#baff02] p-8 md:p-12 rounded-[40px] text-[#0f172a] relative overflow-hidden shadow-2xl shadow-[#baff02]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-black mb-4">Chia sẻ & Nhận hoa hồng</h3>
            <p className="text-green-100 mb-8 font-medium">
              Nhận ngay 20% hoa hồng cho mỗi học viên đăng ký qua link giới thiệu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none backdrop-blur-md"
                />
              </div>
              <button 
                onClick={copyToClipboard}
                className="px-8 py-4 bg-white text-[#baff02] font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center space-x-2 shrink-0"
              >
                {isCopied ? <Check size={20} /> : <Copy size={20} />}
                <span>{isCopied ? 'Đã sao chép' : 'Sao chép link'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <span className="text-xs font-black text-[#baff02] bg-[#baff02]/10 px-2 py-1 rounded-lg">{stat.change}</span>
              </div>
              <h4 className="text-3xl font-black text-[#0f172a] dark:text-white mb-1">{stat.value}</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Referral List Table */}
        <section className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#0f172a] dark:text-white">Danh sách giới thiệu</h3>
              <p className="text-sm text-gray-400 font-medium">Theo dõi các lượt đăng ký từ link của bạn</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#baff02]/20"
                />
              </div>
              <button className="p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-500 rounded-xl border border-gray-200 dark:border-gray-700">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày đăng ký</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khóa học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hoa hồng</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {referrals.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#baff02]/10 text-[#baff02] flex items-center justify-center font-bold text-sm">
                          {item.user.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-[#0f172a] dark:text-white">{item.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 dark:text-gray-400 font-medium">{item.date}</td>
                    <td className="px-8 py-6 text-sm text-gray-500 dark:text-gray-400 font-medium">{item.course}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#baff02]">{item.commission}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        item.status === 'Thành công' ? "bg-emerald-100 text-emerald-700" : 
                        item.status === 'Chờ duyệt' ? "bg-amber-100 text-amber-700" : 
                        "bg-rose-100 text-rose-700"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-[#baff02] transition-colors">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-50 dark:border-gray-700 text-center">
            <button className="text-sm font-bold text-gray-500 hover:text-[#baff02] transition-colors flex items-center justify-center mx-auto space-x-2">
              <span>Xem thêm lịch sử</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
