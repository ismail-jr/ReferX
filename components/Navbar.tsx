'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import UserModal from './UserModal';
import { signOut } from 'firebase/auth';


export default function Navbar({ points, referralLink }: { points: number; referralLink: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      <div className="navbar bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-fuchsia-600">ReferX</h1>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#refer" className="hover:text-fuchsia-600 transition-all">Refer a Friend</a>
          <a href="#leaderboard" className="hover:text-yellow-600 transition-all">Leaderboard</a>

          {user && (
            <div
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              title="Account"
            >
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && user && (
        <UserModal
          user={user}
          referralLink={referralLink}
          points={points}
          onClose={() => setIsModalOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
