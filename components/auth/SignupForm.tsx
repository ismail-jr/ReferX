'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Gift, Eye, EyeOff, X, HandCoins } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { handleReferral } from '@/utils/HandleReferral'; 


export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });


  const ref = searchParams.get('ref');

  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handleReferral(ref, result.user);
      toast.success('Account created successfully!', {
        position: 'top-center',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed', {
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleReferral(ref, result.user);
      toast.success('Signed in with Google!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    }
  };

  const signInWithGitHub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleReferral(ref, result.user); 
      toast.success('Signed in with GitHub!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'GitHub sign-in failed');
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto p-8 mt-10 rounded-2xl shadow-lg border border-gray-200"
    >
      {/* Brand Header */}
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="flex justify-center mb-4"
        >
         <div className="flex items-center gap-2 mb-8 pl-2 pt-6">
           <div className="bg-blue-900 p-2 rounded-lg">
              <HandCoins className="text-white" size={20} />
            </div>
          <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
        </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
          <p className="text-gray-500">Start earning rewards with your network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused({...isFocused, email: true})}
              onBlur={() => setIsFocused({...isFocused, email: false})}
              className=" text-black placeholder-gray-800 block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
              placeholder="your@email.com"
              required
            />
            <div className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity ${isFocused.email || email ? 'opacity-100' : 'opacity-0'}`}>
              <Mail className="text-gray-800" size={18} />
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused({...isFocused, password: true})}
              onBlur={() => setIsFocused({...isFocused, password: false})}
              className="text-black placeholder-gray-800 block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
              placeholder="password"
              required
              minLength={8}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
              <button
                type="button"
                className={`text-gray-400 hover:text-gray-600 transition-colors ${isFocused.password || password ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <Lock 
                className={`text-gray-800 transition-opacity ${isFocused.password || password ? 'opacity-0' : 'opacity-100'}`} 
                size={18} 
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-blue-900">Minimum 8 characters</p>
        </div>

        {ref && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 bg-fuchsia-50/80 p-3 rounded-xl border border-fuchsia-100 text-sm text-blue-900"
          >
            <Gift className="text-blue-900" size={18} />
            <span>Using referral code: <span className="font-mono font-medium">{ref}</span></span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-950 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            <>
              Continue <ArrowRight className="ml-2" size={16} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6">
        <div className="relative text-center mb-4">
          <span className="text-sm text-gray-400 bg-white px-2 z-10 relative">or continue with</span>
          <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl shadow-xs hover:shadow-sm transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-700 font-medium">Google</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGitHub}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl shadow-xs hover:shadow-sm transition-all"
          >
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" />
            <span className="text-sm text-gray-700 font-medium">GitHub</span>
          </motion.button>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-900 hover:text-blue-950 transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </motion.div>
  );
}