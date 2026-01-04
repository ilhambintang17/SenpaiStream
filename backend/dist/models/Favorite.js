import mongoose, { Document, Schema } from 'mongoose';
const FavoriteSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animeId: { type: String, required: true },
    animeTitle: { type: String, required: true },
    animePoster: { type: String },
    source: { type: String },
    addedAt: { type: Date, default: Date.now }
});
FavoriteSchema.index({ userId: 1, animeId: 1 }, { unique: true });
const Favorite = mongoose.model('Favorite', FavoriteSchema);
export default Favorite;
