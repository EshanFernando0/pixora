import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Play, Heart, Film, Tv, Loader2, TrendingUp, Sparkles, ChevronDown } from 'lucide-react';
import { tmdb, IMAGE_BASE_URL } from '../api/tmdb';
import { backendAPI } from '../api/backend';

export default function Explore() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'trending';
  const urlType = searchParams.get('type') || 'movie';

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(urlType); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Pagination State
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(urlCategory);
  
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const watchlist = await backendAPI.getWatchlist();
      if (Array.isArray(watchlist)) setSavedIds(watchlist.map(item => item.tmdb_id.toString()));
    };
    fetchSaved();
  }, []);

  // Helper function to figure out which API to call based on the category
  const fetchCategoryData = async (pageNum, categoryToFetch, typeToFetch) => {
   let data; 
    if (categoryToFetch === 'anime') data = await tmdb.getAnime(pageNum);
    else if (categoryToFetch === 'now_playing') data = await tmdb.getLatestMovies(pageNum);
    else if (categoryToFetch === 'on_the_air') data = await tmdb.getLatestTv(pageNum);
    else if (categoryToFetch === 'top_rated') data = await tmdb.getTopRated(pageNum);
    else data = await tmdb.getTrending(typeToFetch, pageNum);
    
    return data.filter(item => item.poster_path);
  };

  // Initial Load (Page 1)
  useEffect(() => {
    const loadDefaultContent = async () => {
      if (query.trim() === '') {
        setLoading(true);
        const newData = await fetchCategoryData(1, currentCategory, activeTab);
        setResults(newData);
        setPage(1); // Reset to page 1 on new load
        setLoading(false);
      }
    };
    loadDefaultContent();
  }, [activeTab, currentCategory, query]); 

  const handleTabSwitch = (type) => {
    setActiveTab(type);
    setCurrentCategory('trending'); 
    setQuery(''); // Clear search when switching tabs manually
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setCurrentCategory('search');
    const searchResults = await tmdb.search(query, activeTab, 1);
    setResults(searchResults.filter(item => item.poster_path)); 
    setPage(1); // Reset to page 1 for new searches
    setLoading(false);
  };

  // NEW: Load More Function
  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    let moreData = [];

    if (currentCategory === 'search') {
      moreData = await tmdb.search(query, activeTab, nextPage);
      moreData = moreData.filter(item => item.poster_path);
    } else {
      moreData = await fetchCategoryData(nextPage, currentCategory, activeTab);
    }

    // Append the new data to the existing results array!
    setResults(prevResults => [...prevResults, ...moreData]);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const toggleWatchlist = async (tmdb_id) => {
    const stringId = tmdb_id.toString();
    const isSaved = savedIds.includes(stringId);
    if (isSaved) {
      const res = await backendAPI.removeFromWatchlist(stringId);
      if (!res.error) setSavedIds(prev => prev.filter(id => id !== stringId));
    } else {
      const res = await backendAPI.addToWatchlist(stringId, activeTab);
      if (!res.error) setSavedIds(prev => [...prev, stringId]);
    }
  };

  const getSectionTitle = () => {
    if (query) return `Search Results for "${query}"`;
    switch(currentCategory) {
      case 'anime': return 'All Anime Series';
      case 'now_playing': return 'Latest Movies in Theaters';
      case 'on_the_air': return 'Latest TV Shows';
      case 'top_rated': return 'Critically Acclaimed Masterpieces';
      default: return `Weekly Top ${activeTab === 'movie' ? 'Movies' : 'TV Shows'}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-10 pb-20 px-6">
      
      {/* Search Header */}
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-extrabold mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">
          Explore the Universe
        </h1>
        
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative group z-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, shows, and more..."
            className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-3 sm:py-4 pl-12 pr-28 sm:pr-32 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all shadow-2xl backdrop-blur-md text-base sm:text-lg"
          />
          <button type="submit" className="absolute inset-y-2 right-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95">
            Search
          </button>
        </form>

        <div className="flex gap-4 mt-8 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-xl relative z-0">
          <button onClick={() => handleTabSwitch('movie')} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'movie' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            <Film size={18} /> Movies
          </button>
          <button onClick={() => handleTabSwitch('tv')} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'tv' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            <Tv size={18} /> TV Shows
          </button>
        </div>
      </div>

      {/* Dynamic Section Title */}
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        {currentCategory === 'search' ? <Search className="text-blue-500" size={24} /> : 
         currentCategory === 'trending' ? <TrendingUp className="text-pink-500" size={24} /> : 
         <Sparkles className="text-yellow-400" size={24} />}
        <h2 className="text-2xl font-bold text-white">
          {getSectionTitle()}
        </h2>
      </div>

      {/* Results State */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-blue-500">
          <Loader2 size={48} className="animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-xl">No results found.</div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mb-12">
            {results.map((item, index) => {
              const isSaved = savedIds.includes(item.id.toString());
              // Using index in key to prevent React errors if TMDB returns duplicates across pages
              return (
                <div key={`${item.id}-${index}`} className="relative group rounded-xl overflow-hidden bg-surface border border-white/5 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                  <div className="aspect-[2/3] w-full relative">
                    <img 
                      src={`${IMAGE_BASE_URL}${item.poster_path}`} 
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWatchlist(item.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-pink-500/20 text-pink-500' : 'bg-black/50 text-white hover:bg-pink-500/20 hover:text-pink-500 border border-white/10'}`}
                        >
                          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-sm line-clamp-2">{item.title || item.name}</h3>
                        <Link 
                          to={`/watch/${activeTab}/${item.id}`}
                          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          <Play size={16} fill="currentColor" /> Play
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {results.length > 0 && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 group"
              >
                {loadingMore ? (
                  <><Loader2 size={20} className="animate-spin text-blue-400" /> Loading Universe...</>
                ) : (
                  <>Load More <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform text-blue-400" /></>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}