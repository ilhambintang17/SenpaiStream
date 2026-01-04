import mongoose, { Document, Schema } from 'mongoose';
const ReplySchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const CommentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    userAvatar: { type: String },
    animeId: { type: String },
    episodeId: { type: String },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: [ReplySchema],
    status: { type: String, enum: ['pending', 'approved', 'flagged'], default: 'pending' },
}, {
    timestamps: true
});
CommentSchema.index({ animeId: 1, createdAt: -1 });
CommentSchema.index({ episodeId: 1, createdAt: -1 });
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
