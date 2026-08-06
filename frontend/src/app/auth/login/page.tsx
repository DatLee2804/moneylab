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
      
      const postAuth = localStorage.getItem('postAuthAction');
      if (postAuth) {
        try {
          const parsed = JSON.parse(postAuth);
          localStorage.removeItem('postAuthAction');
          router.push(`${parsed.redirectUrl}?action=${parsed.action}`);
        } catch (e) {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-8 transition-all duration-500", isSocialRoleSelection ? "max-w-2xl mx-auto" : "max-w-md mx-auto")}>
      <div className="text-center">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1C221F] mb-2 leading-tight">
          {isSocialRoleSelection ? 'Chọn vai trò của bạn' : 'Chào mừng trở lại!'}
        </h1>
        <p className="text-xs text-[#1C221F]/60 font-medium">
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
            className="bg-white p-8 rounded-3xl border border-[#E8E3D9] shadow-xl overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#133E2B]" />
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C221F] pl-1">
                    Email của bạn
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E8E3D9] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#133E2B]/20 focus:outline-none transition-all text-[#1C221F] placeholder:text-gray-500"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-[#1C221F]">
                      Mật khẩu
                    </label>
                    <Link href="#" className="text-xs font-bold text-[#133E2B] hover:underline">
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
                      className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E8E3D9] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#133E2B]/20 focus:outline-none transition-all text-[#1C221F] placeholder:text-gray-500"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#133E2B] transition-colors"
                    >
                      <ShieldCheck size={17} className={showPassword ? "text-[#133E2B]" : ""} />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 bg-[#133E2B] text-[#1C221F] rounded-xl font-bold shadow-md hover:bg-[#0F2E1E] transition-all text-xs active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>Đăng nhập</span>}
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-[#E8E3D9]" />
                <span className="relative z-10 px-3 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Hoặc
                </span>
              </div>

              <button 
                type="button"
                onClick={() => setIsSocialRoleSelection(true)}
                className="w-full py-3.5 bg-[#FAF7F2] border border-[#E8E3D9] text-[#1C221F] rounded-xl font-bold text-xs flex items-center justify-center space-x-3 hover:bg-[#E8E3D9]/40 transition-all shadow-sm group active:scale-[0.98]"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
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
              className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-[#133E2B] transition-colors mb-2 w-fit"
            >
              <ArrowLeft size={14} />
              <span>Quay lại đăng nhập thường</span>
            </button>

            {[
              { id: 'STUDENT', label: 'Học viên', desc: 'Sử dụng tài khoản Google để học tập', icon: <UserIcon size={22} />, color: 'bg-[#133E2B]' },
              { id: 'INSTRUCTOR', label: 'Giảng viên', desc: 'Sử dụng tài khoản Google để giảng dạy', icon: <GraduationCap size={22} />, color: 'bg-[#0F2E1E]' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google?role=${item.id}`}
                className="group relative p-5 bg-white border border-[#E8E3D9] rounded-2xl text-left hover:border-[#133E2B] transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-[#1C221F] shadow-sm", item.color)}>
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-[#1C221F]">{item.label}</h3>
                    <p className="text-xs font-normal text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="text-gray-500 group-hover:text-[#133E2B] transition-colors" size={18} />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        {!isSocialRoleSelection && (
          <p className="text-xs font-medium text-gray-500">
            Chưa có tài khoản?{' '}
            <Link 
              href="/auth/register" 
              className="text-[#133E2B] font-bold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
