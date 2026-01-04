import Watchlist from '../models/Watchlist.js';
import WatchHistory from '../models/WatchHistory.js';
import Favorite from '../models/Favorite.js';
import Rating from '../models/Rating.js';
// Watchlist
export const getWatchlist = async (req, res, next) => {
    try {
        const watchlist = await Watchlist.find({ userId: req.user.id }).sort({ addedAt: -1 });
        res.json(watchlist);
    }
    catch (error) {
        next(error);
    }
};
export const addToWatchlist = async (req, res, next) => {
    try {
        const { animeId, animeTitle, animePoster, source } = req.body;
        // Upsert to avoid duplicates, although schema handles unique index
        const item = await Watchlist.findOneAndUpdate({ userId: req.user.id, animeId }, { userId: req.user.id, animeId, animeTitle, animePoster, source, addedAt: new Date() }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.json(item);
    }
    catch (error) {
        next(error);
    }
};
export const removeFromWatchlist = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        await Watchlist.deleteOne({ userId: req.user.id, animeId });
        res.json({ message: 'Removed from watchlist' });
    }
    catch (error) {
        next(error);
    }
};
export const checkWatchlistStatus = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        const exists = await Watchlist.exists({ userId: req.user.id, animeId });
        res.json({ inWatchlist: !!exists });
    }
    catch (error) {
        next(error);
    }
};
// History
export const getHistory = async (req, res, next) => {
    try {
        const history = await WatchHistory.find({ userId: req.user.id }).sort({ watchedAt: -1 });
        res.json(history);
    }
    catch (error) {
        next(error);
    }
};
export const updateHistory = async (req, res, next) => {
    try {
        const { animeId, animeTitle, animePoster, episodeId, episodeNumber, currentTime, duration, completed, source } = req.body;
        // We might want to keep one record per anime (last watched) AND one record per episode? 
        // For simplicity, let's just track episodes. But typically history shows "Last watched X".
        // Let's model: upsert based on EpisodeId? Or AnimeId?
        // Usually, continue watching needs per-anime tracking of last episode.
        // For now: Upsert by EpisodeId to track progress on that specific episode.
        const historyItem = await WatchHistory.findOneAndUpdate({ userId: req.user.id, episodeId }, {
            userId: req.user.id,
            animeId,
            animeTitle,
            animePoster,
            episodeId,
            episodeNumber,
            currentTime,
            duration,
            completed,
            source,
            watchedAt: new Date()
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.json(historyItem);
    }
    catch (error) {
        next(error);
    }
};
// Favorites
export const getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id }).sort({ addedAt: -1 });
        res.json(favorites);
    }
    catch (error) {
        next(error);
    }
};
export const addToFavorites = async (req, res, next) => {
    try {
        const { animeId, animeTitle, animePoster, source } = req.body;
        const item = await Favorite.findOneAndUpdate({ userId: req.user.id, animeId }, { userId: req.user.id, animeId, animeTitle, animePoster, source, addedAt: new Date() }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.json(item);
    }
    catch (error) {
        next(error);
    }
};
export const removeFromFavorites = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        await Favorite.deleteOne({ userId: req.user.id, animeId });
        res.json({ message: 'Removed from favorites' });
    }
    catch (error) {
        next(error);
    }
};
export const checkFavoriteStatus = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        const exists = await Favorite.exists({ userId: req.user.id, animeId });
        res.json({ isFavorite: !!exists });
    }
    catch (error) {
        next(error);
    }
};
// Ratings
export const setRating = async (req, res, next) => {
    try {
        const { animeId, rating, review } = req.body;
        const item = await Rating.findOneAndUpdate({ userId: req.user.id, animeId }, { userId: req.user.id, animeId, rating, review }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.json(item);
    }
    catch (error) {
        next(error);
    }
};
export const getUserRating = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        const item = await Rating.findOne({ userId: req.user.id, animeId });
        res.json(item);
    }
    catch (error) {
        next(error);
    }
};
export const getAnimeRatingStats = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        const stats = await Rating.aggregate([
            { $match: { animeId } },
            {
                $group: {
                    _id: '$animeId',
                    average: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);
        if (stats.length > 0) {
            res.json({ average: stats[0].average, count: stats[0].count });
        }
        else {
            res.json({ average: 0, count: 0 });
        }
    }
    catch (error) {
        next(error);
    }
};
