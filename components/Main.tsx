'use client';

import { useEffect, useState } from 'react';
import { Gift, Copy, Trophy, LinkIcon, Twitter, Facebook, MessagesSquare, Mail, Share2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { motion,  } from 'framer-motion';




import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from 'firebase/firestore';

export default function Main() {
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const shareViaEmail = () => {
    const subject = "Join me and earn rewards!";
    const body = `Hi there,\n\nI thought you might be interested in joining this platform. Use my referral link to sign up and we'll both earn rewards!\n\n${referralLink}\n\nCheers!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaSMS = () => {
    const message = `Join me and earn rewards! Use my referral link: ${referralLink}`;
    window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
  };

  const shareOnSocial = (platform: string) => {
    let url = '';
    const text = "Join me and earn rewards with this referral link!";
    
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await fetchDashboardData(authUser.uid, authUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (uid: string, email: string | null) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    setUserStats(userDoc.exists() ? userDoc.data() : null);

    const leaderboardQuery = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(5)
    );
    const leaderboardSnap = await getDocs(leaderboardQuery);
    const leaderboardData = leaderboardSnap.docs.map((doc, index) => ({
      rank: index + 1,
      name: doc.data().email || 'Anonymous',
      referrals: doc.data().points || 0
    }));

    const currentUserInList = leaderboardData.some((item) => item.name === email);
    if (!currentUserInList && email) {
      leaderboardData.push({
        rank: leaderboardData.length + 1,
        name: email,
        referrals: userDoc.data()?.points || 0
      });
    }

    setLeaderboard(leaderboardData);

    const activityQuery = query(
      collection(db, 'referrals'),
      where('referrerId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const activitySnap = await getDocs(activityQuery);
    const activityData = activitySnap.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }));
    setRecentActivity(activityData);
  };

  const referralLink = user?.uid
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/join?ref=${user.uid}`
    : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!', {
        position: 'top-center',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0'
        }
      });
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <div className="space-y-6 pl-5">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 pt-9">
        <h1 className="text-3xl font-semibold text-blue-900">
          👋 Welcome back, {user?.displayName || user?.email || 'Friend'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your referrals today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard name="Total Referrals" value={userStats?.points || 0} change="+12%" />
        <StatCard name="Active Users" value={leaderboard.length} change="+5%" />
        <StatCard name="Rewards Earned ($0.5 per point)" value={(userStats?.points || 0) * 0.5} change="+23%" />
        <StatCard
          name="Leaderboard Rank"
          value={(leaderboard.findIndex(item => item.name === user?.email) + 1) || 0}
          change="↑ improving"
        />      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-900">Leaderboard</h2>
            <a href="/dashboard/leaderboard" className="text-sm text-blue-700 hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {leaderboard.map((item, index) => {
              const isCurrentUser = item.name === user?.email;
              let icon = null;

              if (index === 0) icon = <Trophy size={16} className="text-yellow-500" />;
              else if (index === 1) icon = <Trophy size={16} className="text-gray-400" />;
              else if (index === 2) icon = <Trophy size={16} className="text-amber-700" />;

              return (
                <motion.div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${isCurrentUser ? 'bg-blue-50' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 flex items-center justify-center">
                      {icon || <span className="w-6 h-6 rounded-full text-xs bg-gray-100 text-gray-600 flex items-center justify-center">{item.rank}</span>}
                    </span>
                    <span className={isCurrentUser ? 'font-medium text-blue-900' : 'text-gray-700'}>{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.referrals} referrals</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="bg-fuchsia-100 p-2 rounded-lg mr-3">
                    <Gift className="text-fuchsia-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.newUserEmail}</p>
                    <p className="text-xs text-gray-500">Referred • {new Date(activity.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-sm font-medium text-fuchsia-600">+1 point</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity yet.</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="bg-gradient-to-r from-white to-gray-300 rounded-xl shadow-sm p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-blue-900">Your Referral Link</h2>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className=" bg-blue-900 text-white cursor-pointer px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition"
            >
              <Copy size={16} /> Copy
            </button>
            <button
              onClick={() => navigator.share?.({ 
                title: 'Join me and earn rewards!',
                text: 'Use my referral link to sign up:',
                url: referralLink 
              }).catch(() => toast.error("Sharing not supported"))}
              className="bg-blue-700 text-white cursor-pointer px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
        <p className="text-blue-900 mb-4">Share this link and earn rewards for every friend who joins!</p>
        {referralLink && (
    <QRCode referralLink={referralLink} />

)}

        <div className="bg-gray-400 p-3 rounded-lg overflow-x-auto mb-4">
          <code className="text-lg text-blue-700">{referralLink}</code>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={shareViaEmail}
            className="bg-white text-gray-800 border border-gray-300 cursor-pointer px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <Mail size={16} /> Email
          </button>
          <button
            onClick={shareViaSMS}
            className="bg-white text-gray-800 border border-gray-300 cursor-pointer px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <MessagesSquare size={16} /> SMS
          </button>
          <button
            onClick={() => shareOnSocial('facebook')}
            className="bg-white text-gray-800 border border-gray-300 cursor-pointer px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <Facebook size={16} className="text-blue-600" /> Facebook
          </button>
          <button
            onClick={() => shareOnSocial('twitter')}
            className="bg-white text-gray-800 border border-gray-300 cursor-pointer px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <Twitter size={16} className="text-blue-400" /> Twitter
          </button>
          <button
            onClick={() => shareOnSocial('linkedin')}
            className="bg-white text-gray-800 border border-gray-300 cursor-pointer px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <LinkIcon size={16} className="text-blue-700" /> LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect as useCountEffect, useState as useCountState } from 'react';
import QRCode from './QRcode';

function StatCard({ name, value, change }: { name: string; value: number; change: string }) {
  const [count, setCount] = useCountState(0);

  useCountEffect(() => {
    let start = 0;
    const end = Number(value);
    if (isNaN(end)) return;
    if (start === end) return;
    let incrementTime = 20;
    const increment = end / (1000 / incrementTime);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Number(start.toFixed(0)));
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
      <p className="text-sm text-gray-700 font-medium">{name}</p>
      <div className="flex items-end justify-between mt-2">
        <motion.p
          className="text-2xl font-bold text-blue-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {typeof value === 'number' && !isNaN(value) ? count : value}
        </motion.p>
        <span className="text-sm font-semibold text-blue-900">{change}</span>
      </div>
    </div>
  );
}
