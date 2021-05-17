const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

const db = require("../models");
const Product = db.product;
const Salesorder = db.salesorder;

var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser());

exports.getTransactions = async (req, res, next) => {
  try {
    const productList = await Product.findAll({
      attributes: ["ProductID", "SKU", "ProductName"],
    });

    res.render("shoppingcart", {
      productList: productList,
    });
  } catch (error) {
    return res.status(500).json(500, false, error.message);
  }
};

exports.transactions = (req, res) => {
  async function createOrder() {
    const sku1 = req.body.SKU1;
    const sku2 = req.body.SKU2;
    const sku3 = req.body.SKU3;

    const SKU1 = sku1.substring(0, 6);
    const SKU2 = sku2.substring(0, 6);
    const SKU3 = sku3.substring(0, 6);

    const items = [SKU1, SKU2, SKU3];

    const product1List = await Product.findOne({
      attributes: ["ProductID", "SKU", "Price"],
      where: {
        SKU: SKU1,
      },
    });

    const product2List = await Product.findOne({
      attributes: ["ProductID", "SKU", "Price"],
      where: {
        SKU: SKU2,
      },
    });

    const product3List = await Product.findOne({
      attributes: ["ProductID", "SKU", "Price"],
      where: {
        SKU: SKU3,
      },
    });

    console.log(items);
    res.cookie("items", items);

    const connection = await mysql.createConnection(dbConfig.db);

    await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");

    // First, we start a transaction and save it into a variable
    const t = await db.sequelize.transaction();

    try {
      // Then, we do some calls passing this transaction as an option:

      await connection.execute(
        "SELECT ProductID, ProductName FROM product WHERE SKU IN (?, ?, ?) FOR UPDATE",
        items
      );

      // await Product.findAll({
      //   attributes: ["ProductID", "ProductName"],
      //   where: {
      //     SKU: items,
      //   }
      // });

      // const [itemsToOrder] = await connection.execute(
      //   "SELECT ProductName, Quantity, Price from product WHERE SKU IN (?, ?, ?) ORDER BY ProductID",
      //   items
      // );

      const itemsToOrder = await Product.findAll({
        attributes: ["ProductName", "Quantity", "Price"],
        order: [["ProductID"]],
        where: {
          SKU: items,
        },
      });

      let orderTotal = 0;
      let orderItems = [];

      for (itemToOrder of itemsToOrder) {
        if (itemToOrder.Quantity < 1) {
          throw new Error(
            `One of the items is out of stock ${itemToOrder.ProductName}`
          );
        }

        orderTotal =
          product1List.Price + product2List.Price + product3List.Price;
        orderItems.push(itemToOrder.ProductName);
      }
      await connection.execute(
        "INSERT INTO salesorder (Items, Total) VALUES (?, ?)",
        [orderItems.join(), orderTotal],
        console.log(orderItems),
        console.log(orderTotal)
      );

      await connection.execute(
        `UPDATE product SET Quantity=Quantity - 1 WHERE SKU IN (?, ?, ?)`,
        items
      );

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();

      // const [rows] = await connection.execute(
      //   "SELECT LAST_INSERT_ID() as order_SalesorderID"
      // );

      const rows = await Salesorder.findOne({
    
        attributes: ["SalesorderID"],
        order: [['SalesorderID', 'DESC']],
        limit: 1,
      })

      const SalesorderID = rows.dataValues.SalesorderID;
      
      console.log(`Order Created with id ${SalesorderID}`);

      // res.cookie("SalesorderID", SalesorderID);

      res.redirect("success");

    } catch (err) {

      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();

      await res.redirect("outofstock");
      // res
      //   .status(500)
      //   .json({ error: `${err.message}`, message: "Rollback successful" });

      console.log(`${err.message} \n` + "Rollback Successful");
    }
  }

  (async function testOrderCreate() {
    await createOrder();
  })();
};
