import React, { useState, useEffect } from 'react';
import { Play, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = ({ items = [] }) => {
    const [heroItems, setHeroItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSynopsis, setCurrentSynopsis] = useState('');
    const [loadingSynopsis, setLoadingSynopsis] = useState(false);

    // Initialize Random Items
    useEffect(() => {
        if (items.length > 0 && heroItems.length === 0) {
            const shuffled = [...items].sort(() => 0.5 - Math.random());
            setHeroItems(shuffled.slice(0, 5));
        }
    }, [items]);

    // Fetch Synopsis for Current Item
    useEffect(() => {
        if (heroItems.length === 0) return;

        let isMounted = true;
        const fetchSynopsis = async () => {
            setLoadingSynopsis(true);
            const animeId = heroItems[currentIndex].animeId;
            try {
                const res = await fetch(`/api/otakudesu/anime/${animeId}`);
                const data = await res.json();
                if (isMounted && data.statusCode === 200 && data.data?.details?.synopsis?.paragraphList) {
                    const synopsisList = data.data.details.synopsis.paragraphList;
                    setCurrentSynopsis(synopsisList.join(' '));
                }
            } catch (err) {
                console.error("Failed to fetch synopsis for hero", err);
                if (isMounted) setCurrentSynopsis("Sinopsis tidak tersedia.");
            } finally {
                if (isMounted) setLoadingSynopsis(false);
            }
        };

        fetchSynopsis();

        return () => { isMounted = false; };
    }, [currentIndex, heroItems]);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (heroItems.length || 1));
        }, 8000);

        return () => clearInterval(timer);
    }, [heroItems.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ((heroItems.length) || 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + (heroItems.length || 1)) % (heroItems.length || 1));
    };

    if (heroItems.length === 0) {
        return (
            <div className="w-full h-[500px] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse mb-8"></div>
        );
    }

    const currentItem = heroItems[currentIndex];

    return (
        <section className="relative w-full rounded-2xl overflow-hidden min-h-[500px] md:min-h-[550px] flex items-end p-6 md:p-12 group shadow-xl">
            {/* High-Quality Background Image with proper <img> tag */}
            {/* High-Quality Background Image with proper <img> tag */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Aesthetic Blur Background Layer */}
                <img
                    key={`blur-${currentItem.animeId}`}
                    src={currentItem.poster}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
                />

                {/* Main Image */}
                <img
                    key={currentItem.animeId}
                    src={currentItem.poster}
                    alt={currentItem.title}
                    loading="eager"
                    fetchpriority="high"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                    style={{
                        imageRendering: '-webkit-optimize-contrast',
                        transform: 'translateZ(0)',
                        willChange: 'opacity'
                    }}
                />
                {/* Enhanced Gradient Overlay for Esthetic Vibe */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120e1b] via-[#120e1b]/60 to-transparent/30 backdrop-blur-[1px]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#120e1b]/80 via-transparent to-transparent"></div>
            </div>

            {/* Glass Content Panel */}
            <div className="relative z-10 glass-panel p-6 md:p-8 rounded-xl max-w-3xl animate-fade-in-up">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-primary uppercase bg-white rounded-full">Trending / Random #{currentIndex + 1}</span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight line-clamp-2 drop-shadow-lg">
                    {currentItem.title}
                </h1>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-sm font-semibold mb-4">
                    <span className="bg-yellow-400/90 text-yellow-900 px-2 py-0.5 rounded border border-yellow-400/30 backdrop-blur-sm">
                        ⭐ {currentItem.score || '?'}
                    </span>
                    <span className="text-white/90 drop-shadow">{currentItem.episodes} Episodes</span>
                    <span className="text-white/90 drop-shadow">{currentItem.releaseDay}</span>
                </div>

                <p className="text-white/90 font-medium mb-6 text-sm md:text-base leading-relaxed line-clamp-3 min-h-[4.5em] drop-shadow">
                    {loadingSynopsis ? 'Loading synopsis...' : (currentSynopsis || 'Sinopsis tidak tersedia.')}
                </p>

                <div className="flex flex-wrap gap-3">
                    <Link to={`/anime/${currentItem.animeId}`} className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5">
                        <Play className="fill-current size-5" />
                        <span>Mulai Menonton</span>
                    </Link>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-[#120e1b] rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <Plus className="size-5" />
                        <span>Watchlist</span>
                    </button>
                </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                <button onClick={handlePrev} className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all hover:scale-105">
                    <ChevronLeft className="size-6" />
                </button>
                <button onClick={handleNext} className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all hover:scale-105">
                    <ChevronRight className="size-6" />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute top-6 right-6 flex gap-1 z-20">
                {heroItems.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/50'}`}
                    ></div>
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
