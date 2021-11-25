const { Router } = require("express");
const {
  home,
  createTerm,
  detailTerm,
  getUpdateTerm,
  postUpdateTerm,
} = require("./controllers/termController");

const router = Router();

router.get("/terms", termListHandler);
router.get("/terms/latest", latestTermListHandler);
router.post("/terms", termCreateHandler);
router.get("/terms/:id", termDeleteHandler);
router.put("/terms/:id/edit", termUpdateHandler);
router.delete("/terms/:id", termDetailHanlder);

module.exports = router;
