const db = require("../models");
const Product = db.product;
const Salesorder = db.salesorder;

var express = require('express');
var app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser());

exports.getSuccess = async (req, res, next) => {
  try {

    // const purchaseditemList = req.cookies;
    // console.log("Cookies Items:", purchaseditemList.items);

    // const salesorderID = await db.sequelize.query("select * from salesorder order by SalesorderID desc limit 1")

    const salesorderID = await Salesorder.findOne({
    
      attributes: ["SalesorderID","Items"],
      order: [['SalesorderID', 'DESC']],
      limit: 1,
    })

    const SalesorderID = salesorderID.dataValues.SalesorderID;
    console.log("Last Order ID:", SalesorderID);

    const Items = salesorderID.dataValues.Items;
    console.log("Items:", Items)

    const Item1 = Items.substring(0, Items.indexOf(","))
    console.log(Item1);

    const Item2 = Items.substring(Items.indexOf(",") + 1, Items.lastIndexOf(","))
    console.log(Item2);

    const Item3 = Items.substring(Items.lastIndexOf(",") + 1)
    console.log(Item3);

    let allItems = [Item1, Item2, Item3];
    
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
        ProductName : allItems
      },
    });

    const salesorderList = await Salesorder.findAll({
      where: {
        SalesorderID : SalesorderID
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