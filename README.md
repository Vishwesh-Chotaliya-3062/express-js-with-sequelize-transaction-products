1. We will set the isolation "Commited"
2. Start the transactions
3. Lock the rows by SKU, as SKU is unique.
4. Read the rows for stock
5. Calculate the order total and items
6. Insert the order in the order table
7. Update the product to deduct the quantity by 1.
8. Commit the transaction
9. If there is an issue between steps 3–8, it will rollback the whole transaction


<!-- Transactions as seen below: -->

10. run the project:  npm start

PS D:\Node Js Projects\express-js-with-sequelize-transaction-products> npm start

> express-js-with-sequelize-transaction@1.0.0 start
> nodemon .

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node .`
Connection has been established successfully.
Server is running on port 8080.
Executing (default): SELECT 1+1 AS result
Executing (default): CREATE TABLE IF NOT EXISTS `product` (`ProductID` INTEGER auto_increment , `ProductName` VARCHAR(255) NOT NULL, `SKU` VARCHAR(255) NOT NULL UNIQUE, `Price` INTEGER NOT NULL, `Quantity` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`ProductID`)) ENGINE=InnoDB;   
Executing (default): SHOW INDEX FROM `product`
Executing (default): CREATE TABLE IF NOT EXISTS `salesorder` (`SalesorderID` INTEGER auto_increment , `Items` TEXT NOT NULL, `Total` INTEGER NOT NULL, PRIMARY KEY (`SalesorderID`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `salesorder`

11. Send Request in Browser with address:

	localhost:8080/transactions 

	Executing (default): SELECT `ProductID`, `SKU`, `ProductName` FROM `product` AS `product`;

12. Select items which you want to Order.

	You can select upto three items.
	Minimum one item is required.
	Repeated items will be allowed but the price will be added according to the item's quantity.

	Now, Transaction begins.

13. Click on Purchase button.

14. If your selected items are in stock, it will commit the transaction and will successfully redirect you to the success page with the 	details of your purchased items, your order number, and your total amount of purchased items on:

	localhost:8080/success 

	Executing (default): SELECT `ProductID`, `SKU`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` = 'TU0001';
	Executing (default): SELECT `ProductID`, `SKU`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` = 'PA0003';
	Executing (default): SELECT `ProductID`, `SKU`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` = 'SA0004';
	[ 'TU0001', 'PA0003', 'SA0004' ]
	Executing (18ce1063-fa89-4381-8ee0-eab92e13cb13): START TRANSACTION;
	Executing (default): SELECT `ProductName`, `Quantity`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` IN ('TU0001', 'PA0003', 'SA0004') ORDER BY `product`.`ProductID`;
	[ 'Thumbs Up', 'Pasta', 'Sunglasses' ]
	2210
	Executing (18ce1063-fa89-4381-8ee0-eab92e13cb13): COMMIT;
	Executing (default): SELECT `SalesorderID` FROM `salesorder` AS `salesorder` ORDER BY `salesorder`.`SalesorderID` DESC LIMIT 1;
	Order Created with id 73
	Executing (default): SELECT `SalesorderID`, `Items` FROM `salesorder` AS `salesorder` ORDER BY `salesorder`.`SalesorderID` DESC LIMIT 1;
	Last Order ID: 73
	Items: Thumbs Up,Pasta,Sunglasses
	Thumbs Up
	Pasta
	Sunglasses
	Executing (default): SELECT GROUP_CONCAT(' ', `ProductID`) AS `ProductID`, GROUP_CONCAT(' ', `ProductName`) AS `ProductName` FROM `product` AS `product` WHERE `product`.`ProductName` IN ('Thumbs Up', 'Pasta', 'Sunglasses');
	Executing (default): SELECT `SalesorderID`, `Items`, `Total` FROM `salesorder` AS `salesorder` WHERE `salesorder`.`SalesorderID` = 73;

15. With the right isolation and locking, for the place order transaction, one of the competing transactions will wait while the other 		is successful.


<!-- Out of stock error -->

16. So transaction will be rollback and the waiting ones will get an “Out of stock error” in console like below and will be redirect 		you to the outofstock page with error message :

	[items] is out of stock!

	here, [items] will show your cart items which are not in stock.

	Executing (default): SELECT `ProductID`, `SKU`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` = 'TU0001';
	Executing (default): SELECT `ProductID`, `SKU`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` = 'PA0003';
	Executing (default): SELECT `ProductID`, `SKU`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` = 'SA0004';
	[ 'TU0001', 'PA0003', 'SA0004' ]
	Executing (e0ab1355-35f1-40f1-afa5-889eae3fdaa7): START TRANSACTION;
	Executing (default): SELECT `ProductName`, `Quantity`, `Price` FROM `product` AS `product` WHERE `product`.`SKU` IN ('TU0001', 'PA0003', 'SA0004') ORDER BY `product`.`ProductID`;
	Executing (e0ab1355-35f1-40f1-afa5-889eae3fdaa7): ROLLBACK;
	One of the items is out of stock Thumbs Up
	Rollback Successful
	Cookies Items: [ 'TU0001', 'PA0003', 'SA0004' ]
	Executing (default): SELECT GROUP_CONCAT(' ', `ProductID`) AS `ProductID`, GROUP_CONCAT(' ', `ProductName`) AS `ProductName` FROM `product` AS `product` WHERE `product`.`SKU` IN ('TU0001', 'PA0003', 'SA0004') AND `product`.`Quantity` = 0;


Thank you!