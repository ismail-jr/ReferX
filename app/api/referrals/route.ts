import { NextRequest, NextResponse } from 'next/server';
import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  increment,
  collection,
} from '@/lib/firebase';

const getTimestamp = () => new Date().toISOString();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { referrerId, newUserUID, newUserEmail, newUserIP } = body;

    if (!referrerId || !newUserUID || !newUserEmail || !newUserIP) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 🚫 Prevent self-referral
    if (referrerId === newUserUID) {
      return NextResponse.json({ error: 'You cannot refer yourself.' }, { status: 400 });
    }

    const referralsRef = collection(db, 'referrals');

    // ❌ Check for duplicate email or IP
    const emailCheck = await getDocs(query(referralsRef, where('newUserEmail', '==', newUserEmail)));
    if (!emailCheck.empty) {
      return NextResponse.json({ error: 'This email has already been referred.' }, { status: 400 });
    }

    const ipCheck = await getDocs(query(referralsRef, where('newUserIP', '==', newUserIP)));
    if (!ipCheck.empty) {
      return NextResponse.json({ error: 'This IP has already been used for referral.' }, { status: 400 });
    }

    // ✅ Save referral entry
    const newRef = doc(referralsRef);
    await setDoc(newRef, {
      referrerId,
      newUserUID,
      newUserEmail,
      newUserIP,
      createdAt: getTimestamp(),
    });

    // ✅ Create/Update referred user profile (+1 bonus point)
    const newUserDoc = doc(db, 'users', newUserUID);
    await setDoc(
      newUserDoc,
      {
        email: newUserEmail,
        referredBy: referrerId,
        points: 1,
        createdAt: new Date(),
      },
      { merge: true }
    );

    // ✅ Update referrer profile: +1 point + milestone check
    const referrerDoc = doc(db, 'users', referrerId);
    const referrerSnap = await getDoc(referrerDoc);

    if (referrerSnap.exists()) {
      const data = referrerSnap.data();
      const currentPoints = data.points || 0;
      const newPoints = currentPoints + 1;

      const milestones: Record<number, string> = {
        5: 'Bronze',
        10: 'Silver',
        20: 'Gold',
      };

      const updates: any = { points: increment(1) };

      const milestone = milestones[newPoints];
      if (milestone) {
        updates.milestone = milestone;
      }

      await updateDoc(referrerDoc, updates);
    } else {
      // First referral ever — set up referrer
      await setDoc(referrerDoc, {
        points: 1,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Referral API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
