import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import * as userController from '../controllers/userController.js';
const router = Router();
router.use(authenticateToken); // Protect all user routes
// Watchlist
router.get('/watchlist', userController.getWatchlist);
router.post('/watchlist', userController.addToWatchlist);
router.delete('/watchlist/:animeId', userController.removeFromWatchlist);
router.get('/watchlist/:animeId/status', userController.checkWatchlistStatus);
// History
router.get('/history', userController.getHistory);
router.post('/history', userController.updateHistory);
// Ratings
router.post('/rating', userController.setRating);
router.get('/rating/:animeId', userController.getUserRating);
export default router;
