'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  QrCode, 
  Edit2, 
  Save,
  Loader2,
  Upload
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function StudentSettingsPage() {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    fullName: '',
    email: '',
    birthDate: '1995-05-20',
    bankName: '',
    bankAccount: '',
    avatar: 'https://i.pravatar.cc/150?u=student'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/users/${user.id}`);
        const data = response.data;
        setStudentInfo(prev => ({
          ...prev,
          fullName: data.name || '',
          email: data.email || '',
          bankName: data.bankName || '',
          bankAccount: data.bankAccount || '',
          avatar: data.avatar ? (data.avatar.startsWith('http') ? data.avatar : `${API_URL}${data.avatar}`) : 'https://i.pravatar.cc/150?u=student'
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
      setStudentInfo(prev => ({ ...prev, avatar: fullAvatarUrl }));
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
        name: studentInfo.fullName,
        bankName: studentInfo.bankName,
        bankAccount: studentInfo.bankAccount,
      });
      setIsEditing(false);
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
      <DashboardLayout role="student" title="Cài đặt tài khoản">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-[#baff02] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="Cài đặt tài khoản">
      <div className="max-w-4xl mx-auto pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className="w-32 h-32 rounded-3xl bg-gray-100 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative">
                  <Image src={studentInfo.avatar} alt="Avatar" fill className="object-cover" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  )}
                </div>
                {isEditing && !isUploading && (
                  <button 
                    onClick={handleUploadClick}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#baff02] text-[#0f172a] rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Upload size={18} />
                  </button>
                )}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white">{studentInfo.fullName}</h3>
                <p className="text-gray-500 font-medium">Học viên tại Money Lab</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Personal Info */}
            <section>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={16} />
                Thông tin cá nhân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 ml-1">Họ và tên</label>
                  <input 
                    type="text" 
                    value={studentInfo.fullName} 
                    onChange={(e) => setStudentInfo({...studentInfo, fullName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={studentInfo.email} 
                    disabled={true}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 ml-1">Ngày sinh</label>
                  <input 
                    type="date" 
                    value={studentInfo.birthDate} 
                    onChange={(e) => setStudentInfo({...studentInfo, birthDate: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                  />
                </div>
              </div>
            </section>

            {/* Bank Info */}
            <section>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={16} />
                Thông tin nhà tài trợ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">Tên ngân hàng</label>
                    <input 
                      type="text" 
                      value={studentInfo.bankName} 
                      onChange={(e) => setStudentInfo({...studentInfo, bankName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">Số tài khoản</label>
                    <input 
                      type="text" 
                      value={studentInfo.bankAccount} 
                      onChange={(e) => setStudentInfo({...studentInfo, bankAccount: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#baff02]/20 text-black dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Mã QR cá nhân</p>
                  <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
                    <QrCode size={100} className="text-[#0f172a]" />
                  </div>
                  {isEditing && (
                    <button className="mt-4 text-xs font-bold text-[#baff02] hover:underline">Tải lên</button>
                  )}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-end gap-4">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-[#0f172a] dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2 font-sans"
                >
                  <Edit2 size={18} />
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-[#0f172a] dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-sans disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#baff02] text-[#0f172a] font-bold rounded-xl hover:bg-[#8ec401] transition-all shadow-lg shadow-[#baff02]/20 flex items-center gap-2 font-sans disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Lưu thay đổi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

