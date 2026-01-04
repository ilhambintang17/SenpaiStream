import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import * as adminController from '../controllers/adminController.js';
import * as adminAuthController from '../controllers/adminAuthController.js';

const router = Router();

const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
};

// Authentication endpoints (no auth required)
router.post('/login', adminAuthController.adminLogin);
router.post('/logout', adminAuthController.adminLogout);
router.get('/me', authenticateToken, adminAuthController.getAdminInfo);

// Public endpoints (no auth required for setup)
router.get('/stats', adminController.getStats);
router.get('/configs', adminController.getSourceConfigs);
router.put('/configs/:sourceName', adminController.updateSourceConfig);

// Protected endpoints (require admin auth)
router.use(authenticateToken);
router.use(requireAdmin);

// User management
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Source health
router.get('/sources', adminController.getSourcesHealth);

export default router;
