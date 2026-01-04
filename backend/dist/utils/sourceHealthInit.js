import SourceHealth from '../models/SourceHealth.js';
import Analytics from '../models/Analytics.js';
/**
 * Initialize source health monitoring
 */
export async function initializeSourceHealth() {
    try {
        console.log('Initializing source health monitoring...');
        const sources = ['otakudesu', 'kuramanime'];
        for (const sourceName of sources) {
            const existing = await SourceHealth.findOne({ sourceName });
            if (!existing) {
                await SourceHealth.create({
                    sourceName,
                    isUp: true,
                    lastChecked: new Date(),
                    responseTime: 0,
                    errorCount: 0,
                    consecutiveFailures: 0,
                    uptime: 100,
                    lastSuccessfulCheck: new Date()
                });
                console.log(`✓ Created SourceHealth record for ${sourceName}`);
            }
            else {
                console.log(`✓ SourceHealth record already exists for ${sourceName}`);
            }
        }
        console.log('Source health monitoring initialized successfully');
    }
    catch (error) {
        console.error('Error initializing source health:', error);
        throw error;
    }
}
/**
 * Initialize analytics for today if not exists
 */
export async function initializeAnalytics() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await Analytics.findOne({ date: today });
        if (!existing) {
            await Analytics.create({ date: today });
            console.log('✓ Created analytics record for today');
        }
    }
    catch (error) {
        console.error('Error initializing analytics:', error);
    }
}
/**
 * Health check cron job - runs every minute
 */
export async function performHealthCheck() {
    const sources = ['otakudesu', 'kuramanime'];
    for (const sourceName of sources) {
        try {
            const config = require(`../configs/${sourceName}.config`).default;
            const startTime = Date.now();
            const response = await fetch(config.baseUrl, {
                method: 'HEAD',
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            const responseTime = Date.now() - startTime;
            const health = await SourceHealth.findOne({ sourceName });
            if (response.ok && health) {
                // Update health - source is UP
                health.isUp = true;
                health.lastChecked = new Date();
                health.responseTime = responseTime;
                health.consecutiveFailures = 0;
                health.lastSuccessfulCheck = new Date();
                await health.save();
                console.log(`✓ ${sourceName}: UP (${responseTime}ms)`);
            }
            else if (health) {
                // Update health - source is DOWN
                health.isUp = false;
                health.lastChecked = new Date();
                health.errorCount += 1;
                health.consecutiveFailures += 1;
                health.lastError = `HTTP ${response.status}`;
                await health.save();
                console.log(`✗ ${sourceName}: DOWN (HTTP ${response.status})`);
            }
        }
        catch (error) {
            const health = await SourceHealth.findOne({ sourceName });
            if (health) {
                // Update health - source is DOWN
                health.isUp = false;
                health.lastChecked = new Date();
                health.errorCount += 1;
                health.consecutiveFailures += 1;
                health.lastError = error.message;
                await health.save();
                console.log(`✗ ${sourceName}: DOWN (${error.message})`);
            }
        }
    }
}
/**
 * Start health check interval
 */
export function startHealthMonitoring() {
    // Initial check
    performHealthCheck();
    // Check every 1 minute
    setInterval(performHealthCheck, 60000);
    console.log('Health monitoring started (checks every 1 minute)');
}
