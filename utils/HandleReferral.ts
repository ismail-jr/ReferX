// utils/handleReferral.ts

import { User } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export const handleReferral = async (ref: string | null, user: User) => {
  if (!ref || !user?.uid || !user?.email) return;

  try {
    // Prevent self-referral client-side (early return)
    if (ref === user.uid) {
      toast.error('You cannot refer yourself.');
      return;
    }

    const ipRes = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipRes.json();

    const res = await fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrerId: ref,
        newUserUID: user.uid,
        newUserEmail: user.email,
        newUserIP: ip,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
        switch (data.error) {
          case 'You cannot refer yourself.':
            toast.error('You cannot refer yourself.');
            break;
          case 'This email has already been referred.':
            toast.error('This email has already been used for a referral.');
            break;
          case 'This IP has already been used for referral.':
            toast.error('This device has already been used for a referral.');
            break;
          default:
            toast.error(data.error || 'Referral failed.');
        }
      
        console.warn('Referral error:', data.error);
      }
      
  } catch (err) {
    console.error('Referral tracking failed:', err);
    toast.error('Referral tracking failed.');
  }
};
