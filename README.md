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
PS D:\Node Js Projects\nodejs-mysql-transaction-master> node index.js
Locked rows for skus RI0002,CB0004
Selected quantities for items
Quantity for Rice 1 Kg is 10
Quantity for Sabzi 1 Kg is 4
Order created
Deducted quantities by 1 for RI0002,CB0004
order created with id 1


10. With the right isolation and locking, for the place order transaction, one of the competing transactions will wait while the other is successful.
11. So the waiting ones will get an “Out of stock error” like below:

<!-- Out of stock error -->
PS D:\Node Js Projects\nodejs-mysql-transaction-master> node index.js
Finished setting the isolation level to read committed
Locked rows for skus RI0002,CB0004
Selected quantities for items
Quantity for Rice 1 Kg is 6
Error occurred while creating order: One of the items is out of stock Sabzi 1 Kg Error: One of the items is out of stock Sabzi 1 Kg
    at createOrder (D:\Node Js Projects\nodejs-mysql-transaction-master\index.js:23:15)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    at async testOrderCreate (D:\Node Js Projects\nodejs-mysql-transaction-master\index.js:51:15)
Rollback successful
error creating order