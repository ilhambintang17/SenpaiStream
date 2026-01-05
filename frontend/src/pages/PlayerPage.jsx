import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { ChevronRight, SkipForward, SkipBack, Play, Server, Monitor } from 'lucide-react';

const PlayerPage = () => {
    const { episodeId } = useParams();
    const [streamUrl, setStreamUrl] = useState('');
    const [currentEpisodeTitle, setCurrentEpisodeTitle] = useState('');
    const [prevEpisode, setPrevEpisode] = useState(null);
    const [nextEpisode, setNextEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Quality & Server State
    const [qualityMap, setQualityMap] = useState({});
    const [sortedQualities, setSortedQualities] = useState([]);
    const [currentQuality, setCurrentQuality] = useState('');
    const [currentServerId, setCurrentServerId] = useState('');
    const [loadingQuality, setLoadingQuality] = useState(false);

    // Auto-retry State
    const [retryAttempt, setRetryAttempt] = useState(0);
    const [isAutoRetrying, setIsAutoRetrying] = useState(false);
    const loadTimeoutRef = useRef(null);
    const MAX_LOAD_TIME = 15000; // 15 seconds timeout (Increased for slower connections)
    const MAX_RETRIES_PER_QUALITY = 3;

    // Sidebar / Anime Details State
    const [animeId, setAnimeId] = useState(null);
    const [episodeList, setEpisodeList] = useState([]);
    const [animePoster, setAnimePoster] = useState('');
    const [loadingList, setLoadingList] = useState(false);

    const navigate = useNavigate();

    // SERVER PRIORITY LIST (Mega is FIRST for best reliability)
    const SERVER_PRIORITY = ['mega', 'ondesu', 'desustream', 'vidhide', 'mp4upload', 'filedon'];

    // Helper: Sort Servers by Priority
    const sortServers = (servers) => {
        return servers.sort((a, b) => {
            const labelA = a.label.toLowerCase();
            const labelB = b.label.toLowerCase();

            const indexA = SERVER_PRIORITY.findIndex(p => labelA.includes(p));
            const indexB = SERVER_PRIORITY.findIndex(p => labelB.includes(p));

            const pA = indexA === -1 ? 999 : indexA;
            const pB = indexB === -1 ? 999 : indexB;

            if (pA !== pB) return pA - pB;
            return 0;
        });
    };

    // Auto-retry when stream doesn't load
    const handleStreamLoadTimeout = () => {
        if (isAutoRetrying) return; // Prevent double-trigger

        console.log('[AUTO-RETRY] Stream load timeout detected, attempting next server...');
        setIsAutoRetrying(true);

        if (!currentQuality || !qualityMap[currentQuality]) {
            setIsAutoRetrying(false);
            return;
        }

        const servers = qualityMap[currentQuality];
        const currentIndex = servers.findIndex(s => s.serverId === currentServerId);

        // Try next server in the list
        if (currentIndex !== -1 && currentIndex < servers.length - 1) {
            const nextServer = servers[currentIndex + 1];
            console.log(`[AUTO-RETRY] Switching to next server: ${nextServer.label}`);
            setRetryAttempt(prev => prev + 1);
            selectServer(currentQuality, nextServer.serverId, true);
        } else {
            // All servers for this quality tried, try lower quality
            const currentQualityIndex = sortedQualities.indexOf(currentQuality);
            if (currentQualityIndex < sortedQualities.length - 1 && retryAttempt < MAX_RETRIES_PER_QUALITY) {
                const nextQuality = sortedQualities[currentQualityIndex + 1];
                console.log(`[AUTO-RETRY] All servers failed for ${currentQuality}, trying ${nextQuality}`);
                const nextQualityServers = qualityMap[nextQuality];
                if (nextQualityServers && nextQualityServers.length > 0) {
                    findAndPlayWorkingServer(nextQuality, nextQualityServers);
                }
            } else {
                console.log('[AUTO-RETRY] All retry attempts exhausted');
                setError('Semua server sedang bermasalah. Silakan coba lagi nanti.');
                setIsAutoRetrying(false);
            }
        }

        // Reset auto-retry flag after attempt
        setTimeout(() => setIsAutoRetrying(false), 1000);
    };

    // If iframe loads successfully, cancel the death timer
    const handleIframeLoad = () => {
        console.log('[PLAYER] Iframe loaded successfully. Cancelling auto-retry timeout.');
        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
            loadTimeoutRef.current = null;
        }
    };

    // Start timeout monitor when stream URL changes
    useEffect(() => {
        if (streamUrl && !loadingQuality) {
            // Clear previous timeout
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }

            console.log(`[PLAYER] Monitoring stream health... (Timeout: ${MAX_LOAD_TIME}ms)`);
            // Set new timeout to detect blackscreen/loading issues
            loadTimeoutRef.current = setTimeout(() => {
                handleStreamLoadTimeout();
            }, MAX_LOAD_TIME);
        }

        return () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
        };
    }, [streamUrl, loadingQuality]);

    // 1. Fetch Episode Data
    useEffect(() => {
        const fetchPlayerData = async () => {
            setLoading(true);
            setError(null);
            setRetryAttempt(0);

            try {
                const streamRes = await fetch(`/api/otakudesu/episode/${episodeId}`);
                const streamData = await streamRes.json();

                if (streamData && streamData.statusCode === 200 && streamData.data?.details) {
                    const { details } = streamData.data;

                    setCurrentEpisodeTitle(details.title || `Episode ${episodeId}`);
                    setNextEpisode(details.nextEpisode);
                    setPrevEpisode(details.prevEpisode);
                    setAnimeId(details.animeId);

                    // Parse Qualities & Servers
                    if (details.server?.qualityList) {
                        const qMap = {};
                        details.server.qualityList.forEach(q => {
                            const qualityLabel = q.title.replace('Mirror ', '').trim();
                            if (!qMap[qualityLabel]) qMap[qualityLabel] = [];

                            if (q.serverList && Array.isArray(q.serverList)) {
                                q.serverList.forEach(srv => {
                                    qMap[qualityLabel].push({
                                        label: srv.title,
                                        serverId: srv.serverId
                                    });
                                });
                            }
                            qMap[qualityLabel] = sortServers(qMap[qualityLabel]);
                        });

                        setQualityMap(qMap);

                        // Sort Qualities (Highest first: 1080p, 720p, 480p, 360p)
                        const sorted = Object.keys(qMap).sort((a, b) => {
                            const resA = parseInt(a.replace(/\\D/g, '')) || 0;
                            const resB = parseInt(b.replace(/\\D/g, '')) || 0;
                            return resB - resA;
                        });
                        setSortedQualities(sorted);

                        // Auto-Select HIGHEST Quality with MEGA (or best available)
                        if (sorted.length > 0) {
                            const bestQ = sorted[0]; // Highest quality
                            const servers = qMap[bestQ];
                            if (servers && servers.length > 0) {
                                findAndPlayWorkingServer(bestQ, servers);
                            }
                        }
                    }
                } else {
                    setError("Failed to load episode data.");
                }
            } catch (error) {
                console.error("Error fetching player data:", error);
                setError("Koneksi ke server bermasalah.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [episodeId]);

    // 2. Fetch Anime Details (for Sidebar)
    useEffect(() => {
        if (!animeId) return;

        const fetchAnimeDetails = async () => {
            setLoadingList(true);
            try {
                const res = await fetch(`/api/otakudesu/anime/${animeId}`);
                const data = await res.json();
                if (data && data.statusCode === 200 && data.data?.details) {
                    setEpisodeList(data.data.details.episodeList || []);
                    setAnimePoster(data.data.details.poster);
                }
            } catch (error) {
                console.error("Error fetching anime details:", error);
            } finally {
                setLoadingList(false);
            }
        };

        fetchAnimeDetails();
    }, [animeId]);

    // Helper: Find and Play the first working server for a quality
    const findAndPlayWorkingServer = async (quality, servers) => {
        setLoadingQuality(true);
        setCurrentQuality(quality);

        let foundUrl = null;
        let workingServerId = null;

        for (const srv of servers) {
            try {
                const res = await fetch(`/api/otakudesu/server/${srv.serverId}`);
                const data = await res.json();

                if (data && data.statusCode === 200 && data.data?.details?.url) {
                    foundUrl = data.data.details.url;
                    workingServerId = srv.serverId;
                    console.log(`[AUTO-SELECT] Found working server: ${srv.label}`);
                    break;
                }
            } catch (err) {
                console.warn(`Server ${srv.label} error, trying next...`, err);
            }
        }

        if (foundUrl) {
            setStreamUrl(foundUrl);
            setCurrentServerId(workingServerId);
            setRetryAttempt(0); // Reset retry counter on success
        } else {
            console.error("All servers for this quality failed API check.");
            setError(`Tidak ada server yang tersedia untuk kualitas ${quality}`);
        }

        setLoadingQuality(false);
    };

    // Helper: Manual Server Selection
    const selectServer = async (quality, serverId, isAutoRetry = false) => {
        setLoadingQuality(true);
        setCurrentQuality(quality);
        setCurrentServerId(serverId);

        try {
            const res = await fetch(`/api/otakudesu/server/${serverId}`);
            const data = await res.json();

            if (data && data.statusCode === 200 && data.data?.details?.url) {
                setStreamUrl(data.data.details.url);
                if (!isAutoRetry) {
                    setRetryAttempt(0); // Reset retry if manual selection
                }
            } else {
                console.warn("Server URL fetch failed");
                if (!isAutoRetry) {
                    alert("Server ini sepertinya bermasalah. Coba server lain.");
                }
            }
        } catch (error) {
            console.error("Error switching server:", error);
        } finally {
            setLoadingQuality(false);
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                <h2 className="text-xl font-bold text-red-500 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="size-4" />
                    <span className="text-primary font-medium truncate max-w-[200px] md:max-w-none">{currentEpisodeTitle || 'Watch'}</span>
                </div>

                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold dark:text-white leading-tight">
                    {loading ? 'Loading...' : currentEpisodeTitle}
                </h1>

                {/* Video Player */}
                <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl aspect-video">
                    {loadingQuality && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 text-white backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                                <span className="text-xs font-bold animate-pulse">
                                    {isAutoRetrying ? 'Auto-switching server...' : 'Loading stream...'}
                                </span>
                            </div>
                        </div>
                    )}

                    {streamUrl ? (
                        <VideoPlayer key={streamUrl} src={streamUrl} onLoad={handleIframeLoad} />
                    ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-white flex-col gap-2">
                            {loading ? 'Loading Stream...' : 'Stream Not Available'}
                        </div>
                    )}
                </div>

                {/* Controls & Server Selection */}
                <div className="flex flex-col gap-4 bg-white dark:bg-[#231e33] p-5 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    {/* Resolution Tabs */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                                <Monitor className="size-4 text-primary" />
                                <span className="text-sm font-bold dark:text-gray-200">Video Quality</span>
                            </div>
                            <span className="text-[10px] text-gray-400">Auto-picks best server for selected quality</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {sortedQualities.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => {
                                        const srvs = qualityMap[q];
                                        if (srvs && srvs.length > 0) {
                                            setRetryAttempt(0);
                                            findAndPlayWorkingServer(q, srvs);
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${currentQuality === q ? 'bg-primary text-white border-primary shadow-md' : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                                >
                                    {q}
                                </button>
                            ))}
                            {sortedQualities.length === 0 && !loading && <span className="text-sm text-gray-400 italic">Auto</span>}
                        </div>
                    </div>

                    {/* Server Providers (for selected quality) */}
                    {currentQuality && qualityMap[currentQuality]?.length > 0 && (
                        <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-100 dark:border-white/5 animate-fade-in">
                            <div className="flex items-center gap-2 mb-1">
                                <Server className="size-4 text-secondary" />
                                <span className="text-sm font-bold dark:text-gray-200">Select Provider</span>
                                <span className="text-[10px] text-gray-400 ml-auto">Mega is prioritized</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {qualityMap[currentQuality].map((srv) => (
                                    <button
                                        key={srv.serverId}
                                        onClick={() => {
                                            setRetryAttempt(0);
                                            selectServer(currentQuality, srv.serverId);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${currentServerId === srv.serverId ? 'bg-secondary text-white border-secondary shadow-md' : 'bg-white dark:bg-[#1a1625] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-secondary hover:text-secondary'}`}
                                    >
                                        {srv.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex gap-2 w-full md:w-auto">
                            {prevEpisode && (
                                <button
                                    onClick={() => navigate(`/watch/${prevEpisode.episodeId}`)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    <SkipBack className="size-4" /> Prev Ep
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2 w-full md:w-auto justify-end">
                            {nextEpisode && (
                                <button
                                    onClick={() => navigate(`/watch/${nextEpisode.episodeId}`)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg hover:bg-primary/90 transition-colors"
                                >
                                    Next Ep <SkipForward className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar: Episode List */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-fit">
                <div className="bg-white dark:bg-[#231e33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm sticky top-24">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                        <h3 className="font-bold dark:text-white">Episode List</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">{episodeList.length} Eps</span>
                    </div>

                    <div className="overflow-y-auto max-h-[600px] p-2 space-y-2 custom-scrollbar">
                        {loadingList ? (
                            <div className="p-8 text-center text-gray-400 text-sm">Loading Episodes...</div>
                        ) : (
                            episodeList.map((ep) => {
                                const isActive = ep.episodeId === episodeId;
                                return (
                                    <Link
                                        key={ep.episodeId}
                                        to={`/watch/${ep.episodeId}`}
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-all group ${isActive ? 'bg-primary/5 border border-primary/20' : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <div className="relative w-24 h-14 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                            {animePoster ? (
                                                <img src={animePoster} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                                            )}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <div className="size-5 bg-primary rounded-full animate-pulse"></div>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 right-0 bg-black/60 text-[9px] text-white px-1.5 py-0.5 font-medium rounded-tl-md">
                                                EP {ep.title}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-xs font-bold line-clamp-2 ${isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors'}`}>
                                                Episode {ep.title}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 mt-1 truncate">
                                                {isActive ? 'Now Playing' : 'Sub Indo'}
                                            </p>
                                        </div>
                                        {isActive && <Play className="size-3 text-primary fill-current mr-1" />}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
