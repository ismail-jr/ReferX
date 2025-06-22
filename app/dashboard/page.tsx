'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/signup'); // redirect if not logged in
      } else {
        setUser(currentUser);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }

        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user || !userData) return <div className="p-4">Error loading dashboard.</div>;

  const referralLink = `http://localhost:3000/signup?ref=${user.uid}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Welcome, {user.email}</h2>
        <div className="mb-3">
          <label className="font-semibold">Your Referral Link:</label>
          <input
            type="text"
            value={referralLink}
            className="input input-bordered w-full mt-1"
            readOnly
          />
        </div>
        <div className="mt-4">
          <p>
            <strong>Points:</strong> {userData.points}
          </p>
          <p>
            <strong>Referred By:</strong>{' '}
            {userData.referredBy ? userData.referredBy : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
