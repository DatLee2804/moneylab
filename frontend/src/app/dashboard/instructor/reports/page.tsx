import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReportsSection } from '@/components/common/ReportsSection';

export default function InstructorReportsPage() {
  return (
    <DashboardLayout role="instructor" title="Báo cáo">
      <ReportsSection role="instructor" />
    </DashboardLayout>
  );
}
