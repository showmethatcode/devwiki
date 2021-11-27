import { Router } from 'express'
import { latestTermListHandler } from './controllers/terms/index.js'

const router = Router()

// router.get("/terms", termListHandler);
router.get('/terms/latest', latestTermListHandler)
// router.post("/terms", termCreateHandler);
// router.get("/terms/:id", termDeleteHandler);
// router.put("/terms/:id/edit", termUpdateHandler);
// router.delete("/terms/:id", termDetailHanlder);

export default router
