import mongoose, { Schema, Document } from 'mongoose';

export interface ISourceConfig extends Document {
    sourceName: 'otakudesu' | 'kuramanime';
    baseUrl: string;
    isActive: boolean;
    lastUpdated: Date;
    updatedBy?: string;
}

const SourceConfigSchema = new Schema({
    sourceName: {
        type: String,
        enum: ['otakudesu', 'kuramanime'],
        required: true,
        unique: true
    },
    baseUrl: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model<ISourceConfig>('SourceConfig', SourceConfigSchema);
