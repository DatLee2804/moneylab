'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReportsSection } from '@/components/common/ReportsSection';

export default function AdminReportsPage() {
  return (
    <DashboardLayout role="admin" title="Toàn bộ Báo cáo">
      <div className="max-w-7xl mx-auto uppercase">
        <ReportsSection role="admin" />
      </div>
    </DashboardLayout>
  );
}
