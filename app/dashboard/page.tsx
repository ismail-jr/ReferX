'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { ClipboardCopy } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [leaders, setLeaders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          // First-time login: create user in Firestore
          if (docSnap.exists()) {
            const userInfo = docSnap.data();
            setUserData(userInfo);
          } else {
            const referredBy = localStorage.getItem('referredBy'); // retrieve referrer
            const newUser = {
              email: currentUser.email,
              referredBy: referredBy || null,
              points: 0,
              createdAt: serverTimestamp(),
            };
            await setDoc(docRef, newUser);
            setUserData(newUser);
          }

          await loadLeaderboard();
        } catch (err) {
          toast.error('Error fetching user data.');
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadLeaderboard = async () => {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLeaders(data);
  };

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL}/signup?ref=${user?.uid}`;

  if (loading) return <LoadingSpinner />;

  if (!user || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center text-gray-600">
          <p className="text-lg">Unable to load dashboard. Try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
       <Navbar points={userData.points} referralLink={referralLink} />

      <div className="p-6 max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Intro Section */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-white to-fuchsia-50 rounded-xl shadow border border-gray-100 p-6">
          <h1 className="text-3xl font-bold text-center text-fuchsia-600 mb-2">Welcome to ReferX</h1>
          <p className="text-center text-gray-700 text-sm max-w-2xl mx-auto mb-6">
            ReferX is a referral-based platform that rewards users for inviting friends.
            Track your referrals, earn points, and climb the leaderboard to win amazing perks.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-fuchsia-600 mb-1">🎯 Easy Referrals</h3>
              <p className="text-gray-600 text-sm">Share your unique link and get rewarded when friends sign up.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-fuchsia-600 mb-1">🏆 Live Leaderboard</h3>
              <p className="text-gray-600 text-sm">Compete with others and track your position in real time.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-fuchsia-600 mb-1">🔒 Secure System</h3>
              <p className="text-gray-600 text-sm">Powered by Firebase Auth & Firestore with fraud prevention.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-fuchsia-600 mb-1">💰 Earn Points</h3>
              <p className="text-gray-600 text-sm">Convert points into rewards as you grow your referrals.</p>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div id='refer' className="bg-white shadow-lg rounded-xl p-6 w-full border border-gray-100">
          <h2 className="text-xl font-semibold text-fuchsia-600 mb-4">Share Your Link and Get Points</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={referralLink}
              className="input input-bordered w-full"
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              className="btn btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                toast.success('Copied!');
              }}
            >
              <ClipboardCopy size={16} />
            </button>
          </div>
          <div className="space-y-1 text-gray-700 text-sm">
            <p><strong className="text-gray-900">Points:</strong> {userData.points}</p>
            <p><strong className="text-gray-900">Referred By:</strong> {userData.referredBy || '—'}</p>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div id='leaderboard' className="bg-white shadow-lg rounded-xl p-6 w-full border border-gray-100">
          <h2 className="text-xl font-semibold text-yellow-600 mb-4">Leaderboard</h2>
          <ul className="space-y-2">
            {leaders.map((entry, index) => (
              <li key={entry.id} className="flex justify-between border-b pb-2">
                <span>
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `${index + 1}.`} {entry.email}
                </span>
                <span className="font-bold">{entry.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
