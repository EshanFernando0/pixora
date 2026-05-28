import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Loader2, Sparkles, X, Star } from 'lucide-react';
import { tmdb, IMAGE_BASE_URL } from '../api/tmdb';
import { backendAPI } from '../api/backend';
import MediaRow from './MediaRow';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    watchlist: [],
    trendingMovies: [],
    latestMovies: [],
    latestTv: [],
    anime: [],
    topRated: []
  });

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      
      // Fetch ALL categories in parallel for maximum speed
      const [
        watchlistData,
        trending,
        latestMov,
        latestShows,
        animeShows,
        top
      ] = await Promise.all([
        backendAPI.getWatchlist(),
        tmdb.getTrending('movie'),
        tmdb.getLatestMovies(),
        tmdb.getLatestTv(),
        tmdb.getAnime(),
        tmdb.getTopRated()
      ]);
      
      // Format watchlist data to include full TMDB details for the row
      let formattedWatchlist = [];
      if (Array.isArray(watchlistData) && watchlistData.length > 0) {
        const details = await Promise.all(
          watchlistData.slice(0, 10).map(item => tmdb.getDetails(item.media_type, item.tmdb_id))
        );
        formattedWatchlist = details.filter(item => item && item.poster_path).map((item, index) => ({
           ...item, 
           media_type: watchlistData[index].media_type 
        }));
      }

      setData({
        watchlist: formattedWatchlist,
        trendingMovies: trending.filter(m => m.backdrop_path && m.poster_path),
        latestMovies: latestMov.filter(m => m.poster_path),
        latestTv: latestShows.filter(t => t.poster_path),
        anime: animeShows.filter(a => a.poster_path),
        topRated: top.filter(m => m.poster_path)
      });

      setLoading(false);
    };
    
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-blue-500">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  const heroMovie = data.trendingMovies[0];

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden bg-[#0a0a0a]">
      
      {/* 1. HERO BANNER */}
      {heroMovie && (
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] flex items-end pb-12 sm:pb-16 md:pb-24">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${IMAGE_BASE_URL}${heroMovie.backdrop_path}`} 
              alt={heroMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-blue-400 font-bold mb-4 tracking-widest text-sm drop-shadow-md">
                <Sparkles size={16} /> #1 TRENDING WORLDWIDE
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
                {heroMovie.title}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 line-clamp-3 max-w-xl drop-shadow-lg font-medium">
                {heroMovie.overview}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to={`/watch/movie/${heroMovie.id}`} className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg active:scale-95 w-full sm:w-auto">
                  <Play size={20} fill="currentColor" /> Play Now
                </Link>
                <button 
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md transition-colors border border-white/20 active:scale-95 w-full sm:w-auto"
                >
                  <Info size={20} /> More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC CATEGORY ROWS */}
      <div className="max-w-7xl mx-auto pl-6 space-y-4 -mt-16 relative z-20">
        
        {data.watchlist.length > 0 && (
          <MediaRow title="Continue Watching / My List" data={data.watchlist} type="movie" endpoint="trending" />
        )}

        <MediaRow title="Recommended For You" data={data.trendingMovies.slice(1)} type="movie" endpoint="trending" />
        <MediaRow title="Latest Movies" data={data.latestMovies} type="movie" endpoint="now_playing" />
        <MediaRow title="Latest TV Shows" data={data.latestTv} type="tv" endpoint="on_the_air" />
        <MediaRow title="Latest Anime" data={data.anime} type="tv" endpoint="anime" />
        <MediaRow title="Critically Acclaimed" data={data.topRated} type="movie" endpoint="top_rated" />

      </div>

      {/* 3. MORE INFO MODAL */}
      {showModal && heroMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-3xl bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative w-full h-64 md:h-80">
              <img 
                src={`${IMAGE_BASE_URL}${heroMovie.backdrop_path}`} 
                alt={heroMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
                  {heroMovie.title || heroMovie.name}
                </h2>
                
                <div className="flex items-center gap-4 text-sm font-semibold text-gray-300">
                  <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                    <Star size={16} fill="currentColor" /> 
                    {heroMovie.vote_average ? heroMovie.vote_average.toFixed(1) : 'NR'}
                  </span>
                  <span>{heroMovie.release_date ? heroMovie.release_date.split('-')[0] : 'N/A'}</span>
                  <span className="uppercase text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded">
                    {heroMovie.media_type || 'Movie'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-surface">
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {heroMovie.overview}
              </p>
              
              <div className="flex gap-4">
                <Link 
                  to={`/watch/movie/${heroMovie.id}`}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 w-full md:w-auto"
                >
                  <Play size={20} fill="currentColor" /> Play Movie
                </Link>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-3.5 rounded-xl font-bold transition-all active:scale-95 w-full md:w-auto"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}