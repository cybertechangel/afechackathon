import express from 'express';
import * as IdeasController from './controller.js';
import limiter from '../../middlewares/limiter.js';

const router = express.Router();

router.get('/getIdeas', IdeasController.listIdeas);
router.get('/getIdea', IdeasController.getIdea);   
router.post('/postIdea', limiter, IdeasController.addIdea);


export default router;

