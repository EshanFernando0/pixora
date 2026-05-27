import { Film, Globe, MessageSquare, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/10 pt-10 pb-8 mt-auto relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <Film size={20} />
              </div>
              <h2 className="text-2xl font-extrabold tracking-widest text-white">PIXORA</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your ultimate gateway to the streaming universe. Discover, track, and save your favorite movies and television shows seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="/explore" className="hover:text-blue-400 transition-colors">Explore</a></li>
              <li><a href="/watchlist" className="hover:text-blue-400 transition-colors">Watchlist</a></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-white font-bold mb-4">Connect</h3>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors" title="Website"><Globe size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors" title="Community"><MessageSquare size={20} /></a>
              <a href="#" className="hover:text-pink-400 transition-colors" title="Email"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        {/* TMDB Credit & Copyright Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pixora. All rights reserved.</p>
          
          {/* Official TMDB Attribution */}
          <div className="flex items-center gap-2 text-center md:text-right max-w-sm">
            <p>
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}