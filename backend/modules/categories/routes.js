import CategoriesController from './controller.js'

import express, {Router} from 'express'
const app = express()
const router = Router()

router.get('/getCategories', CategoriesController.getCategories)
/*router.post('/postCategories', CategoriesController.postCategories)*/

export default router