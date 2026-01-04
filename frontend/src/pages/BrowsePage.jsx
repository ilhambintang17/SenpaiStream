
import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { Search } from 'lucide-react';

const BrowsePage = () => {
    const { genreId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState(query || '');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchAnime = async () => {
            setLoading(true);
            try {
                let url = '/api/otakudesu/completed';
                if (genreId) {
                    url = `/api/otakudesu/genre/${genreId}`;
                } else if (query) {
                    url = `/api/otakudesu/search?q=${encodeURIComponent(query)}`;
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
        if (query) setLocalSearch(query);
    }, [genreId, query]);

    const handleLocalSearch = (e) => {
        if (e.key === 'Enter' && localSearch.trim()) {
            navigate(`/browse?q=${encodeURIComponent(localSearch.trim())}`);
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;

    const getTitle = () => {
        if (query) return `Search Results: "${query}"`;
        if (genreId) return `${genreId} Animes`;
        return 'Browse Anime';
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold dark:text-white capitalize">{getTitle()}</h1>

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
                        onKeyDown={handleLocalSearch}
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
