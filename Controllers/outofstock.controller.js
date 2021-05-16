const db = require("../models");
const Product = db.product;

var express = require('express');
var app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser());

exports.getOutofstock = async (req, res, next) => {
  try {

    const purchaseditemList = req.cookies;
    console.log("items", purchaseditemList.items);

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
        SKU : purchaseditemList.items,
        Quantity: 0
      },
    });

    res.render("outofstock", {
      productList: productList
    });
  } catch (error) {
    return res.status(500).json(500, false, error.message);
  }
};
