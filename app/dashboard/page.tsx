'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Main from '@/components/Main';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = true; // Replace with your auth logic
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar - fixed width and full height */}
        <div className="hidden md:block fixed h-screen w-72">
          <Sidebar />
        </div>
        
        {/* Main content - offset for sidebar on desktop */}
        <div className="flex-1 md:ml-60 pt-1">
          <div className="p-4 md:p-6">
            <Main />
          </div>
        </div>
      </div>
    </div>
  );
}