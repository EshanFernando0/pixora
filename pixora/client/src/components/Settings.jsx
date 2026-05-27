import { useState } from 'react';
import { User, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('pixora_user')) || { username: 'Guest', email: 'N/A' };
  const isGuest = user.email?.includes('@pixora.guest');

  // React state to make the toggle buttons actually work
  const [autoplay, setAutoplay] = useState(true);
  const [highQuality, setHighQuality] = useState(true);

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 px-6">
      <h1 className="text-4xl font-extrabold mb-10 text-white tracking-wide">Account Settings</h1>

      {/* Changed to a flex column layout since the right sidebar is gone */}
      <div className="flex flex-col gap-8">
        
        {/* Profile Section */}
        <section className="bg-surface border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><User size={20} className="text-blue-400" /> Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <div className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-medium">{user.username}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <div className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-medium flex justify-between items-center">
                {user.email}
                {isGuest && <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Guest</span>}
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-surface border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bell size={20} className="text-blue-400" /> Playback Preferences</h2>
          <div className="space-y-4">
            
            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <h4 className="text-white font-semibold">Autoplay Next Episode</h4>
                <p className="text-sm text-gray-400">Automatically start the next episode in a series.</p>
              </div>
              <div 
                onClick={() => setAutoplay(!autoplay)}
                className={`w-14 h-7 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${autoplay ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${autoplay ? 'left-8' : 'left-1'}`}></div>
              </div>
            </div>
            
            {/* High Quality Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <h4 className="text-white font-semibold">High Quality Streaming</h4>
                <p className="text-sm text-gray-400">Always stream in 4K UHD when available.</p>
              </div>
              <div 
                onClick={() => setHighQuality(!highQuality)}
                className={`w-14 h-7 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${highQuality ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${highQuality ? 'left-8' : 'left-1'}`}></div>
              </div>
            </div>

          </div>
        </section>

        {/* Privacy Section moved to the bottom */}
        <section className="bg-surface border border-white/10 rounded-3xl p-6 backdrop-blur-md flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors shadow-xl">
          <div className="p-3 bg-white/5 rounded-xl"><Shield size={24} className="text-gray-400" /></div>
          <div>
            <h4 className="text-white font-semibold">Privacy & Security</h4>
            <p className="text-xs text-gray-400">Manage connected devices and active sessions</p>
          </div>
        </section>

      </div>
    </div>
  );
}