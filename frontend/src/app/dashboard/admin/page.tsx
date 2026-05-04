'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Loader2,
  Users,
  BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

const defaultGraphData = [
  { name: 'T1', value: 45000 }, { name: 'T2', value: 52000 }, { name: 'T3', value: 48000 }, { name: 'T4', value: 61000 }, { name: 'T5', value: 55000 }, { name: 'T6', value: 67000 },
];

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="admin" title="Tổng quan hệ thống">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải báo cáo hệ thống...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Tổng quan hệ thống">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Doanh số toàn sàn', value: stats?.totalRevenue || '0đ', change: 'Real-time', icon: <DollarSign size={20} />, color: 'text-[#baff02]', bg: 'bg-[#baff02]/10' },
            { label: 'Tổng người dùng', value: stats?.totalUsers || 0, change: 'Active', icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Số lượng khóa học', value: stats?.totalCourses || 0, change: 'Approved', icon: <BookOpen size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-sm transition-all hover:shadow-xl hover:border-[#baff02]/20">
              <div className="flex justify-between items-center mb-6">
                <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <span className="text-xs font-black text-[#baff02] bg-[#baff02]/10 px-2 py-1 rounded-lg">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#141414] p-10 rounded-[40px] border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Tăng trưởng doanh thu</h3>
            <div className="flex items-center space-x-2 px-4 py-2 bg-[#0a0a0a] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#baff02]">
              Dữ liệu mô phỏng
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultGraphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 900}} />
                <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.03)'}} contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', color: '#fff', fontWeight: 900, fontSize: '12px' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {defaultGraphData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === defaultGraphData.length - 1 ? '#baff02' : 'rgba(255, 255, 255, 0.1)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
