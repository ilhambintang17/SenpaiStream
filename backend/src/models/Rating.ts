
import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
    userId: mongoose.Types.ObjectId;
    animeId: string;
    rating: number;
    review?: string;
    createdAt: Date;
}

const RatingSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animeId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    review: { type: String },
}, {
    timestamps: true
});

RatingSchema.index({ userId: 1, animeId: 1 }, { unique: true });
RatingSchema.index({ animeId: 1 });

const Rating = mongoose.model<IRating>('Rating', RatingSchema);
export default Rating;
