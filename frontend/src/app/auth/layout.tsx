'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden selection:bg-[#baff02]/30 selection:text-[#baff02]">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#baff02]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-[#baff02] rounded-xl flex items-center justify-center shadow-lg shadow-[#baff02]/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">
            Money Lab
          </span>
        </Link>
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-[#baff02] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Về trang chủ</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          &copy; 2024 Money Lab - Nền tảng đào tạo Tài chính & AI thực chiến
        </p>
      </footer>
    </div>
  );
}
