'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Settings, 
  Save, 
  Percent, 
  ShieldCheck, 
  Bell, 
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      setIsSaving(true);
      setMessage(null);
      await api.patch('/settings', { key, value });
      setMessage({ type: 'success', text: 'Đã cập nhật cài đặt thành công!' });
      fetchSettings();
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật cài đặt' });
    } finally {
      setIsSaving(false);
    }
  };

  const commissionRate = settings.find(s => s.key === 'instructor_commission_rate')?.value || '70';

  return (
    <DashboardLayout role="admin" title="Cài đặt Hệ thống">
      <div className="max-w-4xl space-y-10">
        {/* Header Section */}
        <div className="bg-[#141414] rounded-[40px] border border-white/5 p-10">
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-[#baff02]/10 rounded-3xl text-[#baff02]">
                    <Globe size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Cấu hình Nền tảng</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Điều chỉnh các tham số vận hành hệ thống</p>
                </div>
            </div>

            {message && (
                <div className={cn(
                    "mb-8 p-4 rounded-2xl flex items-center space-x-3 text-xs font-black uppercase tracking-widest border",
                    message.type === 'success' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                )}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="space-y-8">
                {/* Commission Rate Setting */}
                <div className="group bg-[#0a0a0a] rounded-[32px] p-8 border border-white/5 hover:border-[#baff02]/20 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-gray-400 group-hover:text-[#baff02] transition-colors">
                                <Percent size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Tỷ lệ phí hoa hồng Giảng viên</h3>
                                <p className="text-xs text-gray-500 font-medium max-w-md mt-1 leading-relaxed">
                                    Phần trăm doanh thu giảng viên sẽ nhận được từ mỗi đơn hàng. Ví dụ: 70 có nghĩa giảng viên nhận 70%, nền tảng nhận 30%.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input 
                                    type="number"
                                    defaultValue={commissionRate}
                                    onBlur={(e) => {
                                        if (e.target.value !== commissionRate) {
                                            handleUpdateSetting('instructor_commission_rate', e.target.value);
                                        }
                                    }}
                                    className="w-24 px-4 py-3 bg-[#141414] border border-white/10 rounded-xl text-center text-white font-black text-xl focus:ring-2 focus:ring-[#baff02]/20 transition-all outline-none"
                                />
                                <span className="absolute -top-3 -right-2 bg-[#baff02] text-[#0a0a0a] text-[10px] font-black px-2 py-0.5 rounded-lg shadow-lg">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Placeholder for other settings */}
                <div className="opacity-40 grayscale pointer-events-none bg-[#0a0a0a] rounded-[32px] p-8 border border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-gray-400">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Hạn mức rút tiền tối thiểu</h3>
                                <p className="text-xs text-gray-500 font-medium">Số dư tối thiểu để giảng viên có thể gửi yêu cầu rút tiền.</p>
                            </div>
                        </div>
                        <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Sắp ra mắt</span>
                    </div>
                </div>

                <div className="opacity-40 grayscale pointer-events-none bg-[#0a0a0a] rounded-[32px] p-8 border border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-gray-400">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Thông báo hệ thống</h3>
                                <p className="text-xs text-gray-500 font-medium">Tự động gửi email khi có yêu cầu mớI.</p>
                            </div>
                        </div>
                        <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Sắp ra mắt</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Info Box */}
        <div className="p-8 bg-blue-500/5 rounded-[32px] border border-blue-500/10 flex items-start space-x-4">
            <AlertCircle className="text-blue-500 mt-1" size={20} />
            <div className="space-y-2">
                <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest">Lưu ý về tỷ lệ hoa hồng</h4>
                <p className="text-xs text-blue-300/60 font-medium leading-relaxed">
                    Thay đổi tỷ lệ hoa hồng sẽ chỉ áp dụng cho các giao dịch phát sinh **sau thời điểm lưu**. Các khóa học đã sở hữu hoặc các giao dịch đang chờ xử lý sẽ giữ nguyên tỷ lệ cũ để đảm bảo tính minh bạch.
                </p>
            </div>
        </div>

        {isLoading && (
            <div className="fixed inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm z-[100] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#baff02]" size={48} />
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}
