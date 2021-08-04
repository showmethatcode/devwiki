const { Router } = require("express");
const {
  home,
  termCreate,
  termDetail,
} = require("./controllers/termController");

const router = Router();

router.get("/", home);
router.post("/terms/write", termCreate);
router.get("/terms/:id", termDetail);

module.exports = router;
