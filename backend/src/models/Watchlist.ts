
import mongoose, { Document, Schema } from 'mongoose';

export interface IWatchlist extends Document {
    userId: mongoose.Types.ObjectId;
    animeId: string;
    animeTitle: string;
    animePoster: string;
    source: string;
    addedAt: Date;
}

const WatchlistSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animeId: { type: String, required: true },
    animeTitle: { type: String, required: true },
    animePoster: { type: String },
    source: { type: String },
    addedAt: { type: Date, default: Date.now }
});

// Composite index to ensure a user can only add an anime once
WatchlistSchema.index({ userId: 1, animeId: 1 }, { unique: true });

const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
export default Watchlist;
