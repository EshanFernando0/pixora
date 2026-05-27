import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, Flag, MonitorPlay, Film, Tv, X } from 'lucide-react';
import { tmdb, IMAGE_BASE_URL } from '../api/tmdb';
import { backendAPI } from '../api/backend';

export default function Watch() {
  const { type, id } = useParams();
  
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightsOut, setLightsOut] = useState(false);
  const [activeServer, setActiveServer] = useState('Vidfast');
  const [inWatchlist, setInWatchlist] = useState(false);
  
  // NEW: Trailer State
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const mediaData = await tmdb.getDetails(type, id);
      setMedia(mediaData);
      
      const userWatchlist = await backendAPI.getWatchlist();
      // Ensure we have an array before running .some()
      if (Array.isArray(userWatchlist)) {
        const isSaved = userWatchlist.some(item => item.tmdb_id.toString() === id);
        setInWatchlist(isSaved);
      }

      setLoading(false);
    };
    fetchData();
  }, [type, id]);

  // Updated to wait for database confirmation!
  const toggleWatchlist = async () => {
    if (inWatchlist) {
      const result = await backendAPI.removeFromWatchlist(id);
      if (result && !result.error) {
        setInWatchlist(false);
      }
    } else {
      const result = await backendAPI.addToWatchlist(id, type);
      if (result && !result.error) {
        setInWatchlist(true);
      } else {
        alert("Failed to save! Check the backend terminal for errors.");
        console.error("Database save failed:", result);
      }
    }
  };

  // NEW: Fetch and show the trailer
  const handleWatchTrailer = async () => {
    const videos = await tmdb.getVideos(type, id);
    
    const officialTrailer = videos.find(
      (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
    );

    if (officialTrailer) {
      setTrailerKey(officialTrailer.key);
      setShowTrailerModal(true);
    } else {
      alert("Sorry, no official trailer is available for this title right now.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-400 animate-pulse">Loading Player...</div>;
  if (!media) return <div className="p-10 text-center text-red-400">Failed to load media details.</div>;

  const embedUrl = type === 'tv' ? `https://vidfast.pro/tv/${id}/1/1` : `https://vidfast.pro/movie/${id}`;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 bg-cover bg-center opacity-20 transition-opacity duration-1000" style={{ backgroundImage: `url(${IMAGE_BASE_URL}${media.backdrop_path})` }}></div>
      <div className="fixed inset-0 z-0 bg-black/80 backdrop-blur-3xl"></div>
      {lightsOut && <div className="fixed inset-0 z-40 bg-black/95 transition-opacity duration-500"></div>}

      <div className={`relative ${lightsOut ? 'z-50' : 'z-10'} max-w-7xl mx-auto flex flex-col gap-6 pt-2 pb-10`}>
        
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/10 relative">
          <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allowFullScreen className="absolute inset-0"></iframe>
        </div>

        <div className="flex flex-wrap justify-between items-center bg-surface backdrop-blur-md border border-white/10 rounded-2xl p-4 px-6 shadow-lg">
          <div className="flex gap-6">
            <button onClick={() => setLightsOut(!lightsOut)} className={`flex items-center gap-2 text-sm font-semibold transition-colors ${lightsOut ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
              <MonitorPlay size={18} /> {lightsOut ? 'Turn Lights On' : 'Lights Out'}
            </button>
            
            {/* UPDATED: Trailer Button now has onClick */}
            <button 
              onClick={handleWatchTrailer}
              className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              <Film size={18} /> Trailer
            </button>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={toggleWatchlist}
              className={`p-2 rounded-full transition-all duration-300 ${inWatchlist ? 'bg-pink-500/20 text-pink-500' : 'hover:bg-white/10 text-gray-300 hover:text-pink-500'}`}
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Heart size={20} fill={inWatchlist ? "currentColor" : "none"} />
            </button>

            <button className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-blue-400 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-red-400 transition-colors">
              <Flag size={20} />
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${lightsOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6">
                <img src={`${IMAGE_BASE_URL}${media.poster_path}`} alt={media.title || media.name} className="w-32 md:w-48 rounded-xl object-cover shadow-lg border border-white/5" />
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded text-white tracking-wider">HD ULTRA</span>
                    <span className="text-gray-400 text-sm">{media.release_date?.substring(0,4) || media.first_air_date?.substring(0,4)}</span>
                    <span className="text-blue-400 text-sm flex items-center gap-1">⭐ {media.vote_average?.toFixed(1)}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{media.title || media.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {media.genres?.map(genre => <span key={genre.id} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-gray-300">{genre.name}</span>)}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{media.overview}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm text-gray-400 font-semibold tracking-widest mb-4">SELECT SOURCE</h3>
              <div className="flex flex-col gap-3">
                {['Vidfast', 'VidLink', 'SkyStream'].map((srv) => (
                  <button key={srv} onClick={() => setActiveServer(srv)} className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${activeServer === srv ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                    <div className="flex items-center gap-3 font-medium"><Tv size={16} className={activeServer === srv ? 'text-blue-400' : ''} /> {srv}</div>
                    {activeServer === srv && <span className="text-[10px] bg-blue-600 px-2 py-1 rounded font-bold tracking-wider">AUTO</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TRAILER MODAL --- */}
      {showTrailerModal && trailerKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-5xl bg-black border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={24} />
            </button>

            {/* YouTube Embed */}
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Official Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}