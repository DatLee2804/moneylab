import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SupportSection } from '@/components/common/SupportSection';

export default function StudentSupportPage() {
  return (
    <DashboardLayout role="student" title="Hỗ trợ">
      <SupportSection role="student" />
    </DashboardLayout>
  );
}
