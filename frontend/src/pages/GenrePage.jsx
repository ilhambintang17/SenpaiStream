import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GenrePage = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('/api/otakudesu/genre');
                const result = await response.json();
                if (result.statusCode === 200) {
                    setGenres(result.data.genreList);
                }
            } catch (error) {
                console.error("Error fetching genre data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGenres();
    }, []);

    if (loading) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold dark:text-white">Genres</h1>
            <div className="flex flex-wrap gap-4">
                {genres.map(genre => (
                    <Link
                        key={genre.genreId}
                        to={`/genre/${genre.genreId}`}
                        className="px-6 py-3 rounded-xl bg-white dark:bg-[#1a1625] border border-gray-100 dark:border-white/5 font-medium hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                        {genre.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GenrePage;
