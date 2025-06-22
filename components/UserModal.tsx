// components/UserModal.tsx
'use client';

import { ClipboardCopy, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { User } from 'firebase/auth';

interface Props {
  user: User;
  points: number;
  referralLink: string;
  onClose: () => void;
  onLogout: () => void;
}

export default function UserModal({ user, points, referralLink, onClose, onLogout }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="mb-2">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-semibold mx-auto">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <p className="font-semibold text-gray-800">Hello,</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          <p className="font-medium">✨ Points Earned: <span className="text-fuchsia-600">{points}</span></p>
        </div>

        <div>
          <label className="text-sm text-gray-600 font-medium mb-1 block">🔗 Your Referral Link</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={referralLink}
              className="input input-bordered w-full text-xs"
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
        </div>

        <div className="mt-6">
          <button
            onClick={onLogout}
            className="btn btn-error btn-sm text-white w-full"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
