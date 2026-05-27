import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, ChevronRightCircle } from 'lucide-react';
import { IMAGE_BASE_URL } from '../api/tmdb';

export default function MediaRow({ title, data, type = 'movie', endpoint = 'trending' }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <section className="relative group/section mb-10">
      
      {/* 2. Update the Link to include the endpoint and type in the URL! */}
      <div className="flex items-end justify-between mb-4 pr-4">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">{title}</h2>
        <Link 
          to={`/explore?category=${endpoint}&type=${type}`} 
          className="text-sm font-semibold text-blue-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          View All <ChevronRightCircle size={16} />
        </Link>
      </div>
      
      {/* Scroll Controls (Hidden until hover) */}
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-3 rounded-r-2xl opacity-0 group-hover/section:opacity-100 transition-all backdrop-blur-md hidden md:block"
      >
        <ChevronLeft size={28} />
      </button>
      
      <button 
        onClick={() => scroll('right')} 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-3 rounded-l-2xl opacity-0 group-hover/section:opacity-100 transition-all backdrop-blur-md hidden md:block"
      >
        <ChevronRight size={28} />
      </button>

      {/* Horizontal Scroll Container */}
      <div 
        ref={rowRef} 
        className="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x hide-scrollbar relative z-20 scroll-smooth"
      >
        {data.map((item) => (
          <Link 
            key={item.id} 
            to={`/watch/${item.media_type || type}/${item.id}`} 
            className="shrink-0 w-36 md:w-44 lg:w-52 snap-start group cursor-pointer"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[2/3] border border-white/5 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/30 group-hover:-translate-y-2">
              <img 
                src={`${IMAGE_BASE_URL}${item.poster_path}`} 
                alt={item.title || item.name} 
                className="w-full h-full object-cover" 
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play size={20} fill="currentColor" className="ml-1" />
                </div>
              </div>
            </div>
            <h3 className="text-sm font-bold mt-3 truncate text-gray-300 group-hover:text-white transition-colors">
              {item.title || item.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}