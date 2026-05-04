'use client';

import React from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ManagerDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const handlePrintReport = async () => {
    try {
      setIsGeneratingPdf(true);
      const { data: reportData } = await api.get('/dashboard/admin/report-data');
      const doc = new jsPDF() as any;
      
      // Add Title
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // #0f172a
      doc.text('MONEY LAB - BÁO CÁO HỆ THỐNG TỔNG QUAN', 105, 25, { align: 'center' });
      
      // Add Stats overview box
      doc.setFontSize(14);
      doc.text('TÓM TẮT CHỈ SỐ', 20, 45);
      doc.setFontSize(11);
      doc.text(`- Tổng doanh thu: ${reportData.overview.totalRevenue}`, 20, 55);
      doc.text(`- Tổng học viên: ${reportData.overview.totalStudents}`, 20, 62);
      doc.text(`- Tổng giảng viên: ${reportData.overview.totalInstructors}`, 20, 69);
      doc.text(`- Tổng khóa học: ${reportData.overview.totalCourses}`, 20, 76);

      // Add Instructors Table
      doc.setFontSize(14);
      doc.text('DANH SÁCH GIẢNG VIÊN', 20, 95);
      autoTable(doc, {
        startY: 100,
        head: [['Tên', 'Email', 'Khóa học', 'Doanh thu', 'Trạng thái']],
        body: reportData.instructors.map((i: any) => [i.name, i.email, i.courses, i.revenue, i.status]),
        theme: 'striped',
        headStyles: { fillColor: [186, 255, 2] } // #baff02
      });

      // Add Students Table
      doc.addPage();
      doc.text('DANH SÁCH HỌC VIÊN', 20, 25);
      autoTable(doc, {
        startY: 30,
        head: [['Tên', 'Email', 'Tham gia', 'Trạng thái']],
        body: reportData.students.map((s: any) => [s.name, s.email, new Date(s.createdAt).toLocaleDateString(), s.status]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] } // blue-500
      });

      // Add Courses Table
      doc.addPage();
      doc.text('DANH SÁCH KHÓA HỌC', 20, 25);
      autoTable(doc, {
        startY: 30,
        head: [['Tiêu đề', 'Giảng viên', 'Học viên', 'Giá', 'Trạng thái']],
        body: reportData.courses.map((c: any) => [c.title, c.instructor, c.students, c.price, c.status]),
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] } // #0f172a
      });

      doc.save(`MoneyLab_Total_Report_${new Date().toLocaleDateString('vi-VN')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Lỗi khi tạo báo cáo PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="manager" title="Tổng quan quản lý">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải báo cáo hệ thống...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="manager" title="Tổng quan quản lý">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header with Print Button */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-white">Báo cáo hiệu suất</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Dữ liệu cập nhật theo thời gian thực</p>
          </div>
          <button 
            onClick={handlePrintReport}
            disabled={isGeneratingPdf}
            className="flex items-center space-x-2 px-6 py-3 bg-[#baff02] text-[#0f172a] rounded-2xl font-black text-sm shadow-lg shadow-[#baff02]/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="animate-spin" size={18} /> : <><Download size={18} /><span>Tải Báo Cáo PDF</span></>}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Doanh thu hệ thống', value: stats?.totalRevenue || '0đ', change: 'Live', icon: <DollarSign className="text-[#baff02]" />, bg: 'bg-[#baff02]/10' },
            { label: 'Tổng giảng viên', value: stats?.totalInstructors || '0', change: 'Active', icon: <Users className="text-blue-500" />, bg: 'bg-blue-500/10' },
            { label: 'Tổng học viên', value: stats?.totalStudents || '0', change: 'Active', icon: <TrendingUp className="text-amber-500" />, bg: 'bg-amber-500/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-sm transition-all hover:shadow-xl hover:border-[#baff02]/20">
              <div className="flex justify-between items-center mb-6">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  {stat.icon}
                </div>
                <span className="text-xs font-black text-[#baff02] bg-[#baff02]/10 px-2 py-1 rounded-lg">{stat.change}</span>
              </div>
              <h4 className="text-3xl font-black text-white mb-1">{stat.value}</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-white">Xu hướng tăng trưởng</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#baff02]"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Doanh thu</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Học viên</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyStats || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#baff02" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#baff02" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#baff02' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#baff02" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-white">Duyệt khóa học gần đây</h3>
              <button 
                 onClick={() => window.location.href = '/dashboard/manager/review'}
                 className="text-xs font-bold text-[#baff02] hover:underline"
              >Xem tất cả</button>
            </div>
            <div className="space-y-6">
              {(stats?.recentCourses || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold", item.color)}>
                      {item.title.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[#baff02] transition-colors">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Giảng viên: {item.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", 
                      item.status === 'Approved' ? "bg-emerald-500/10 text-emerald-500" :
                      item.status === 'Pending' ? "bg-amber-500/10 text-amber-500" :
                      "bg-rose-500/10 text-rose-500"
                    )}>
                      {item.status}
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#baff02]" />
                  </div>
                </div>
              ))}
              {(!stats?.recentCourses || stats.recentCourses.length === 0) && (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Không có khóa học nào đang chờ duyệt</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-sm">
            <h3 className="text-lg font-black text-white mb-8">Thông báo hệ thống</h3>
            <div className="space-y-6">
              <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl flex items-start space-x-4">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><Clock size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">Cập nhật hệ thống</p>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Phiên bản 2.0 đã được triển khai thành công với nhiều tính năng mới.</p>
                </div>
              </div>
              <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl flex items-start space-x-4">
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl"><AlertCircle size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">Cảnh báo bảo mật</p>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Phát hiện 3 lần đăng nhập thất bại từ địa chỉ IP lạ.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
