import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReportsSection } from '@/components/common/ReportsSection';

export default function StudentReportsPage() {
  return (
    <DashboardLayout role="student" title="Báo cáo">
      <ReportsSection role="student" />
    </DashboardLayout>
  );
}
