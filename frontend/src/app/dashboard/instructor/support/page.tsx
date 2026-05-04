import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SupportSection } from '@/components/common/SupportSection';

export default function InstructorSupportPage() {
  return (
    <DashboardLayout role="instructor" title="Hỗ trợ">
      <SupportSection role="instructor" />
    </DashboardLayout>
  );
}
