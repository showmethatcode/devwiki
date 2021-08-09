const { Router } = require("express");
const {
  home,
  createTerm,
  detailTerm,
  getUpdateTerm,
  postUpdateTerm,
} = require("./controllers/termController");

const router = Router();

router.get("/terms/recent", home);
router.post("/terms/write", createTerm);
router.route("/terms/:id/edit").get(getUpdateTerm).post(postUpdateTerm);
router.get("/terms/:id", detailTerm);

module.exports = router;
