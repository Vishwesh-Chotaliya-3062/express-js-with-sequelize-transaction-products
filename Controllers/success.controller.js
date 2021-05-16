const db = require("../models");
const Product = db.product;
const Salesorder = db.salesorder;

var express = require('express');
var app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser());

exports.getSuccess = async (req, res, next) => {
  try {

    const purchaseditemList = req.cookies;
    console.log("items", purchaseditemList.items);

    const salesorderID = req.cookies;
    console.log("SalesorderID", salesorderID.SalesorderID);

    const productList = await Product.findAll({
      attributes: [
        [
          db.sequelize.fn("GROUP_CONCAT", " ", db.sequelize.col("ProductID")),
          "ProductID",
        ],
        [
          db.sequelize.fn("GROUP_CONCAT" , " ",  db.sequelize.col("ProductName")),
          "ProductName",
        ],
      ],
      where: {
        SKU : purchaseditemList.items
      },
    });

    const salesorderList = await Salesorder.findAll({
      where: {
        SalesorderID : salesorderID.SalesorderID
      },
    });

    res.render("success", {
      productList: productList,
      salesorderList: salesorderList
    });

  } catch (error) {
    return res.status(500).json(500, false, error.message);
  }
};