
import mongoose, { Document, Schema } from 'mongoose';

export interface IWatchHistory extends Document {
    userId: mongoose.Types.ObjectId;
    animeId: string;
    animeTitle: string;
    animePoster: string;
    episodeId: string;
    episodeNumber: number;
    currentTime: number;
    duration: number;
    completed: boolean;
    source: string;
    watchedAt: Date;
}

const WatchHistorySchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animeId: { type: String, required: true },
    animeTitle: { type: String },
    animePoster: { type: String },
    episodeId: { type: String, required: true },
    episodeNumber: { type: Number },
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    source: { type: String },
    watchedAt: { type: Date, default: Date.now }
});

// Update watchedAt on save
WatchHistorySchema.pre('save', function (next: any) {
    this.watchedAt = new Date();
    next();
});

// Index for efficiently querying a user's history
WatchHistorySchema.index({ userId: 1, watchedAt: -1 });

const WatchHistory = mongoose.model<IWatchHistory>('WatchHistory', WatchHistorySchema);
export default WatchHistory;
