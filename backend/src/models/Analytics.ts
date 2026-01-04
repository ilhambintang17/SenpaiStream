import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
    date: Date;
    stats: {
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
        totalViews: number;
        uniqueViewers: number;
    };
    popularAnime: Array<{
        animeId: string;
        title: string;
        views: number;
        uniqueViewers: number;
    }>;
    sources: {
        otakudesu: {
            requests: number;
            errors: number;
            avgResponseTime: number;
        };
        kuramanime: {
            requests: number;
            errors: number;
            avgResponseTime: number;
        };
    };
    cache: {
        hits: number;
        misses: number;
        hitRate: number;
    };
    serverMetrics: {
        uptime: number;
        memoryUsage: number;
        cpuUsage: number;
    };
}

const AnalyticsSchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
        index: true
    },
    stats: {
        totalUsers: { type: Number, default: 0 },
        activeUsers: { type: Number, default: 0 },
        newUsers: { type: Number, default: 0 },
        totalViews: { type: Number, default: 0 },
        uniqueViewers: { type: Number, default: 0 }
    },
    popularAnime: [{
        animeId: String,
        title: String,
        views: Number,
        uniqueViewers: Number
    }],
    sources: {
        otakudesu: {
            requests: { type: Number, default: 0 },
            errors: { type: Number, default: 0 },
            avgResponseTime: { type: Number, default: 0 }
        },
        kuramanime: {
            requests: { type: Number, default: 0 },
            errors: { type: Number, default: 0 },
            avgResponseTime: { type: Number, default: 0 }
        }
    },
    cache: {
        hits: { type: Number, default: 0 },
        misses: { type: Number, default: 0 },
        hitRate: { type: Number, default: 0 }
    },
    serverMetrics: {
        uptime: { type: Number, default: 0 },
        memoryUsage: { type: Number, default: 0 },
        cpuUsage: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Index for date range queries
AnalyticsSchema.index({ date: -1 });

// Static method to get or create today's analytics
AnalyticsSchema.statics.getTodayAnalytics = async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await this.findOne({ date: today });

    if (!analytics) {
        analytics = await this.create({ date: today });
    }

    return analytics;
};

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
