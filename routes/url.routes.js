import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/shorten', isAuthenticated, async (req, res) => {});

export default router;
