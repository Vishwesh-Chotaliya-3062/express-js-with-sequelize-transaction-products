const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

db.sequelize.sync();
// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

require("./routes/transactions.route")(app);

require("./routes/success.route")(app);

require("./routes/outofstock.route")(app);

app.use(express.static(path.join(__dirname, 'views')));


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
