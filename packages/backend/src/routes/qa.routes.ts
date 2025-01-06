import { Router, Request, Response, NextFunction } from 'express';
import { qaController } from '../controllers/qa.controller';
import { upload } from '../services/file.service';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

router.post('/question', asyncHandler(qaController.askQuestion));
router.post('/document', upload.single('file'), asyncHandler(qaController.processDocument));

export const qaRoutes = router; 