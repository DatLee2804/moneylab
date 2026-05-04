import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { cn } from '@/utils/utils';
import Providers from '../components/Providers';

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ['vietnamese', 'latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
});

export const metadata = {
  title: 'Money Lab - Nền tảng đào tạo Tài chính & AI thực chiến',
  description: 'Khóa học tài chính, AI và kinh doanh thực chiến cho người đi làm và chủ doanh nghiệp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn(beVietnamPro.variable, "font-sans antialiased bg-[#0a0a0a] text-white selection:bg-[#baff02]/30 selection:text-[#baff02]")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
