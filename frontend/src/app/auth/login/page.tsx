'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, Github, Chrome, Loader2, User as UserIcon, GraduationCap, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/utils';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isSocialRoleSelection, setIsSocialRoleSelection] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { user, access_token } = response.data;
      
      setAuth(user, access_token);
      
      // Redirect to Home instead of Dashboard
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-10 transition-all duration-500", isSocialRoleSelection ? "max-w-2xl mx-auto" : "max-w-md mx-auto")}>
      <div className="text-center">
        <h1 className="text-3xl font-black text-white mb-2 leading-tight">
          {isSocialRoleSelection ? 'Chọn vai trò của bạn' : 'Chào mừng trở lại!'}
        </h1>
        <p className="text-sm font-medium text-gray-500">
          {isSocialRoleSelection ? 'Vui lòng chọn vai trò để tiếp tục đăng nhập với Google' : 'Đăng nhập ngay để tiếp tục hành trình của bạn'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSocialRoleSelection ? (
          <motion.div 
            key="login-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 w-full h-[6px] bg-[#baff02] opacity-80" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">
                    Email của bạn
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none transition-all text-white placeholder:text-gray-700"
                    />
                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Mật khẩu
                    </label>
                    <Link href="#" className="text-[10px] font-black text-[#baff02] uppercase tracking-widest hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none transition-all text-white placeholder:text-gray-700"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#baff02] transition-colors"
                    >
                      <ShieldCheck size={18} className={showPassword ? "text-[#baff02]" : ""} />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-[#baff02] text-[#0a0a0a] rounded-2xl font-black shadow-lg shadow-[#baff02]/20 hover:bg-[#8ec401] active:bg-[#baff02] transition-all font-sans active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Đăng nhập</span>}
              </button>

              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-white/5" />
                <span className="relative z-10 px-4 bg-[#141414] text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Hoặc
                </span>
              </div>

              <button 
                type="button"
                onClick={() => setIsSocialRoleSelection(true)}
                className="w-full py-4 bg-[#0a0a0a] border border-white/5 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-white/5 transition-all shadow-sm group active:scale-[0.98]"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                </div>
                <span>Tiếp tục với Google</span>
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="social-role-selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 gap-4"
          >
            <button 
              onClick={() => setIsSocialRoleSelection(false)}
              className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#baff02] transition-colors mb-2 w-fit"
            >
              <ArrowLeft size={14} />
              <span>Quay lại đăng nhập thường</span>
            </button>

            {[
              { id: 'STUDENT', label: 'Học viên', desc: 'Sử dụng tài khoản Google để học tập', icon: <UserIcon size={24} />, color: 'bg-blue-500' },
              { id: 'INSTRUCTOR', label: 'Giảng viên', desc: 'Sử dụng tài khoản Google để giảng dạy', icon: <GraduationCap size={24} />, color: 'bg-[#baff02]' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => window.location.href = `http://localhost:3001/auth/google?role=${item.id}`}
                className="group relative p-6 bg-[#141414] border border-white/5 rounded-[32px] text-left hover:border-[#baff02] transition-all shadow-sm hover:shadow-xl active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-white uppercase tracking-tight">{item.label}</h3>
                    <p className="text-xs font-medium text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-[#baff02] transition-colors" size={20} />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        {!isSocialRoleSelection && (
          <p className="text-sm font-medium text-gray-500">
            Chưa có tài khoản?{' '}
            <Link 
              href="/auth/register" 
              className="text-[#baff02] font-black hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
