
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import appConfig from '@configs/app.config.js';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, appConfig.JWT_SECRET || 'fallback_secret', (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
