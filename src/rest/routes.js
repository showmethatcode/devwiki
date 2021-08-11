const { Router } = require("express");
const getRecentTermList = require("./controllers/terms/home");
const createTerm = require("./controllers/terms/createTerm");
const detailTerm = require("./controllers/terms/detailTerm");
const {
  getUpdateTerm,
  postUpdateTerm,
} = require("./controllers/terms/updateTerm");

const router = Router();

router.get("/terms/recent", getRecentTermList);
router.post("/terms/write", createTerm);
router.route("/terms/:id/edit").get(getUpdateTerm).post(postUpdateTerm);
router.get("/terms/:id", detailTerm);

module.exports = router;
