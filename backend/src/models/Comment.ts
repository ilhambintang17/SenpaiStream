
import mongoose, { Document, Schema } from 'mongoose';

export interface IReply extends Document {
    userId: mongoose.Types.ObjectId;
    username: string;
    content: string;
    createdAt: Date;
}

export interface IComment extends Document {
    userId: mongoose.Types.ObjectId;
    username: string;
    userAvatar?: string;
    animeId?: string;
    episodeId?: string;
    content: string;
    likes: number; // Could be an array of userIds for more complex liking logic
    replies: IReply[];
    status: 'pending' | 'approved' | 'flagged';
    createdAt: Date;
}

const ReplySchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const CommentSchema: Schema = new Schema({
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

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
