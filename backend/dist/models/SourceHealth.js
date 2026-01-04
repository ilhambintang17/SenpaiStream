import mongoose, { Schema, Document } from 'mongoose';
const SourceHealthSchema = new Schema({
    sourceName: {
        type: String,
        enum: ['otakudesu', 'kuramanime'],
        required: true,
        unique: true
    },
    isUp: {
        type: Boolean,
        default: true
    },
    lastChecked: {
        type: Date,
        default: Date.now
    },
    responseTime: {
        type: Number,
        default: 0
    },
    errorCount: {
        type: Number,
        default: 0
    },
    lastError: {
        type: String,
        default: null
    },
    consecutiveFailures: {
        type: Number,
        default: 0
    },
    uptime: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    lastSuccessfulCheck: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
// Methods
SourceHealthSchema.methods.recordSuccess = async function (responseTime) {
    this.isUp = true;
    this.lastChecked = new Date();
    this.responseTime = responseTime;
    this.consecutiveFailures = 0;
    this.lastSuccessfulCheck = new Date();
    // Calculate uptime (simple moving average)
    const totalChecks = this.errorCount + 1;
    const successfulChecks = totalChecks - this.errorCount;
    this.uptime = (successfulChecks / totalChecks) * 100;
    await this.save();
};
SourceHealthSchema.methods.recordFailure = async function (error) {
    this.isUp = false;
    this.lastChecked = new Date();
    this.lastError = error;
    this.errorCount += 1;
    this.consecutiveFailures += 1;
    // Recalculate uptime
    const totalChecks = this.errorCount + 1;
    const successfulChecks = totalChecks - this.errorCount;
    this.uptime = (successfulChecks / totalChecks) * 100;
    await this.save();
};
export default mongoose.model('SourceHealth', SourceHealthSchema);
