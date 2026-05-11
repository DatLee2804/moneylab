'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Ensure user obj aligns with the expected structure
        setAuth(user, token);
        
        const postAuth = localStorage.getItem('postAuthAction');
        if (postAuth) {
          try {
            const parsed = JSON.parse(postAuth);
            localStorage.removeItem('postAuthAction');
            router.push(`${parsed.redirectUrl}?action=${parsed.action}`);
          } catch (e) {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to parse user data from URL', error);
        router.push('/auth/login?error=auth_failed');
      }
    } else {
      router.push('/auth/login?error=auth_failed');
    }
  }, [router, searchParams, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#baff02] mx-auto" />
        <p className="text-white font-medium">Đang xác thực, vui lòng chờ...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-[#baff02] mx-auto" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
