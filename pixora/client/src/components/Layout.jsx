import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, Clock, Settings, LogOut, UserCircle } from 'lucide-react';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  
  // Grab the logged-in user from the browser's memory
  const user = JSON.parse(localStorage.getItem('pixora_user')) || { username: 'Unknown' };

  // The Escape Hatch: Clear memory and reload to trigger the Auth wall
  const handleLogout = () => {
    localStorage.removeItem('pixora_token');
    localStorage.removeItem('pixora_user');
    window.location.reload(); 
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark },
    { name: 'History', path: '/history', icon: Clock },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-white/5 border-r border-white/10 flex flex-col backdrop-blur-xl z-20">
        
        {/* App Branding */}
        <div className="p-8">
          <h2 className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 drop-shadow-sm">
            PIXORA
          </h2>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 mt-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                <span className="font-semibold">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-pink-600 flex items-center justify-center shrink-0 shadow-lg">
                <UserCircle size={20} className="text-white" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold truncate text-white">{user.username}</span>
                {/* Dynamically show the email OR a special Guest Badge */}
                {user.email && user.email.includes('@pixora.guest') ? (
                  <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mt-0.5">Guest Pass</span>
                ) : (
                  <span className="text-xs text-gray-400 truncate">{user.email}</span>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" 
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area where the rest of the app loads */}
      <main className="flex-1 overflow-y-auto relative bg-[#0a0a0a] flex flex-col">
        {/* We wrap Outlet in a flex-1 div so it pushes the footer to the bottom if the page is short */}
        <div className="flex-1">
          <Outlet />
        </div>
        
        {/* The Footer is now securely mounted at the bottom of the scroll view */}
        <Footer />
      </main>

    </div>
  );
}