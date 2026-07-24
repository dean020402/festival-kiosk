import {Router} from 'express';
import {verifyPin} from '../controllers/adminController';

const router =Router();

router.post('/verify-pin', verifyPin);

export default router;