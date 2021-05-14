module.exports = (app) => {
    const transaction = require("../Controllers/transactions.controller");
  
    var router = require("express").Router();
  
    router.get('/transactions', transaction.getSignup);

    router.post("/transactions", transaction.transactions);
  
    app.use("/", router);
  };
  