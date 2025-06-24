import { User } from 'firebase/auth';

export const handleReferral = async (ref: string | null, user: User) => {
  if (!ref || !user?.uid || !user?.email) {
    return { success: true }; // Allow if no referral was provided
  }

  try {
    // Prevent self-referral
    if (ref === user.uid) {
      return { success: false, message: 'You cannot refer yourself.' };
    }

    // Get user's public IP
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipRes.json();

    // Send to backend
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
      return { success: false, message: data.error || 'Referral failed.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Referral tracking failed:', err);
    return { success: false, message: 'Referral tracking failed.' };
  }
};
