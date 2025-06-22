'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { UserPlus, Gift, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left: Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8"
      >
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Right: Graphic Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50/30 to-white items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-100/30 blur-xl"></div>
        <div className="absolute -left-20 bottom-0 w-72 h-72 rounded-full bg-blue-200/20 blur-xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 max-w-md p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <UserPlus className="text-blue-600" size={24} strokeWidth={1.8} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Join Our Community
            </h2>
          </motion.div>
          
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Earn <span className="font-medium text-blue-600">exclusive rewards</span> by inviting friends. 
            Get started today and unlock premium benefits.
          </p>
          
          <ul className="space-y-5">
            <motion.li 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-4"
            >
              <div className="p-2 bg-blue-100/50 rounded-lg mt-0.5">
                <Gift className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Instant rewards</h3>
                <p className="text-gray-500 text-sm">Earn points for every successful referral</p>
              </div>
            </motion.li>
            
            <motion.li 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-4"
            >
              <div className="p-2 bg-blue-100/50 rounded-lg mt-0.5">
                <TrendingUp className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Real-time tracking</h3>
                <p className="text-gray-500 text-sm">Monitor your progress on our leaderboard</p>
              </div>
            </motion.li>
            
            <motion.li 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-4"
            >
              <div className="p-2 bg-blue-100/50 rounded-lg mt-0.5">
                <ShieldCheck className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Secure system</h3>
                <p className="text-gray-500 text-sm">Advanced fraud detection technology</p>
              </div>
            </motion.li>
          </ul>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t border-gray-100/50 text-center"
          >
            <p className="text-sm text-gray-500">
              Trusted by thousands of users worldwide
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}