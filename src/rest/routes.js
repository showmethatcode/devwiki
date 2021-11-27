import { Router } from 'express'
import {
  termListController,
  latestTermListController,
  termCreateController,
  termDetailController,
  termUpdateController,
  revisionListController,
} from './controllers/terms/index.js'

const router = Router()

router.get('/terms', termListController)
router.get('/terms/latest', latestTermListController)
router.post('/terms', termCreateController)
router.get('/terms/:id', termDetailController)
router.put('/terms/:id', termUpdateController)
router.get('/terms/:id/revisions', revisionListController)

export default router
