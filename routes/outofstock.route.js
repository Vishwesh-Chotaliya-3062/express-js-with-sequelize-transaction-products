module.exports = (app) => {
  const outofstock = require("../Controllers/outofstock.controller");

  var router = require("express").Router();
  
  router.get("/outofstock", outofstock.getOutofstock);

  app.use("/", router);
};
