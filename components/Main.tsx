import { Gift } from "lucide-react";

export default function Main() {
    // Sample data - replace with your actual data
    const stats = [
      { name: 'Total Referrals', value: '128', change: '+12%', trend: 'up' },
      { name: 'Active Users', value: '84', change: '+5%', trend: 'up' },
      { name: 'Rewards Earned', value: '$1,240', change: '+23%', trend: 'up' },
      { name: 'Leaderboard Rank', value: '#7', change: '2 spots', trend: 'up' },
    ];
  
    const leaderboard = [
      { rank: 1, name: 'Alex Johnson', referrals: 245 },
      { rank: 2, name: 'Sam Wilson', referrals: 198 },
      { rank: 3, name: 'Taylor Smith', referrals: 176 },
      { rank: 4, name: 'Jordan Lee', referrals: 152 },
      { rank: '...', name: '...', referrals: '...' },
      { rank: 7, name: 'You', referrals: 128 },
    ];
  
    const recentActivity = [
      { id: 1, user: 'michael@example.com', status: 'Signed up', reward: '$5', date: '10 min ago' },
      { id: 2, user: 'sarah@example.com', status: 'Verified', reward: '$10', date: '25 min ago' },
      { id: 3, user: 'david@example.com', status: 'First purchase', reward: '$25', date: '2 hours ago' },
    ];
  
    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-fuchsia-700">Welcome back!</h1>
              <p className="text-gray-600">Here's what's happening with your referrals today.</p>
            </div>
            <button className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">
              Invite Friends
            </button>
          </div>
        </div>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <p className="text-sm text-gray-500">{stat.name}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Leaderboard</h2>
              <a href="/dashboard/leaderboard" className="text-sm text-fuchsia-600 hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-3">
              {leaderboard.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg ${item.rank === 7 ? 'bg-fuchsia-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs 
                      ${item.rank === 1 ? 'bg-yellow-400 text-white' : 
                        item.rank === 2 ? 'bg-gray-300 text-white' : 
                        item.rank === 3 ? 'bg-amber-600 text-white' : 
                        'bg-gray-100 text-gray-600'}`}
                    >
                      {item.rank}
                    </span>
                    <span className={`${item.rank === 7 ? 'font-medium text-fuchsia-600' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{item.referrals} referrals</span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="bg-fuchsia-100 p-2 rounded-lg mr-3">
                    <Gift className="text-fuchsia-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.status} • {activity.date}</p>
                  </div>
                  <div className="text-sm font-medium text-fuchsia-600">+{activity.reward}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-fuchsia-600 hover:underline w-full text-left">
              View all activity
            </button>
          </div>
        </div>
  
        {/* Referral Link Card */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Your Referral Link</h2>
          <p className="text-fuchsia-100 mb-4">Share this link and earn rewards for every friend who joins!</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/20 p-3 rounded-lg flex-1 overflow-x-auto">
              <code className="text-sm">https://referx.com/join?ref=yourusername123</code>
            </div>
            <button className="bg-white text-fuchsia-700 px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-opacity text-sm">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  }