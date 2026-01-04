
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import AnimeCard from '../components/AnimeCard';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const HomePage = () => {
    const [ongoingAnime, setOngoingAnime] = React.useState([]);
    const [completedAnime, setCompletedAnime] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pagination, setPagination] = React.useState(null);

    React.useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch ongoing anime with pagination
                const ongoingResponse = await fetch('/api/otakudesu/ongoing?page=1');
                const ongoingResult = await ongoingResponse.json();

                // Fetch completed anime for recommendations
                const homeResponse = await fetch('/api/otakudesu/home');
                const homeResult = await homeResponse.json();

                if (ongoingResult.statusCode === 200) {
                    setOngoingAnime(ongoingResult.data.animeList || []);
                    setPagination(ongoingResult.data.pagination || null);
                    console.log('📊 PAGINATION DATA:', ongoingResult.data.pagination);
                    console.log('📺 ANIME COUNT:', ongoingResult.data.animeList?.length);
                }

                if (homeResult.statusCode === 200) {
                    setCompletedAnime(homeResult.data.completed?.animeList || []);
                }
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const handlePageChange = async (newPage) => {
        if (newPage < 1 || newPage === currentPage) return;

        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const response = await fetch(`/api/otakudesu/ongoing?page=${newPage}`);
            const result = await response.json();

            if (result.statusCode === 200) {
                setOngoingAnime(result.data.animeList || []);
                setPagination(result.data.pagination || null);
                setCurrentPage(newPage);
            }
        } catch (error) {
            console.error('Failed to fetch page:', error);
        } finally {
            setLoading(false);
        }
    };



    const genres = [
        { name: 'Action', color: 'bg-[#FFCDD2] text-[#B71C1C]' },
        { name: 'Romance', color: 'bg-[#E1BEE7] text-[#4A148C]' },
        { name: 'Sci-Fi', color: 'bg-[#BBDEFB] text-[#0D47A1]' },
        { name: 'Slice of Life', color: 'bg-[#C8E6C9] text-[#1B5E20]' },
        { name: 'Adventure', color: 'bg-[#FFE0B2] text-[#E65100]' },
        { name: 'Comedy', color: 'bg-[#F0F4C3] text-[#827717]' },
        { name: 'Isekai', color: 'bg-[#D1C4E9] text-[#311B92]' },
        { name: 'Mystery', color: 'bg-[#B2EBF2] text-[#006064]' },
    ];

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
    }

    return (
        <>
            <HeroSection items={completedAnime} />

            {/* Completed / Top Section */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-[#120e1b] dark:text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full block"></span>
                        Anime Selesai (Rekomendasi)
                    </h2>
                    <div className="flex gap-2">
                        <button className="size-8 rounded-full bg-white hover:bg-primary hover:text-white flex items-center justify-center shadow-sm transition-colors text-gray-500">
                            <ChevronLeft className="size-5" />
                        </button>
                        <button className="size-8 rounded-full bg-white hover:bg-primary hover:text-white flex items-center justify-center shadow-sm transition-colors text-gray-500">
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {completedAnime.slice(0, 4).map((item) => (
                        <Link to={`/anime/${item.animeId}`} key={item.animeId} className="group cursor-pointer">
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-md">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                                <div
                                    className="bg-cover bg-center w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url("${item.poster}")` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <div className="size-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm text-primary">
                                        <Play className="fill-current ml-1 size-5" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-[#120e1b] truncate group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-xs text-gray-500">{item.episodes} Eps • Score: {item.score}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Genre Pills */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-[#120e1b] dark:text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-secondary rounded-full block"></span>
                        Genre Pilihan
                    </h2>
                    <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80">Lihat Semua</a>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                    {genres.map((genre) => (
                        <Link key={genre.name} to={`/genre/${genre.name.toLowerCase()}`} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-sm hover:scale-105 transition-transform ${genre.color}`}>
                            {genre.name}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sedang Tayang */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-[#120e1b] dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-pink-400 rounded-full block"></span>
                            Ongoing Anime (DEBUG)
                        </h2>
                        <Link to="/schedule" className="text-sm font-semibold text-primary hover:text-primary/80">View Calendar</Link>
                    </div>

                    {/* DEBUG PANEL */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs font-mono mb-4 overflow-auto max-h-40">
                        <p>Items: {ongoingAnime.length}</p>
                        <p>Pagination: {JSON.stringify(pagination)}</p>
                        <p>Loading: {loading ? 'true' : 'false'}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {ongoingAnime.map((anime, idx) => (
                            <AnimeCard
                                key={`${anime.animeId}-${idx}`} // Use index fallback for key if duplicates slip in, or strict animeId if stable
                                id={anime.animeId}
                                title={anime.title}
                                episode={`EP ${anime.episodes}`}
                                rating={anime.releaseDay || anime.latestReleaseDate || anime.rating || '?'}
                                image={anime.poster}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && ongoingAnime.length > 0 && (
                        <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-surface-dark disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300"
                            >
                                ← Previous
                            </button>

                            {/* Page Numbers */}
                            {(() => {
                                const pages = [];
                                const totalPages = pagination?.totalPages || 1;
                                const showPages = 5; // Show max 5 page numbers

                                let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                                let endPage = Math.min(totalPages, startPage + showPages - 1);

                                // Adjust start if we're near the end
                                if (endPage - startPage < showPages - 1) {
                                    startPage = Math.max(1, endPage - showPages + 1);
                                }

                                // First page button
                                if (startPage > 1) {
                                    pages.push(
                                        <button
                                            key={1}
                                            onClick={() => handlePageChange(1)}
                                            className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors"
                                        >
                                            1
                                        </button>
                                    );
                                    if (startPage > 2) {
                                        pages.push(<span key="dots1" className="px-2 text-gray-500">...</span>);
                                    }
                                }

                                // Page numbers
                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i)}
                                            className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === i
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    );
                                }

                                // Last page button
                                if (endPage < totalPages) {
                                    if (endPage < totalPages - 1) {
                                        pages.push(<span key="dots2" className="px-2 text-gray-500">...</span>);
                                    }
                                    pages.push(
                                        <button
                                            key={totalPages}
                                            onClick={() => handlePageChange(totalPages)}
                                            className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors"
                                        >
                                            {totalPages}
                                        </button>
                                    );
                                }

                                return pages;
                            })()}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination?.hasNextPage}
                                className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-surface-dark disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {/* End Message */}
                    {!loading && !pagination?.hasNextPage && ongoingAnime.length > 0 && (
                        <div className="text-center mt-8 text-gray-400">
                            You've reached the end!
                        </div>
                    )}
                </div>

                {/* Top Minggu Ini (Still Mock for now or reuse Completed) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-[#120e1b] dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-purple-500 rounded-full block"></span>
                            Anime Selesai Lainnya
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        {completedAnime.slice(4, 9).map((anime, index) => (
                            <React.Fragment key={anime.animeId}>
                                <Link to={`/anime/${anime.animeId}`} className="flex gap-4 group items-center">
                                    <div className="text-2xl font-black text-gray-300 group-hover:text-primary w-6 text-center">{index + 1}</div>
                                    <div
                                        className="h-16 w-16 rounded-lg bg-cover bg-center shrink-0"
                                        style={{ backgroundImage: `url("${anime.poster}")` }}
                                    ></div>
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-sm text-[#120e1b] group-hover:text-primary line-clamp-1">{anime.title}</h4>
                                        <p className="text-xs text-gray-500">{anime.score} Rating</p>
                                        <span className="text-[10px] font-medium text-green-600">{anime.episodes} Eps</span>
                                    </div>
                                </Link>
                                {index < 4 && <div className="h-px bg-gray-100 w-full"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
