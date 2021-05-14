module.exports = (app) => {
    const success = require("../Controllers/success.controller");
  
    var router = require("express").Router();
  
    router.get('/success', success.getSuccess);
  
    app.use("/", router);
  };
  