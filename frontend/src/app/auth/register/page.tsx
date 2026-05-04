'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  GraduationCap, 
  Phone, 
  Mail, 
  CreditCard, 
  Building2, 
  MapPin, 
  ChevronRight,
  ArrowLeft,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type Role = 'student' | 'instructor';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [role, setRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    bankAccount: '',
    bankName: '',
    bankBranch: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Map frontend role to backend enum
      const backendRole = role === 'student' ? 'STUDENT' : 'INSTRUCTOR';
      
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: backendRole,
        ...(role === 'instructor' && {
          bankAccount: formData.bankAccount,
          bankName: formData.bankName,
          bankBranch: formData.bankBranch
        })
      };

      const response = await api.post('/auth/register', payload);
      const { user, access_token } = response.data;
      
      setAuth(user, access_token);
      
      // Redirect to Home instead of Dashboard
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-8 transition-all duration-500", role ? "max-w-2xl mx-auto" : "max-w-md")}>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white leading-tight">
          {role ? `Đăng ký ${role === 'student' ? 'Học viên' : 'Giảng viên'}` : 'Tham gia cùng chúng tôi'}
        </h1>
        <p className="text-sm font-medium text-gray-500">
          {role ? 'Vui lòng cung cấp thông tin bên dưới' : 'Chọn vai trò của bạn để bắt đầu'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!role ? (
          <motion.div 
            key="role-selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 gap-4"
          >
            {[
              { id: 'student', label: 'Học viên', desc: 'Học tập và phát triển kỹ năng mới', icon: <User size={24} />, color: 'bg-blue-500' },
              { id: 'instructor', label: 'Giảng viên', desc: 'Chia sẻ kiến thức và tạo thu nhập', icon: <GraduationCap size={24} />, color: 'bg-[#baff02]' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setRole(item.id as Role)}
                className="group relative p-6 bg-[#141414] border border-white/5 rounded-[32px] text-left hover:border-[#baff02] transition-all shadow-sm hover:shadow-xl active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-white uppercase tracking-tight">{item.label}</h3>
                    <p className="text-xs font-medium text-gray-400">{item.desc}</p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-[#baff02] transition-colors" size={20} />
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="registration-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[6px] bg-[#baff02] opacity-80" />
            
            <button 
              onClick={() => setRole(null)}
              className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#baff02] transition-colors mb-8"
            >
              <ArrowLeft size={14} />
              <span>Quay lại chọn vai trò</span>
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Common Fields */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Họ và Tên</label>
                  <div className="relative">
                    <input name="name" required onChange={handleInputChange} placeholder="Nguyễn Văn A" value={formData.name} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none text-white placeholder:text-gray-700" />
                    <User className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Số điện thoại</label>
                  <div className="relative">
                    <input name="phone" type="tel" onChange={handleInputChange} placeholder="0901234567" value={formData.phone} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none text-white placeholder:text-gray-700" />
                    <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Email</label>
                  <div className="relative">
                    <input name="email" type="email" required onChange={handleInputChange} placeholder="email@example.com" value={formData.email} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none text-white placeholder:text-gray-700" />
                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Mật khẩu</label>
                  <div className="relative">
                    <input 
                      name="password" 
                      required
                      type={showPassword ? 'text' : 'password'} 
                      onChange={handleInputChange} 
                      placeholder="••••••••" 
                      value={formData.password}
                      className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none text-white placeholder:text-gray-700" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#baff02] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Instructor Specific Fields */}
                <AnimatePresence>
                  {role === 'instructor' && (
                    <motion.div 
                      className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Số tài khoản</label>
                        <div className="relative">
                          <input name="bankAccount" onChange={handleInputChange} placeholder="0123456789" value={formData.bankAccount} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none text-white placeholder:text-gray-700" />
                          <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Ngân hàng</label>
                        <div className="relative">
                          <input name="bankName" onChange={handleInputChange} placeholder="Vietcombank" value={formData.bankName} className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#baff02]/20 focus:outline-none text-white placeholder:text-gray-700" />
                          <Building2 className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4 flex flex-col space-y-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-[#baff02] text-[#0a0a0a] rounded-2xl font-black shadow-lg shadow-[#baff02]/20 hover:bg-[#8ec401] transition-all font-sans active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Đăng ký ngay</span>}
                </button>
                <div className="relative py-4 flex items-center justify-center">
                  <div className="absolute w-full h-[1px] bg-white/5" />
                  <span className="relative z-10 px-4 bg-[#141414] text-[10px] font-black text-gray-500 uppercase tracking-widest">Hoặc</span>
                </div>
                <button type="button" onClick={() => window.location.href = `http://localhost:3001/auth/google?role=${role === 'instructor' ? 'INSTRUCTOR' : 'STUDENT'}`} className="w-full py-4 bg-[#0a0a0a] border border-white/5 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-white/5 transition-all shadow-sm active:scale-[0.98]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Đăng ký với Google</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="text-[#baff02] font-black hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
