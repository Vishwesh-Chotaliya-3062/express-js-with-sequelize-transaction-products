module.exports = (app) => {
  const transaction = require("../Controllers/transactions.controller");
  
  var router = require("express").Router();

  var cookieParser = require('cookie-parser');
  app.use(cookieParser());

  router.get("/transactions", transaction.getTransactions);

  router.post("/transactions", transaction.transactions);

  app.use("/", router);
};
