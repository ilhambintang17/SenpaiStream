import mongoose, { Schema, Document } from 'mongoose';
const ViewHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    animeId: {
        type: String,
        required: true,
        index: true
    },
    animeTitle: {
        type: String,
        required: true
    },
    episodeId: {
        type: String,
        required: true
    },
    episodeNumber: {
        type: String,
        required: true
    },
    watchedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Compound indexes for efficient queries
ViewHistorySchema.index({ userId: 1, watchedAt: -1 });
ViewHistorySchema.index({ userId: 1, animeId: 1 });
ViewHistorySchema.index({ animeId: 1, watchedAt: -1 });
// Method to check if watched > 90%
ViewHistorySchema.methods.isWatched = function () {
    if (this.duration === 0)
        return false;
    return (this.progress / this.duration) > 0.9;
};
export default mongoose.model('ViewHistory', ViewHistorySchema);
