import mongoose, { Document, Schema } from 'mongoose';
const WatchHistorySchema = new Schema({
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
WatchHistorySchema.pre('save', function (next) {
    this.watchedAt = new Date();
    next();
});
// Index for efficiently querying a user's history
WatchHistorySchema.index({ userId: 1, watchedAt: -1 });
const WatchHistory = mongoose.model('WatchHistory', WatchHistorySchema);
export default WatchHistory;
