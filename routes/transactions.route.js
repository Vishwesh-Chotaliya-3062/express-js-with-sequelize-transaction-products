module.exports = (app) => {
    const transaction = require("../Controllers/transactions.controller");
  
    var router = require("express").Router();
  
    router.post("/transactions", transaction.transactions);
  
    app.use("/", router);
  };
  