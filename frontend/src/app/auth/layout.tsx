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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C221F] flex flex-col relative overflow-hidden selection:bg-[#133E2B]/10 selection:text-[#133E2B]">
      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <img src="/images/logo.png" alt="Money Lab Logo" className="h-10 w-auto object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
        </Link>
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-sm font-bold text-[#1C221F]/70 hover:text-[#133E2B] transition-colors"
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
      <footer className="relative z-10 py-6 text-center text-xs font-medium text-[#1C221F]/50 border-t border-[#E8E3D9]">
        <p>
          &copy; 2026 Money Lab Academy. Tất cả quyền được bảo lưu.
        </p>
      </footer>
    </div>
  );
}
