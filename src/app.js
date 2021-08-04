const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = morgan("dev");
const router = require("./rest/routes");

function createApplication(prisma) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(logger);
  app.use((req, res, next) => {
    req.context = { req, res, prisma };
    next();
  });
  app.use(router);
  return app;
}

module.exports = createApplication;
