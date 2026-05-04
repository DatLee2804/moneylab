'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Upload, 
  UserCircle, 
  Mail, 
  Phone, 
  Award, 
  CreditCard, 
  QrCode, 
  Save, 
  Edit2,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function InstructorSettingsPage() {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [instructorInfo, setInstructorInfo] = useState({
    avatar: 'https://i.pravatar.cc/150?u=instructor',
    fullName: '',
    email: '',
    phone: '',
    categories: ['AI', 'Đầu Tư'],
    summary: '',
    achievements: '',
    bankName: '',
    bankAccount: '',
    bankBranch: '',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STK:1234567890-VCB'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/users/${user.id}`);
        const data = response.data;
        setInstructorInfo(prev => ({
          ...prev,
          fullName: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          bankName: data.bankName || '',
          bankAccount: data.bankAccount || '',
          bankBranch: data.bankBranch || '',
          avatar: data.avatar ? (data.avatar.startsWith('http') ? data.avatar : `${API_URL}${data.avatar}`) : 'https://i.pravatar.cc/150?u=instructor',
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await api.post('/uploads/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const avatarPath = uploadRes.data.url;
      const fullAvatarUrl = `${API_URL}${avatarPath}`;

      // Update user in DB
      await api.patch(`/users/${user.id}`, {
        avatar: avatarPath
      });

      // Update local state and store
      setInstructorInfo(prev => ({ ...prev, avatar: fullAvatarUrl }));
      if (setUser) {
        setUser({ ...user, avatar: avatarPath });
      }
      
      alert('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Tải ảnh lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await api.patch(`/users/${user.id}`, {
        name: instructorInfo.fullName,
        phone: instructorInfo.phone,
        bankName: instructorInfo.bankName,
        bankAccount: instructorInfo.bankAccount,
        bankBranch: instructorInfo.bankBranch,
      });
      setIsEditingProfile(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      alert('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="instructor" title="Cài đặt tài khoản">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-[#baff02] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor" title="Cài đặt tài khoản">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className="relative w-32 h-32">
                  <Image 
                    src={instructorInfo.avatar} 
                    alt="Avatar" 
                    fill
                    className="rounded-3xl object-cover border-4 border-gray-50 dark:border-gray-700"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center text-white">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  )}
                </div>
                {isEditingProfile && !isUploading && (
                  <button 
                    onClick={handleUploadClick}
                    className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload size={24} />
                  </button>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">{instructorInfo.fullName}</h3>
                <p className="text-sm text-gray-500">Giảng viên chuyên nghiệp</p>
              </div>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Họ và Tên</label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled={!isEditingProfile}
                    value={instructorInfo.fullName}
                    onChange={(e) => setInstructorInfo({...instructorInfo, fullName: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-10 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                  />
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    disabled={true}
                    value={instructorInfo.email}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-10 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled={!isEditingProfile}
                    value={instructorInfo.phone}
                    onChange={(e) => setInstructorInfo({...instructorInfo, phone: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-10 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thể loại giảng dạy</label>
                <div className="flex flex-wrap gap-2">
                  {['Đầu Tư', 'Tài chính', 'Marketing', 'AI'].map(cat => (
                    <button 
                      key={cat}
                      disabled={!isEditingProfile}
                      onClick={() => {
                        const newCats = instructorInfo.categories.includes(cat)
                          ? instructorInfo.categories.filter(c => c !== cat)
                          : [...instructorInfo.categories, cat];
                        setInstructorInfo({...instructorInfo, categories: newCats});
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        instructorInfo.categories.includes(cat)
                          ? "bg-[#baff02] text-[#0f172a]"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tóm tắt giới thiệu</label>
              <textarea 
                disabled={!isEditingProfile}
                value={instructorInfo.summary}
                onChange={(e) => setInstructorInfo({...instructorInfo, summary: e.target.value})}
                rows={3}
                className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 resize-none text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thành tích đạt được</label>
              <div className="relative">
                <textarea 
                  disabled={!isEditingProfile}
                  value={instructorInfo.achievements}
                  onChange={(e) => setInstructorInfo({...instructorInfo, achievements: e.target.value})}
                  rows={2}
                  className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-10 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 resize-none text-black dark:text-white"
                />
                <Award className="absolute left-3 top-4 text-gray-400" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-6 flex items-center space-x-2">
            <CreditCard size={20} className="text-[#baff02]" />
            <span>Thông tin thanh toán</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên ngân hàng</label>
                <input 
                  type="text" 
                  disabled={!isEditingProfile}
                  value={instructorInfo.bankName}
                  onChange={(e) => setInstructorInfo({...instructorInfo, bankName: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 disabled:opacity-60 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số tài khoản</label>
                <input 
                  type="text" 
                  disabled={!isEditingProfile}
                  value={instructorInfo.bankAccount}
                  onChange={(e) => setInstructorInfo({...instructorInfo, bankAccount: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 disabled:opacity-60 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chi nhánh</label>
                <input 
                  type="text" 
                  disabled={!isEditingProfile}
                  value={instructorInfo.bankBranch}
                  onChange={(e) => setInstructorInfo({...instructorInfo, bankBranch: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 disabled:opacity-60 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider self-start">Mã QR thanh toán</label>
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative w-32 h-32">
                <Image 
                  src={instructorInfo.qrCode} 
                  alt="QR Code" 
                  fill
                  className="p-2"
                />
              </div>
              {isEditingProfile && (
                <button className="text-xs font-bold text-[#baff02] hover:underline flex items-center space-x-1">
                  <QrCode size={14} />
                  <span>Cập nhật mã QR</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {!isEditingProfile ? (
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center space-x-2 px-8 py-3 bg-[#baff02] text-[#0f172a] rounded-xl font-bold shadow-lg shadow-[#baff02]/20 hover:bg-[#baff02]/90 transition-all font-sans"
            >
              <Edit2 size={18} />
              <span>Chỉnh sửa thông tin</span>
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditingProfile(false)}
                disabled={isSaving}
                className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-sans disabled:opacity-50"
              >
                Hủy
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-8 py-3 bg-[#baff02] text-[#0f172a] rounded-xl font-bold shadow-lg shadow-[#baff02]/20 hover:bg-[#8ec401] transition-all font-sans disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>Lưu thay đổi</span>
              </button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

