'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DashboardPagePlaceholderProps {
  role: 'student' | 'instructor' | 'manager' | 'admin' | 'affiliate';
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const DashboardPagePlaceholder = ({ role, title, description, icon }: DashboardPagePlaceholderProps) => {
  return (
    <DashboardLayout role={role} title={title}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[#0f172a] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center"
      >
        <div className="w-20 h-20 bg-[#baff02]/10 rounded-[32px] flex items-center justify-center text-[#baff02] mb-8 animate-pulse">
          {icon}
        </div>
        <h2 className="text-2xl font-black text-[#0f172a] dark:text-white mb-4">{title} Đang Phát Triển</h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed font-medium">
          {description}
        </p>
        <div className="mt-10 flex gap-4">
          <div className="h-2 w-12 bg-[#baff02] rounded-full"></div>
          <div className="h-2 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-2 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};
