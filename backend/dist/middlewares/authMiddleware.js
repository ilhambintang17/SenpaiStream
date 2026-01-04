import jwt from 'jsonwebtoken';
import appConfig from '../configs/app.config.js';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, appConfig.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
