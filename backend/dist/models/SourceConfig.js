import mongoose, { Schema, Document } from 'mongoose';
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
export default mongoose.model('SourceConfig', SourceConfigSchema);
