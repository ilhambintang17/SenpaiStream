import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimeCache extends Document {
    animeId: string;
    title: string;
    sources: Array<{
        name: 'otakudesu' | 'kuramanime';
        sourceId: string;
        url: string;
        lastUpdated: Date;
    }>;
    mergedData: {
        poster?: string;
        episodes?: string;
        releaseDay?: string;
        score?: string;
        genres?: string[];
        synopsis?: any;
        episodeList?: any[];
        status?: string;
    };
    createdAt: Date;
    expiresAt: Date;
}

const AnimeCacheSchema = new Schema({
    animeId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    sources: [{
        name: {
            type: String,
            enum: ['otakudesu', 'kuramanime'],
            required: true
        },
        sourceId: {
            type: String,
            required: true
        },
        url: String,
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }],
    mergedData: {
        poster: String,
        episodes: String,
        releaseDay: String,
        score: String,
        genres: [String],
        synopsis: Schema.Types.Mixed,
        episodeList: [Schema.Types.Mixed],
        status: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 3600000), // 1 hour
        index: { expires: 0 } // TTL index
    }
});

// Indexes for efficient querying
AnimeCacheSchema.index({ title: 'text' });
AnimeCacheSchema.index({ 'sources.name': 1 });
AnimeCacheSchema.index({ createdAt: -1 });

export default mongoose.model<IAnimeCache>('AnimeCache', AnimeCacheSchema);
