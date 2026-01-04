import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';

const OngoingPage = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOngoing = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/otakudesu/ongoing');
                const result = await response.json();

                if (result.statusCode === 200) {
                    setAnimeList(result.data.animeList || []);
                } else {
                    setError('Failed to load ongoing anime');
                }
            } catch (error) {
                console.error("Error fetching ongoing data:", error);
                setError('Connection error. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOngoing();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold dark:text-white">Ongoing Anime</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                <h2 className="text-xl font-bold text-red-500 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (animeList.length === 0) {
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold dark:text-white">Ongoing Anime</h1>
                <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                    No ongoing anime found at the moment.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold dark:text-white">Ongoing Anime</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {animeList.map(anime => (
                    <AnimeCard
                        key={anime.animeId}
                        id={anime.animeId}
                        title={anime.title}
                        rating={anime.releaseDay}
                        image={anime.poster}
                        episode={`Ep ${anime.episodes}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default OngoingPage;
