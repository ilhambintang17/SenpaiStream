
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Bell, Star } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';

const AnimeDetailPage = () => {
    const { id } = useParams();
    const [animeData, setAnimeData] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchAnimeDetail = async () => {
            try {
                const response = await fetch(`/api/otakudesu/anime/${id}`);
                const result = await response.json();
                if (result.statusCode === 200) {
                    setAnimeData(result.data);
                }
            } catch (error) {
                console.error("Error fetching anime details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimeDetail();
    }, [id]);

    if (loading) return <div className="text-center p-10 font-bold text-lg dark:text-white">Loading Anime Details...</div>;
    if (!animeData) return <div className="text-center p-10 font-bold text-lg dark:text-white">Anime not found</div>;

    const { details } = animeData;
    const firstEpisodeId = details.episodeList && details.episodeList.length > 0 ? details.episodeList[0].episodeId : null;

    return (
        <>
            {/* Hero Section */}
            <div className="relative w-full">
                <div className="absolute inset-0 h-[500px] w-full overflow-hidden z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                        style={{ backgroundImage: `url("${details.poster}")` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-background-light/30 via-background-light/60 to-background-light dark:from-background-dark/30 dark:via-background-dark/60 dark:to-background-dark"></div>
                </div>

                <div className="relative z-10 container mx-auto pt-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                        {/* Poster */}
                        <div className="shrink-0 w-48 md:w-72 lg:w-80 mx-auto md:mx-0 shadow-2xl rounded-xl overflow-hidden group">
                            <div
                                className="aspect-[2/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url("${details.poster}")` }}
                            ></div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col pt-2 md:pt-4 text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-black text-[#120e1b] dark:text-white mb-2 tracking-tight">{details.title}</h1>
                            <p className="text-lg text-gray-500 font-medium mb-6">{details.japanese}</p>

                            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="fill-current size-5" />)}
                                </div>
                                <span className="text-2xl font-bold text-[#120e1b] dark:text-white">{details.score || 'N/A'}</span>
                                <span className="text-sm text-gray-500">({details.status})</span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                                {details.genreList?.map((genre, idx) => (
                                    <span key={idx} className="px-4 py-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-500 dark:text-gray-300">{genre.genreName}</span>
                                )) || <span className="text-sm text-gray-500">No genres</span>}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                                {firstEpisodeId ? (
                                    <Link to={`/watch/${firstEpisodeId}`} className="flex items-center justify-center gap-2 h-12 px-8 bg-primary text-white rounded-xl text-base font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                                        <Play className="fill-current size-5" />
                                        Tonton Sekarang
                                    </Link>
                                ) : (
                                    <button disabled className="flex items-center justify-center gap-2 h-12 px-8 bg-gray-400 text-white rounded-xl text-base font-bold cursor-not-allowed">
                                        Not Available
                                    </button>
                                )}
                                <button className="flex items-center justify-center size-12 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl hover:text-primary hover:border-primary transition-all">
                                    <Plus className="size-6" />
                                </button>
                                <button className="flex items-center justify-center size-12 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl hover:text-primary hover:border-primary transition-all">
                                    <Bell className="size-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Content - Replicating Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-8 flex flex-col gap-10">
                    {details.synopsis?.paragraphList?.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold text-[#120e1b] dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 rounded-full bg-primary block"></span>
                                Synopsis
                            </h3>
                            <div className="text-gray-500 dark:text-gray-400 leading-relaxed text-base space-y-4">
                                {details.synopsis.paragraphList.map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h3 className="text-xl font-bold text-[#120e1b] dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 rounded-full bg-primary block"></span>
                            Episodes
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {details.episodeList?.map(ep => (
                                <Link key={ep.episodeId} to={`/watch/${ep.episodeId}`}>
                                    <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#1a1625] border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors text-sm truncate">{ep.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Click to watch</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Anime Info Box */}
                    <div className="bg-white dark:bg-[#231e33] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                        <h4 className="text-lg font-bold text-[#120e1b] dark:text-white mb-4 border-b border-gray-100 pb-2">Anime Info</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li><strong>Type:</strong> {details.type}</li>
                            <li><strong>Episodes:</strong> {details.episodes}</li>
                            <li><strong>Duration:</strong> {details.duration}</li>
                            <li><strong>Aired:</strong> {details.aired}</li>
                            <li><strong>Studios:</strong> {details.studios}</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-[#120e1b] dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 rounded-full bg-primary block"></span>
                            Anime Serupa
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {animeData.recommendedAnimeList?.map(rec => (
                                <AnimeCard
                                    key={rec.animeId}
                                    id={rec.animeId}
                                    title={rec.title}
                                    rating="TV"
                                    image={rec.poster}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnimeDetailPage;
