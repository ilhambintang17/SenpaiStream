import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import SourceHealth from '../models/SourceHealth.js';
import AnimeCache from '../models/AnimeCache.js';
import ViewHistory from '../models/ViewHistory.js';
import SourceConfig from '../models/SourceConfig.js';
export const getAllUsers = async (req, res, next) => {
    try {
        // Implement pagination in a real scenario
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.status(200).json({
            statusCode: 200,
            data: {
                users: { total: totalUsers, active: 0, growth: 0 },
                views: { total: 0, unique: 0 },
                popular: [],
                server: {
                    uptime: Math.floor(process.uptime()),
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage()
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};
/**
 * GET /api/admin/sources
 * Get anime source health
 */
export const getSourcesHealth = async (req, res) => {
    try {
        const sources = await SourceHealth.find().sort({ sourceName: 1 });
        res.status(200).json({
            statusCode: 200,
            data: { sources: sources || [] }
        });
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};
/**
 * GET /api/admin/configs
 * Get all source configurations
 */
export const getSourceConfigs = async (req, res) => {
    try {
        const configs = await SourceConfig.find().sort({ sourceName: 1 });
        res.status(200).json({
            statusCode: 200,
            data: { configs }
        });
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};
/**
 * PUT /api/admin/configs/:sourceName
 * Update source configuration
 */
export const updateSourceConfig = async (req, res) => {
    try {
        const { sourceName } = req.params;
        const { baseUrl, isActive } = req.body;
        if (!baseUrl) {
            return res.status(400).json({
                statusCode: 400,
                message: 'baseUrl is required'
            });
        }
        // Validate URL format
        try {
            new URL(baseUrl);
        }
        catch {
            return res.status(400).json({
                statusCode: 400,
                message: 'Invalid URL format'
            });
        }
        let config = await SourceConfig.findOne({ sourceName: sourceName });
        if (!config) {
            // Create if not exists
            config = await SourceConfig.create({
                sourceName: sourceName,
                baseUrl,
                isActive: isActive !== undefined ? isActive : true,
                lastUpdated: new Date(),
                updatedBy: req.user?.username || 'admin'
            });
        }
        else {
            // Update existing
            config.baseUrl = baseUrl;
            config.isActive = isActive !== undefined ? isActive : true;
            config.lastUpdated = new Date();
            config.updatedBy = req.user?.username || 'admin';
            await config.save();
        }
        res.status(200).json({
            statusCode: 200,
            message: `Source ${sourceName} updated successfully`,
            data: { config }
        });
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};
