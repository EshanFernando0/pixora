import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Play, Loader2, Trash2 } from 'lucide-react';
import { tmdb, IMAGE_BASE_URL } from '../api/tmdb';

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      
      // 1. Check if we already have history saved in the browser memory
      const savedHistory = localStorage.getItem('pixora_watch_history');

      if (savedHistory) {
        // 2. If memory exists (even if it's empty), use it and stop loading!
        setHistoryItems(JSON.parse(savedHistory));
        setLoading(false);
        return;
      }

      // 3. If no memory exists (first time opening the page), generate the simulated history
      const data = await tmdb.getTrending('movie');
      const simulatedHistory = data.slice(0, 8).map(item => ({
        ...item,
        progress: Math.floor(Math.random() * 60) + 20 
      })).filter(item => item.backdrop_path);
      
      setHistoryItems(simulatedHistory);
      
      // Save this generated data to memory so it doesn't change on refresh
      localStorage.setItem('pixora_watch_history', JSON.stringify(simulatedHistory));
      setLoading(false);
    };

    loadHistory();
  }, []);

  const clearHistory = () => {
    // Clear the React State
    setHistoryItems([]);
    // Permanently save an empty array to the browser memory!
    localStorage.setItem('pixora_watch_history', JSON.stringify([]));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-blue-500">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-10 pb-20 px-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
            <Clock size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Watch History</h1>
            <p className="text-gray-400 mt-1">Jump right back into what you were watching.</p>
          </div>
        </div>
        
        {historyItems.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 px-4 py-2 border border-white/10 rounded-lg hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-white/5 rounded-2xl">
          <Clock size={48} className="text-gray-500 mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">No watch history</h2>
          <p className="text-gray-400 max-w-md">You haven't watched anything recently. Go explore the universe!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {historyItems.map((item) => (
            <Link key={item.id} to={`/watch/movie/${item.id}`} className="group relative rounded-2xl overflow-hidden bg-surface border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 block">
              
              <div className="aspect-video w-full relative">
                <img 
                  src={`${IMAGE_BASE_URL}${item.backdrop_path}`} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/40 shadow-xl">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/60 backdrop-blur-md">
                  <div 
                    className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-white truncate mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="text-red-500 font-semibold">{item.progress}%</span> watched
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}