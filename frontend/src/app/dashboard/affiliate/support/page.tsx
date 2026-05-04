'use client';

import React from 'react';
import { DashboardPagePlaceholder } from '@/components/common/DashboardPagePlaceholder';
import { LifeBuoy } from 'lucide-react';

export default function AffiliateSupportPage() {
  return (
    <DashboardPagePlaceholder 
      role="affiliate"
      title="Hỗ trợ"
      description="Hệ thống hỗ trợ dành cho cộng tác viên. Liên hệ để nhận tư vấn về cách tối ưu hóa link affiliate và các vấn đề về rút tiền hoa hồng."
      icon={<LifeBuoy size={40} />}
    />
  );
}
