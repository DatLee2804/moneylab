'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReportsSection } from '@/components/common/ReportsSection';

export default function ManagerReportsPage() {
  return (
    <DashboardLayout role="manager" title="Quản lý Báo cáo">
      <div className="max-w-7xl mx-auto uppercase">
        <ReportsSection role="manager" />
      </div>
    </DashboardLayout>
  );
}
