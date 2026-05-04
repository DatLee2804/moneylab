'use client';

import React from 'react';
import { DashboardPagePlaceholder } from '@/components/common/DashboardPagePlaceholder';
import { FileText } from 'lucide-react';

export default function AffiliateReportsPage() {
  return (
    <DashboardPagePlaceholder 
      role="affiliate"
      title="Báo cáo"
      description="Trung tâm báo cáo dành cho cộng tác viên. Theo dõi hoa hồng, lượt click và chuyển đổi từ các link affiliate của bạn."
      icon={<FileText size={40} />}
    />
  );
}
