import CommentsController from './controller.js'

import express, {Router} from 'express'
import limiter from '../../middlewares/limiter.js'

const app = express()
const router = Router()

router.get('/getComments', CommentsController.getComments)
router.post('/postComments', limiter, CommentsController.postComments)

export default router