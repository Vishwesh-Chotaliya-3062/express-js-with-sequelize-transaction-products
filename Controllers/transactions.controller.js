const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

exports.getSignup = async (req, res, next) => {
  res.render('shoppingcart');
};

exports.transactions = (req, res) => {
  async function createOrder() {

    const SKU1 = req.body.SKU1;
    const SKU2 = req.body.SKU2;
    // const SKU3 = req.body.SKU3;
    // const SKU4 = req.body.SKU4;
    // const SKU5 = req.body.SKU5;
    const items = [SKU1, SKU2];

    console.log(items)

    const connection = await mysql.createConnection(dbConfig.db);

    await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");

    //set wait timeout and lock wait timeout as per need.
    await connection.beginTransaction();

    try {
      await connection.execute(
        "SELECT ProductID, ProductName FROM product WHERE SKU IN (?, ?) FOR UPDATE",
        items
      );

      const [itemsToOrder] = await connection.execute(
        "SELECT ProductName, Quantity, Price from product WHERE SKU IN (?, ?) ORDER BY ProductID",
        items
      );

      let orderTotal = 0;
      let orderItems = [];

      for (itemToOrder of itemsToOrder) {
        if (itemToOrder.Quantity < 1) {
          throw new Error(
            `One of the items is out of stock ${itemToOrder.ProductName}`
          );
        }

        orderTotal += itemToOrder.Price;
        orderItems.push(itemToOrder.ProductName);
      }

      await connection.execute(
        "INSERT INTO salesorder (Items, Total) VALUES (?, ?)",
        [orderItems.join(), orderTotal]
      );

      await connection.execute(
        `UPDATE product SET Quantity=Quantity - 1 WHERE SKU IN (?, ?)`,
        items
      );

      await connection.commit();
      const [rows] = await connection.execute(
        "SELECT LAST_INSERT_ID() as order_SalesorderID"
      );

        console.log(`Order Created with id ${rows[0].order_SalesorderID}`)

        res.redirect('success');
    } catch (err) {
      connection.rollback();
      res
        .status(500)
        .json({ error: `${err.message}`, message: "Rollback successful" });

      console.log(`${err.message} \n` + "Rollback Successful")
    }
  }

  (async function testOrderCreate() {
    await createOrder();
  })();
};
