'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, UserPlus, ArrowRight, Gift, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!', {
        position: 'top-center',
        style: {
          background: '#f0f9ff',
          color: '#0369a1',
          border: '1px solid #bae6fd'
        }
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed', {
        position: 'top-center',
        style: {
          background: '#fff1f2',
          color: '#e11d48',
          border: '1px solid #fecdd3'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UserPlus className="text-blue-600" size={26} strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Join the Community</h1>
        <p className="text-gray-500 text-sm">Start earning rewards with your network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-400" size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
        </div>

        {searchParams.get('ref') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm text-blue-700"
          >
            <Gift className="text-blue-500" size={16} />
            <span>Using referral code: <span className="font-mono font-medium">{searchParams.get('ref')}</span></span>
          </motion.div>
        )}

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600">
              I agree to the <a href="#" className="text-blue-600 hover:underline font-medium">Terms</a> and <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200"
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
              Get Started <ArrowRight className="ml-2" size={16} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </motion.div>
  );
}