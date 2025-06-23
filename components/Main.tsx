export default function Main() {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-fuchsia-700">Welcome to ReferX</h1>
        <p className="text-gray-600">Earn rewards by referring friends and climb the leaderboard!</p>
        
        {/* Optional: Add a call-to-action button */}
        <button className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </div>
    );
  }