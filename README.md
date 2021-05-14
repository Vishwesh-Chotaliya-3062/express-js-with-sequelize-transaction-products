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

10. Run server.js file

PS D:\Node Js Projects\express-js-with-sequelize-transaction> node server
Server is running on port 8080.
Executing (default): CREATE TABLE IF NOT EXISTS `product` (`ProductID` INTEGER auto_increment , `ProductName` VARCHAR(255) NOT NULL, `SKU` VARCHAR(255) NOT NULL UNIQUE, `Price` INTEGER NOT NULL, `Quantity` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`ProductID`)) ENGINE=InnoDB;   
Executing (default): SHOW INDEX FROM `product`
Executing (default): CREATE TABLE IF NOT EXISTS `salesorder` (`SalesorderID` INTEGER auto_increment , `Items` TEXT NOT NULL, `Total` INTEGER NOT NULL, PRIMARY KEY (`SalesorderID`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `salesorder`

11. Send Post Request in Postman with address:

	localhost:8080/transactions 

12. Just pass SKUs of items which you want to Order in body part in postman as:

	{
    	    "SKU1":"CB0004",
   	    "SKU2":"HS0005"
	}

13. After Successfull Order:

	{
  	    "Transaction": "Finished setting the isolation level to read committed",
   	    "Lock": "Locked rows for SKUs CB0004,HS0005",
    	    "Total": "Selected quantities for items",
   	    "Success": "order created with id 38",
   	    "Update": "Deducted Quantities by 1 for CB0004,HS0005"
	}

14. With the right isolation and locking, for the place order transaction, one of the competing transactions will wait while the other is successful.


<!-- Out of stock error -->

15. So the waiting ones will get an “Out of stock error” in console like below:

PS D:\Node Js Projects\express-js-with-sequelize-transaction> node server
Server is running on port 8080.
Executing (default): CREATE TABLE IF NOT EXISTS `product` (`ProductID` INTEGER auto_increment , `ProductName` VARCHAR(255) NOT NULL, `SKU` VARCHAR(255) NOT NULL UNIQUE, `Price` INTEGER NOT NULL, `Quantity` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`ProductID`)) ENGINE=InnoDB;   
Executing (default): SHOW INDEX FROM `product`
Executing (default): CREATE TABLE IF NOT EXISTS `salesorder` (`SalesorderID` INTEGER auto_increment , `Items` TEXT NOT NULL, `Total` INTEGER NOT NULL, PRIMARY KEY (`SalesorderID`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `salesorder`
One of the items is out of stock Sabzi 1 Kg 
Rollback Successful

16. So the waiting ones will get an “Out of stock error” in response like below:

	{
    	     "error": "One of the items is out of stock Sabzi 1 Kg",
    	     "message": "Rollback successful"
	}