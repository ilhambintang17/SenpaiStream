import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import appConfig from '../configs/app.config.js';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Store failed login attempts (in production, use Redis)
const failedAttempts = new Map<string, { count: number; lastAttempt: Date }>();

/**
 * POST /api/admin/login
 * Admin login with rate limiting protection
 */
export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Username and password are required'
            });
        }

        const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

        // Check failed attempts
        const attempts = failedAttempts.get(clientIp);
        if (attempts && attempts.count >= 5) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
            const lockoutDuration = 15 * 60 * 1000; // 15 minutes

            if (timeSinceLastAttempt < lockoutDuration) {
                const remainingTime = Math.ceil((lockoutDuration - timeSinceLastAttempt) / 1000 / 60);
                return res.status(429).json({
                    statusCode: 429,
                    message: `Too many failed attempts. Please try again in ${remainingTime} minutes.`
                });
            } else {
                // Reset after lockout period
                failedAttempts.delete(clientIp);
            }
        }

        // Verify credentials
        if (username !== ADMIN_USERNAME) {
            recordFailedAttempt(clientIp);
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid credentials'
            });
        }

        // In production, you should hash the password in .env and compare
        // For now, direct comparison (will hash later if needed)
        const isPasswordValid = password === ADMIN_PASSWORD;

        if (!isPasswordValid) {
            recordFailedAttempt(clientIp);
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid credentials'
            });
        }

        // Clear failed attempts on successful login
        failedAttempts.delete(clientIp);

        // Generate JWT token
        const token = jwt.sign(
            { username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Login successful',
            data: {
                token,
                username,
                role: 'admin',
                expiresIn: '24h'
            }
        });
    } catch (error: any) {
        res.status(500).json({
            statusCode: 500,
            message: 'Login failed',
            error: error.message
        });
    }
};

/**
 * Record failed login attempt
 */
function recordFailedAttempt(clientIp: string) {
    const current = failedAttempts.get(clientIp);

    if (current) {
        failedAttempts.set(clientIp, {
            count: current.count + 1,
            lastAttempt: new Date()
        });
    } else {
        failedAttempts.set(clientIp, {
            count: 1,
            lastAttempt: new Date()
        });
    }
}

/**
 * POST /api/admin/logout
 * Admin logout (client-side token removal mostly)
 */
export const adminLogout = async (req: Request, res: Response) => {
    res.status(200).json({
        statusCode: 200,
        message: 'Logout successful'
    });
};

/**
 * GET /api/admin/me
 * Get current admin info
 */
export const getAdminInfo = async (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(200).json({
        statusCode: 200,
        data: {
            username: user.username,
            role: user.role
        }
    });
};
