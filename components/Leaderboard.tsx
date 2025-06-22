'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Crown } from 'lucide-react';

const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-700'];

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, 'users'), orderBy('points', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaders(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Crown className="text-yellow-500" size={20} />
        Leaderboard
      </h3>

      <ul className="space-y-3 text-sm">
        {leaders.map((user, index) => (
          <li
            key={user.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex items-center gap-2">
              {index < 3 && (
                <Crown
                  size={16}
                  className={`${medalColors[index]} inline-block`}
                />
              )}
              <span>{user.email}</span>
            </div>
            <span className="font-semibold">{user.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
