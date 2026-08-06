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
      <body suppressHydrationWarning className={cn(beVietnamPro.variable, "font-sans antialiased bg-[#FAF7F2] text-[#1C221F] selection:bg-[#133E2B]/20 selection:text-[#133E2B]")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
