'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SupportSection } from '@/components/common/SupportSection';

export default function ManagerSupportPage() {
  return (
    <DashboardLayout role="manager" title="Hỗ trợ hệ thống">
      <div className="max-w-7xl mx-auto uppercase">
        <SupportSection role="manager" />
      </div>
    </DashboardLayout>
  );
}
