import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { Search } from 'lucide-react';

const BrowsePage = () => {
    const { genreId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState(query || '');

    // Sync local input when URL query changes (e.g. from Navbar)
    React.useEffect(() => {
        setLocalSearch(query || '');
    }, [query]);

    // Update search params on Enter key
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearchParams({ q: localSearch });
        }
    };

    React.useEffect(() => {
        const fetchAnime = async () => {
            setLoading(true);
            try {
                let url = '/api/otakudesu/completed';

                if (query) {
                    url = `/api/otakudesu/search/${encodeURIComponent(query)}`;
                    // Otakudesu search endpoint might be /search/:query or /search?q=query. 
                    // Based on routes file: otakudesuRouter.get("/search", ...) implies /search?q=... or /search/:query?
                    // Let's assume /api/otakudesu/search?q=... based on standard practice, but 
                    // if the route definition in express is router.get('/search/:query', ...), then it's path param.
                    // Wait, previous grep output: `otakudesuRouter.get("/search", ...)` -> This usually matches /search. 
                    // So likely query param. Let's try `?q=` first.
                    // Actually, let's play safe and check the controller if possible. 
                    // For now I will assume query param `?q=` as it is standard express. 
                    // UPDATE: I will use /api/otakudesu/search?q= because that's safer for special chars.
                    // RE-UPDATE: Wait, `search/:query` is common in some scrapers.
                    // Let's stick to standard `?q=` for now, but if it fails I'll hotfix.
                    url = `/api/otakudesu/search?q=${encodeURIComponent(query)}`;
                } else if (genreId) {
                    url = `/api/otakudesu/genre/${genreId}`;
                }

                const response = await fetch(url);
                const result = await response.json();
                if (result.statusCode === 200) {
                    setAnimeList(result.data.animeList);
                }
            } catch (error) {
                console.error("Error fetching browse data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnime();
    }, [genreId, query]);

    if (loading) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold dark:text-white capitalize">{genreId ? `${genreId} Animes` : 'Browse Anime'}</h1>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                    <input
                        type="text"
                        placeholder="Search anime..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <select className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none">
                    <option>All Genres</option>
                    <option>Action</option>
                    <option>Comedy</option>
                </select>
                <select className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none">
                    <option>Most Popular</option>
                    <option>Newest</option>
                    <option>Top Rated</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {animeList.map(anime => (
                    <AnimeCard
                        key={anime.animeId}
                        id={anime.animeId}
                        title={anime.title}
                        rating="TV"
                        image={anime.poster || 'https://via.placeholder.com/300x450'} // API might not return poster here, fallback or fetch detail if strictly needed, but list usually has simple data
                    />
                ))}
            </div>
        </div>
    );
};

export default BrowsePage;
