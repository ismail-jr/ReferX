'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Trophy,
  Gift,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/dashboard/leaderboard', name: 'Leaderboard', icon: <Trophy size={18} /> },
    { path: '/dashboard/rewards', name: 'Rewards', icon: <Gift size={18} /> },
  ];

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      pathname === path
        ? 'bg-fuchsia-50 text-fuchsia-600 font-medium'
        : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={20} className="text-fuchsia-600" />
          ) : (
            <Menu size={20} className="text-fuchsia-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-7 ml-2 left-0 h-screen bg-white w-60 rounded-xl  p-5 shadow-sm border-r border-gray-100 flex flex-col z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-8 pl-2">
          <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 p-2 rounded-lg">
            <X className="text-white" size={20} strokeWidth={3} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={linkClass(item.path)}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-fuchsia-500">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="pt-2 border-t border-gray-100">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 py-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium">User Profile</span>
            </div>
            <ChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {profileOpen && (
            <div className="pl-11 space-y-1 mt-1">
              <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
                <Settings size={14} /> Settings
              </Link>
              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 text-red-500">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}