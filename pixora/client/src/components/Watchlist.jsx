import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Trash2, Bookmark } from 'lucide-react';
import { backendAPI } from '../api/backend';
import { tmdb, IMAGE_BASE_URL } from '../api/tmdb';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWatchlist = async () => {
      setLoading(true);
      try {
        // 1. Get saved IDs from PostgreSQL
        const savedItems = await backendAPI.getWatchlist();
        
        if (!savedItems || savedItems.length === 0) {
          setWatchlist([]);
          setLoading(false);
          return;
        }

        // 2. Fetch full movie details (posters, titles) from TMDB for each ID
        const detailedItems = await Promise.all(
          savedItems.map(async (item) => {
            const tmdbData = await tmdb.getDetails(item.media_type, item.tmdb_id);
            return { ...tmdbData, db_id: item.id, media_type: item.media_type };
          })
        );

        // Filter out any nulls just in case TMDB failed for one
        setWatchlist(detailedItems.filter(item => item && item.id));
      } catch (error) {
        console.error("Failed to load watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  // Remove item from database and update UI instantly
  const handleRemove = async (tmdb_id) => {
    await backendAPI.removeFromWatchlist(tmdb_id);
    setWatchlist(prev => prev.filter(item => item.id.toString() !== tmdb_id.toString()));
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-gray-400 animate-pulse">Loading your saved collection...</div>;
  }

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-7xl mx-auto mt-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-6">
        <div className="p-3 bg-pink-500/20 rounded-xl text-pink-500">
          <Bookmark size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          <p className="text-gray-400 mt-1">Movies and TV shows you've saved for later.</p>
        </div>
      </div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-white/5 rounded-2xl">
          <Bookmark size={48} className="text-gray-500 mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400 mb-6 max-w-md">Looks like you haven't saved anything yet. Go explore the universe and find your next story!</p>
          <Link to="/explore" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30">
            Explore Media
          </Link>
        </div>
      ) : (
        /* Results Grid */
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-surface border border-white/5 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="aspect-[2/3] w-full relative">
                <img 
                  src={`${IMAGE_BASE_URL}${item.poster_path}`} 
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(item.id);
                      }}
                      className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-sm line-clamp-2">{item.title || item.name}</h3>
                    <Link 
                      to={`/watch/${item.media_type}/${item.id}`}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      <Play size={16} fill="currentColor" /> Play
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}