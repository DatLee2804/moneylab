'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SupportSection } from '@/components/common/SupportSection';

export default function AdminSupportPage() {
  return (
    <DashboardLayout role="admin" title="Toàn bộ Hỗ trợ">
      <div className="max-w-7xl mx-auto uppercase">
        <SupportSection role="admin" />
      </div>
    </DashboardLayout>
  );
}
